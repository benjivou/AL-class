const express  = require('express');
const bodyParser = require('body-parser');
const app =  express();
const Ticket = require('../models/infos');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/:id", async (req, res) => {
    try{
        const ticket = await Ticket.findById(req.params.id);
        await res.json(ticket);
    }catch(err) {
        await res.json({message: err});
    }
});

app.post("/",async (req,res) => {
    const ticket = new Ticket({
        _id : req.body.id ,
        passengerName : req.body.passengerName ,
        type : req.body.type ,
        trainRef: req.body.trainRef
    });
    try{
        const savedTicket = await ticket.save();
        await res.json(savedTicket);
    }catch(err) {
        await res.json({message: err});
    }
});



module.exports = app;