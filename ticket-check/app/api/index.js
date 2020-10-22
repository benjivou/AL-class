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
        const ticketCheck = await verifyTicket(req.params.id);
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
    let currentTrainId = undefined ;
    let stops= undefined ;
    let infos = await mem.find({"tickets._id": id}) ;
   ticket = await infos[0].tickets.find( element => element._id === id) ;
    currentTrainId = await infos[0].trainId ;
    stops= infos[0].trainStops ;

    console.log("Ticket" + ticket);
    console.log("TrainId" + currentTrainId);
    console.log("stops" + stops);
    console.log(ticket.departure);
    console.log(ticket.destination);
    let resultat  = false ;
    if(ticket !== undefined)
    {
        const url2 = "http://localhost:3005/train/currentStop/" + currentTrainId ;
        await axios.get(url2, { headers: { Accept: "application/json" } })
            .then(res => {
                console.log(stops.indexOf(res.data.currentStop) >= stops.indexOf(ticket.departure));
                console.log( stops.indexOf(ticket.destination) >= stops.indexOf(res.data.nextStop));
                console.log(stops.indexOf(ticket.destination));
                console.log( stops.indexOf(res.data.nextStop));
                if(stops.indexOf(res.data.currentStop) >= stops.indexOf(ticket.departure)){
                    if((stops.indexOf(ticket.destination) >= stops.indexOf(res.data.nextStop))){
                        resultat = true;
                    }else{
                        resultat = false;
                    }
                }else {
                    resultat = false;
                }
            });

    }
    else {
        resultat = false;
    }


    return {"resultat" : resultat, "type" : ticket.type };

}



module.exports = app;