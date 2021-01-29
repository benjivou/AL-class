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
    await mem.updateOne({"tickets._id":req.params.id},{$set: {
            'tickets.$.controller': req.query.controllerId
        }}, function(err) {
        if(err !== null) console.log(err)
    });
    const ticketCheck = await verifyTicket(req.params.id);
    return res.status(200).json(ticketCheck);
});




/******************find ticket and check whether the infos in it are valid or not******************/
async function verifyTicket(id){
    let ticket = undefined ;
    let stops= undefined ;
    let infos = await mem.find() ;
    ticket = await infos[0].tickets.find( element => element._id === id) ;
    stops= infos[0].trainStops ;
    let currentStop = infos[0].currentStop;
    let nextStop = infos[0].nextStop;
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