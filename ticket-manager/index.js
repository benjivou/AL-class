const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
app.use(cors());
const bodyParser = require('body-parser');
const mem = require('./app/models/tickets-model');
require('dotenv/config');

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

const ticket_manager_router = require('./app/api/index.js');
app.use('/start',ticket_manager_router);
app.post('/ticket', async (req,resp)=>{
    try{
        let updated =  await mem.findOneAndUpdate({_id: req.body.tripId},  { $push: { tickets: req.body}});
        return resp.json(updated)
    }catch (e) {
        console.log(e);
        return resp.json(e)
    }
});


const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'ticketManager',
    brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'ticketManager'});




const run = async () => {

    await consumer.connect();
    await consumer.subscribe({ topic: 'tickets', fromBeginning: true });
    await consumer.subscribe({ topic: 'tripInfos', fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {

            if( (topic==='tickets') && (message.key.toString() === 'Ab34735')){
                let ticket = JSON.parse(message.value.toString());
                let modified = await mem.findOneAndUpdate({_id: ticket.tripId},  { $push: { tickets: ticket}});
                console.log(modified);
                console.log(JSON.parse(message.value.toString()));
                console.log('HEEEEEEEEEEEEEERE');
            }else if((topic==='tripInfos') && (message.key.toString() === 'Ab34735')){
                let stations = JSON.parse(message.value.toString());
                let modified = await mem.findOneAndUpdate({_id: stations._id},  { $set: { currentStop: stations.currentStop, nextStop: stations.nextStop}});
                console.log(modified);
                console.log(JSON.parse(message.value.toString()));
                console.log('HEEEEEEEEEEEEEERE');
            }
        },
    })

};
run().catch(console.error);




app.listen(3011, () => {
    console.log(" Ticket manager component is up and listening on 3011...")
});