const express  = require('express');
const bodyParser = require('body-parser');
const app =  express();
const Ticket = require('../models/infos');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

/******************Get all Tickets that have that trip Id ******************/

app.get("/tickets/:tripId", async (req, res) => {
    try{
        const tickets = await Ticket.find({'tripId': req.params.tripId} );
        await res.json(tickets);
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
        trainRef: req.body.trainRef,
        departure : req.body.departure,
        destination: req.body.destination,
        price : req.body.price,
        date :  req.body.date
    });
    try{
        const savedTicket = await ticket.save();
        await res.json(savedTicket);
    }catch(err) {
        await res.json({message: err});
    }
});



module.exports = app;