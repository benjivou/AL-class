const express  = require('express');
const bodyParser = require('body-parser');
const app =  express();
const axios = require("axios");
const mem = require('../models/internal-mem');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/:id", async (req, res) => {
   await mem.updateOne({"tickets._id":req.body.id},{$set: {
            'tickets.$.controller': req.body.controller
        }}, function(err) {console.log(err)});
    const ticketCheck = await verifyTicket(req.body.id);
        await res.json(ticketCheck);
});

app.get("/ticket/:id", async (req, res) => {
    let ticket = undefined;
    console.log(req.params.id);
    try{
       mem.find({"tickets._id": req.params.id }).exec(function(err, ticket1){
           ticket = ticket1.tickets;
            console.log(ticket1[0].tickets.find( element => element._id === req.params.id))
        });
        await res.json(ticket);
    }catch(err) {
        await res.json(ticket);
    }
});

async function verifyTicket(id){
    let ticket = undefined ;
    let stops= undefined ;
    let infos = await mem.find() ;
    ticket = await infos[0].tickets.find( element => element._id === id) ;
    let trainId = await infos[0].trainId ;
    let tripId = await infos[0]._id;
    stops= infos[0].trainStops ;
    let result  = false ;
    if(ticket !== undefined)
    {
        console.log("in");
        const url2 = "http://localhost:3005/train/currentStop/" + trainId + "/" + tripId;
        await axios.get(url2, { headers: { Accept: "application/json" } })
            .then(res => {
                console.log(stops.indexOf(ticket.destination) + "   " +  stops.indexOf(res.data.nextStop));
                console.log(stops);
                mem.findByIdAndUpdate(infos[0]._id,{"currentStop":res.data.currentStop}, function(err) {console.log(err)});
                if(stops.indexOf(res.data.currentStop) >= stops.indexOf(ticket.departure)){
                    if(stops.indexOf(ticket.destination) >= stops.indexOf(res.data.nextStop)){
                        console.log("ind");
                        result = true;
                        console.log(result);
                    }else{
                        console.log("ind False ");
                        result = false;
                    }
                }else {
                    console.log("ind False 2");
                    result = false;
                }
            });
    }
    else {
        result = false;
        return {"result" : result, "type":"ticket unfound"};
    }
    return {"result" : result, "type" : ticket.type, "ticket" : ticket };


}



module.exports = app;