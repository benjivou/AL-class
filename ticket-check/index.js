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



mongoose.connect('mongodb+srv://user:al123@cluster0.dsrqm.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(()=>{
    console.log(`connection to database established`)});

const ticketCheckService_router = require('./app/api/index.js');

app.use('/ticketCheck',ticketCheckService_router);





// localhost:3003
app.listen(3003, () => {
    console.log(" Ticket ckeck Server is up and listening on 3003...")
});
