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
});

const kafka2 = new Kafka({
    clientId: 'trainTelemetryToStart',
    brokers: ['kafka:9092']
});
const kafka3 = new Kafka({
    clientId: 'trainTelemetryToEndTrip',
    brokers: ['kafka:9092']
});


const producer = kafka.producer();
const producer2 = kafka2.producer();
const producer3 = kafka3.producer();


/*******************************start Trip*********************************/
app.post("/start/:id", async (req,res) => {
    try{
        const train = await Train.find({"_id":req.params.id, "trips._id":req.body._id});
        if (train === undefined){
            return res.json("The trip is not registred in the db")
        }else {

            let trip = train[0].trips.find(element => element._id === req.body._id);
            const data = {
                trainId : train[0]._id,
                _id : trip._id,
                trainStops : trip.stops,
                tickets: [],
                currentStop : trip.currentStop
            };
            await pushStartTripOnKafka(data);
            return res.json(data)
        }
    }catch (e) {
        console.log(e);
        return res.json("connection to db is impossible or trip asked is not found")
    }

});

async function pushStartTripOnKafka(trip){
    await producer2.connect();
    console.log('train start producer connected');
    await producer2.send({
        topic: 'startTrip',
        messages: [
            {key: trip._id ,value:JSON.stringify(trip)}
        ],
    });
    console.log('train infos sent');
}

/*******************************finish Trip*********************************/
app.post("/end/:id", async (req,res) => {
    try{
        const train = await Train.find({"_id":req.params.id, "trips._id":req.body._id});
        if (train == null){
            return res.json("The trip is not registred in the db")
        }else {
            await pushFinishedTripOnKafka(req.body._id);
            return res.json("OK")
        }
    }catch (e) {
        console.log(e);
        return res.json("connection to db is impossible or trip asked is not found")
    }

});

async function pushFinishedTripOnKafka(tripId){
    await producer3.connect();
    console.log('train end trip producer connected');
    await producer3.send({
        topic: 'endTrip',
        messages: [
            {key: tripId ,value:JSON.stringify(tripId)}
        ],
    });
    console.log('train infos sent');
}



/******************Post new Train infos or simply a new planned trip ******************/
app.post("/:id",async (req,res) => {
    try {
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

    }catch {e} {
        return res.json("Some error occured please try again")
    }
});

/**************************Change station *********************************/
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
        topic: 'nextStation',
        messages: [
            {key: trainStations._id ,value:JSON.stringify(trainStations)}
        ],
    });
    console.log('train infos sent');
}



module.exports = app;