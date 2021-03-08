const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
app.use(cors());
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv/config');




app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next()
});


app.use(bodyParser.urlencoded({extended: false}));

app.use(morgan('short'));



const loadbalancer_router = require('./app/api');

app.use('/ticketCheck',loadbalancer_router );



app.listen(1880, () => {
    console.log(" LoadBalancer is up and listening on 1880...")
});

