const express  = require('express');
const bodyParser = require('body-parser');
const app =  express();
const Ticket = require('../models/infos');

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'ticketBooking',
    brokers: ['kafka:9092']
});



const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'ticketBooking'});

const run = async () => {
    console.log("I am here");
    await consumer.connect();
    await consumer.subscribe({topic: 'startTrip', fromBeginning: true});
    await consumer.run({
        eachMessage: async ({topic, partition, message}) => {
            try{
                const tickets = await Ticket.find({'tripId': message.key.toString()} );
                await pushTicketOnKafka(message.key.toString(),tickets)
            }catch(err) {
                console.log(err)
            }
        }
    })
}

run().catch(console.error);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

/******************Get all Tickets that have that trip Id ******************/

app.get("/tickets/:tripId", async (req, res) => {
    try{
        const tickets = await Ticket.find({'tripId': req.params.tripId} );
        await res.json(req.params.tripId,tickets);
    }catch(err) {
        await res.json({message: err});
    }
});

/******************Add a new Ticket ******************/

app.post("/",async (req,res) => {
    const ticket = new Ticket({
        _id : req.body.id ,
        passengerName : req.body.passengerName ,
        type : req.body.type ,
        tripId: req.body.tripId,
        departure : req.body.departure,
        destination: req.body.destination,
        price : req.body.price,
        date :  req.body.date
    });
    try{
        const savedTicket = await ticket.save();
        await pushTicketOnKafka(req.body.tripId,ticket);
        await res.json(savedTicket);
        await res.json({ok : 'ok'});
    }catch(err) {
        await res.json({message: err});
    }
});

async function pushTicketOnKafka(tripId,ticket){
    await producer.connect();
    console.log('connected');
    await producer.send({
        topic: 'tickets',
        messages: [
            {key: tripId,value:JSON.stringify( ticket)}
        ],
    });
    console.log('sended');
}



module.exports = app;
