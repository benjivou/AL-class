const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const axios = require('axios');
app.use(cors());
const bodyParser = require('body-parser');
require('dotenv/config');
const mem = require('./app/models/internal-mem');

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'ticketCheck',
    brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'ticketCheckConsumer'});


const run = async () => {

    await consumer.connect();
    await consumer.subscribe({ topic: 'tickets', fromBeginning: true });


    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {

            if(topic === 'tickets'){
                console.log('HEEEEEEEEEEEEEERE');
            }
        },
    })
};
run().catch(console.error);



app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next()
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('short'));

mongoose.connect(process.env.DB_CONNECTION,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(()=>{
        console.log(`connection to database established`)});

const ticketCheckService_router = require('./app/api/index.js');
app.use('/ticketCheck',ticketCheckService_router);

const startService_router = require('./app/api/start.js');
app.use('/start',startService_router);


/******************get train's current Stop******************/
app.get('/currentStop', async (req, res) =>{
    let infos = await mem.find();
   await res.status(200).json(infos[0].currentStop);
});


app.listen(3003, () => {
    console.log(" Ticket ckeck component is up and listening on 3003...")
});
