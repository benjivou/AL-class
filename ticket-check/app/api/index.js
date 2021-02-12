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


/******************find ticket and check whether the infos in it are valid or not******************/
async function verifyTicket(id,tripId){
    let ticket = undefined ;
    let stops= undefined ;
    let infos = await mem.findOne({"_id": tripId}) ;
    ticket = await infos.tickets.find( element => element._id === id) ;
    stops= infos.trainStops ;
    let currentStop = infos.currentStop;
    let nextStop = infos.nextStop;
    let result  = false ;
    if(ticket !== undefined)
    {
        console.log("in");
        if(stops.indexOf(currentStop) >= stops.indexOf(ticket.departure)){
            if(stops.indexOf(ticket.destination) >= stops.indexOf(nextStop)){
                if (stops.indexOf(ticket.destination) > stops.indexOf(ticket.departure)){
                    console.log("ind");
                    result = true;
                    console.log(result);
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


}



module.exports = app;