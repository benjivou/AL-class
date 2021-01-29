const express  = require('express');
const bodyParser = require('body-parser');
const app =  express();
const Train = require('../models/telemetry');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'trainTelemetry',
    brokers: ['kafka:9092']
})

const producer = kafka.producer();


/******************get Train infos by its id and tripId ******************/
app.get("/:id/:tripId", async (req, res) => {
    try{
        const train = await Train.find({"_id" :req.params.id, "trips._id": req.params.tripId});
        await res.json(train);
    }catch(err) {
        await res.json({message: err});
    }
});

/******************get Train current Stop by its id and tripId ******************/
app.get("/currentStop/:trainId/:tripId", async (req, res) => {
    try{
        const train = await Train.findOne({ "trips._id": req.params.tripId});
        let trip = train.trips.find(element => element._id === req.params.tripId);
        await res.json({
            currentStop :trip.currentStop,
            nextStop : trip.nextStop
        });
    }catch(err) {
        await res.json({message: err});
    }
});

/******************get Train's list of stops by its id and tripId ******************/
app.get("/stops/:trainId/:tripId", async (req, res) => {
    try{
        const train = await Train.findOne({ "trips._id": req.params.tripId});
        await res.json(train.trips.find(element => element._id === req.params.tripId).stops);
    }catch(err) {
        await res.json({message: err});
    }
});

/******************Post new Train infos or simply a new planned trip ******************/
app.post("/:id",async (req,res) => {
    let train = await Train.findById(req.params.id);
    if(train === undefined){
        train = new Train({
            _id: req.params.id,
            trips:[{
                _id : req.body.tripId,
                currentStop : req.body.currentStop,
                nextStop : req.body.nextStop,
                stops :req.body.stops
            }]
        });
        await train.save();
        await res.json(train);
    }else {
        await Train.updateOne({_id :req.params.id},
        { $push: { trips : req.body} });
        await res.json(true);

    }

});

app.put("/currentStop/:id", async (req,res) => {
    try{
        await Train.updateOne({"_id":req.params.id, "trips._id":req.body._id},{$set: {
                'trips.$.currentStop':req.body.currentStop,
                'trips.$.nextStop': req.body.nextStop
            }}, function(err) {console.log(err)});
    }catch (e) {
        console.log(e);
        return res.json("connection to db is impossible or trip asked is not found")
    }

    try{
        await pushCurrentNextStationOnKafka(req.body);
        return res.json({ok : 'ok'});
    }catch(err){
        return res.json({message: err});
    }
});

async function pushCurrentNextStationOnKafka(trainStations){
    await producer.connect();
    console.log('train infos producer connected');
    await producer.send({
        topic: 'tripInfos',
        messages: [
            {key: trainStations._id ,value:JSON.stringify(trainStations)}
        ],
    });
    console.log('train infos sent');
}



module.exports = app;