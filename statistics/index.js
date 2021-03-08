const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
app.use(cors());
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv/config');
const Statistics = require('./app/models/statistics');
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'statistics',
    brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'statistics'});

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

app.post('/',async (req,res)=>{
    console.log(req.body);
    let stats = new Statistics({
        _id : req.body._id,
        tickets : req.body.tickets,
        frauds: req.body.frauds
    });
    try{
        let savedStats = await stats.save();
        await res.json(savedStats);
    }catch (e) {
        console.log(e)
    }

});

const statsService_router = require('./app/api/index');
app.use('/stats',statsService_router);


const run = async () => {

    await consumer.connect();
    await consumer.subscribe({ topic: 'controlledTickets', fromBeginning: true });
    await consumer.subscribe({ topic: 'declaredFrauds', fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            let found = null ;
            if (message.key !== undefined){
                found = await Statistics.findOne({_id : message.key.toString() });
            }
            if(topic ==='controlledTickets'){
                let ticket = JSON.parse(message.value.toString());
                console.log(found);

                if(found === null){
                    console.log(found);
                    let stats = new Statistics({
                        _id : message.key.toString(),
                        tickets : [ticket],
                        frauds: []
                    });
                    try{
                        let saved = await stats.save();
                        console.log(saved);
                    }catch (e) {
                        console.log(e)
                    }
                }else {
                    await Statistics.findOneAndUpdate({_id: message.key.toString()},  { $push: { tickets: ticket}},function(err){
                        if(err){
                            console.log(err);
                        }});
                }

            }else  if(topic ==='declaredFrauds'){
                let fraud = JSON.parse(message.value.toString());
                if(found === null){
                    let stats = new Statistics({
                        _id : message.key.toString(),
                        tickets : [],
                        frauds: [fraud]
                    });
                    try{
                        await stats.save();
                    }catch (e) {
                        console.log(e)
                    }
                }else {
                    await Statistics.findOneAndUpdate({_id: message.key.toString()},  { $push: { frauds: fraud}},function(err){
                        if(err){
                            console.log(err);
                        }});
                }
            }
        }})};

run().catch(console.error);

// localhost:3009
app.listen(3009, () => {
    console.log(" Statistics is up and listening on 3009...")
});
