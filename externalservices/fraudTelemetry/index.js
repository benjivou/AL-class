const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
app.use(cors());
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv/config');
const FraudTelemetry = require('./app/models/fraudTelemetry');

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

app.post('/', async (req,res)=>{
    if( FraudTelemetry.findById(req.body.id) === undefined){
        
    }
    let fraudTelemtry = new FraudTelemetry({
        _id: req.body.id ,
        frauds : req.body.frauds
    });

        let saved = fraudTelemtry.save();
        await res.status(201).json(saved);

});

// localhost:3010
app.listen(3010, () => {
    console.log(" Fraud telemetry is up and listening on 3010...")
});



