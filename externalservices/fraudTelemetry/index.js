const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
app.use(cors());
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv/config');
const FraudTelemetry = require('./app/models/fraudTelemetry');
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'fraudTelemetry',
    brokers: ['kafka:9092']
})

const consumer = kafka.consumer({ groupId: 'fraudTelemetryGroupId'});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next()
});

mongoose.connect(process.env.DB_CONNECTION,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(()=>{
    console.log(`connection to database established`)});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan('short'));


const run = async () => {

    await consumer.connect();
    console.log('connected');
    await consumer.subscribe({ topic: 'declaredFrauds', fromBeginning: true });
    console.log('subscribed');
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
        console.log('message received');
            if(topic==='declaredFrauds'){
                console.log(JSON.parse(message.value.toString()));
                //message contains the fraud to save
                //Save fraud in DB
                console.log(message.key.toString()) ;
                console.log(message.value.toString());
                let fraud = await FraudTelemetry.findById(message.key.toString());
                console.log(fraud);
                if(fraud === null) {
                    console.log("I'm in");

                    let fraudTelemtry = new FraudTelemetry({
                        _id: message.key.toString(),
                        frauds: [JSON.parse(message.value.toString())]
                    });
                    await fraudTelemtry.save();
                }else{
                    console.log("I'm in");
                    await FraudTelemetry.findOneAndUpdate({"_id":message.key.toString()}, {$push: {frauds: JSON.parse(message.value.toString())}})
                }

            }
        },
    })

};
run().catch(console.error);

// localhost:3010
app.listen(3010, () => {
    console.log(" Fraud telemetry is up and listening on 3010...")
});



