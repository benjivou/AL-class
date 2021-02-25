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
    await consumer.subscribe({ topic: 'nextStation', fromBeginning: true });
    await consumer.subscribe({ topic: 'startTrip', fromBeginning: true });
    await consumer.subscribe({ topic: 'endTrip', fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            let found = undefined ;
            if (message.key !== undefined){
                found = mem.find({_id : message.key.toString() });
            }
            if( (topic==='tickets') && (found !== undefined)){
                console.log('tickets-received');
                let ticket = JSON.parse(message.value.toString());
                console.log(ticket);
                console.log(ticket.length);
                await mem.findOneAndUpdate({_id: message.key.toString()},  { $push: { tickets: ticket}},function(err){
                    if(err){
                        console.log(err);
                    }});
            }else if((topic==='nextStation') && (found !== undefined)){
                let stations = JSON.parse(message.value.toString());
                await mem.findOneAndUpdate({_id: stations._id},  { $set: { currentStop: stations.currentStop, nextStop: stations.nextStop}});
            }else if(topic==='startTrip') {
                let dd = JSON.parse(message.value.toString());
                let data = new mem(dd);
                try{
                    const saved = await data.save();
                    await consumer.subscribe({ topic: dd._id, fromBeginning: true });
                    console.log(saved);
                }catch(err) {
                    console.log(err);
                }
            }else if((topic === 'endTrip')&&(found!==undefined)){
                try{
                    mem.remove({_id : message.key.toString()},function(err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }catch(e){console.log(e);}
            }
        },
    })

};
run().catch(console.error);




app.listen(3011, () => {
    console.log(" Ticket manager component is up and listening on 3011...")
});