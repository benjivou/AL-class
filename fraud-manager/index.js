const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const axios = require('axios');
app.use(cors());
const bodyParser = require('body-parser');
require('dotenv/config');
const mem = require('./app/models/internal-mem');

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'fraudManager',
    brokers: ['kafka:9092']
})

const consumer = kafka.consumer({ groupId: 'fraudManagerGroupId'});

const run = async () => {

    await consumer.connect();
    await consumer.subscribe({ topic: 'frauds', fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {

            if(topic==='changeStation'){
                //NEED STATION + TRAIN ID
                console.log('we changed station');
            }
        },
    })

};
run().catch(console.error);


app.listen(3002, () => {
    console.log("Fraud manager component is up and listening on 3002...")
});
