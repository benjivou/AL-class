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



app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next()
});


app.use(bodyParser.urlencoded({extended: false}));

app.use(morgan('short'));


mongoose.connect(process.env.DB_CONNECTION,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(()=>{
    console.log(`connection to database established`)});

async function getStops(trainref){
    let stops = undefined;
    const url = "http://localhost:3005/train/stops/" + trainref ;
    await axios.get(url, { headers: { Accept: "application/json" } })
        .then(res => {
            stops = res.data;
        });
    console.log(stops);
    return stops;
}

async function getTickets(trainRef){
    const url = "http://localhost:3004/tickets/"+trainRef ;
    let tickets = undefined ;
    await axios.get(url, { headers: { Accept: "application/json" } } )
        .then(res => {
            tickets = res.data;
            console.log("Request : " + res.data);
        });
    console.log(tickets);
    return tickets;
}

async function saveData() {
    let trainId ="ABCDEFGH";
    let tickets = await getTickets(trainId);
    let stops  = await getStops(trainId);
    console.log("Tickets : "+tickets); console.log("Stops : "+stops);
    const data = new mem({
        trainId : trainId,
        tickets : tickets,
        trainStops : stops
    });
    try{
        const saved = await data.save();
        console.log(saved);
    }catch(err) {
        console.log(err);
    }


}



const ticketCheckService_router = require('./app/api/index.js');

app.use('/ticketCheck',ticketCheckService_router);

app.get('/start', ()=>{
    saveData().then(r => console.log());
});


// localhost:3003
app.listen(3003, () => {
    console.log(" Ticket ckeck component is up and listening on 3003...")
});
