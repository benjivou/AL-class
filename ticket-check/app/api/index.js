const express  = require('express');
const bodyParser = require('body-parser');
const app =  express();
const axios = require("axios");
const mem = require('../models/internal-mem');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

/******************check whether the ticket is valid or not by its id ******************/
app.get("/:id", async (req, res) => {
    /*Here we will add a publish into the kafka event to say that the ticket has been controlled by .. */
    await mem.updateOne({"_id": req.body.tripId,"tickets._id":req.params.id},{$set: {
            'tickets.$.controller': req.body.controller
        }}, function(err) {
        if(err !== null) console.log(err)
    });
    const ticketCheck = await verifyTicket(req.params.id, req.body.tripId);
    return res.status(200).json(ticketCheck);
});

app.post("/", async (req, res) => {
    console.log(req.body);
    const ticketCheck = await verifyTicket(req.body.ticketId, req.body.tripId, req.body.date);
    return res.status(200).json(ticketCheck);
});




 /******************find ticket and check whether the infos in it are valid or not******************/
async function verifyTicket(ticketId, tripId, controlDate){
    console.log(controlDate);
    let ticket = undefined ;
    let stops= undefined ;
    let infos = (await mem.find({'_id' : tripId}))[0];
    console.log('INFOS', infos);
    if(infos !== undefined){
        ticket = await infos.tickets.find( element => element._id === ticketId) ;
        stops= infos.trainStops ;
        let currentStop = infos.currentStop;
        let nextStop = infos.nextStop;
        let result  = false ;
        if(ticket !== undefined)
        {
            console.log("TICKET", ticket);
            if(stops.indexOf(currentStop) >= stops.indexOf(ticket.departure)){
                if(stops.indexOf(ticket.destination) >= stops.indexOf(nextStop)){
                    if (stops.indexOf(ticket.destination) > stops.indexOf(ticket.departure)){
                        if(new Date(controlDate) > new Date(ticket.date)){ //If the ticket has been controlled when it has already been bought
                            console.log("ind");
                            result = true;
                            console.log(result);
                        } else {
                            console.log("Ticket has been bought after the control");
                            result = false;
                        }
                    } else {
                        if(new Date(controlDate) > new Date(ticket.date)){ //If the ticket has been controlled when it has already been bought
                            console.log("ind")
                        };
                        console.log("station issue");
                        result = false;
                    }
                }else{
                    console.log("ind False ");
                    result = false;
                }
            }else {
                console.log("ind False 2");
                result = false;
            }

        }
        else {
            result = false;
            return {"result" : result, "type":"ticket unfound"};
        }
        return {"result" : result, "type" : ticket.type, "ticket" : ticket };
    } else {
        return {"result": false, "type":"trip not found"}
    }

}



module.exports = app;
