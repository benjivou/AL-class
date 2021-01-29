const express  = require('express');
const bodyParser = require('body-parser');
const app =  express();
const axios = require("axios");
const mem = require('../models/tickets-model');
const trainId = "ABCDEFGH" ;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


/******************send request to train telementry to get the stops of the current trip******************/
async function getStops(tripId){
    let stops = undefined;
    const url = "http://traintelemetryservice:3005/train/stops/" +trainId+"/"+ tripId ;
    await axios.get(url, { headers: { Accept: "application/json" } })
        .then(res => {
            stops = res.data;
        });
    return stops;
}

/******************send request to ticket booking to get all the tickets by its trip******************/
async function getTickets(tripId){
    const url = "http://ticketbookingservice:3004/tickets/"+tripId ;
    let tickets = undefined ;
    await axios.get(url, { headers: { Accept: "application/json" } } )
        .then(res => {
            tickets = res.data;
            console.log("Request : " + res.data);
        });
    return tickets;
}

/******************save all the data linked to this trip Id in the internal memory ******************/
async function saveData(tripId) {
    let tickets = await getTickets(tripId);
    let stops  = await getStops(tripId);
    const data = new mem({
        trainId : trainId,
        _id : tripId,
        tickets : tickets,
        trainStops : stops,
        currentStop : stops[0]
    });
    try{
        const saved = await data.save();
        console.log(saved);
    }catch(err) {
        console.log(err);
    }
}
/******************Send last trip's data to stats service ******************/
async function sendInternalDataToStats(){
    let infos = await mem.find();
    let frauds = await axios.get("http://fraudservice:3006/frauds/"+infos[0]._id, { headers: { Accept: "application/json" } } )
        .then(res => { return res.data ; });
    let data = {"_id": infos[0]._id,
        "tickets":infos[0].tickets,
        "frauds": frauds
    };
    await axios({method: 'post', url: 'http://statisticsservice:3009', data: data, headers: { Accept: "application/json" }})
        .catch(function (response) {console.log(response); });
    return true;

}

/******************Start a new trip ******************/
app.post('/:id', async (req,resp)=>{
    // Send internal infos to stats service
    let infos = await mem.find();
    if(infos.length !== 0){
        await sendInternalDataToStats();
    }
    try{
        //Delete Data of last trip
        mem.deleteMany({},function(err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log( data);
            }
        });
        // Save new Data
        await saveData(req.params.id).then(r => console.log());
        resp.status(200).json("done");
    }catch(e){await resp.json({message : e})}

});
module.exports = app;
