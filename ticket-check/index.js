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
let trainId = "ABCDEFGH" ;
const FormData = require('form-data');



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

async function getStops(tripId){
    let stops = undefined;
    const url = "http://localhost:3005/train/stops/" +trainId+"/"+ tripId ;
    await axios.get(url, { headers: { Accept: "application/json" } })
        .then(res => {
            stops = res.data;
        });
    console.log(stops);
    return stops;
}

async function getTickets(tripId){
    const url = "http://localhost:3004/tickets/"+tripId ;
    let tickets = undefined ;
    await axios.get(url, { headers: { Accept: "application/json" } } )
        .then(res => {
            tickets = res.data;
            console.log("Request : " + res.data);
        });
    console.log(tickets);
    return tickets;
}

async function saveData(tripId) {
    let tickets = await getTickets(tripId);
    let stops  = await getStops(tripId);
    console.log("Tickets : "+tickets); console.log("Stops : "+stops);
    const data = new mem({
        trainId : trainId,
        _id : tripId,
        tickets : tickets,
        trainStops : stops,
        currentStop : stops[0]
    });
    try{
        const saved = await data.save();
        let id = saved._id ;
        console.log(saved);
    }catch(err) {
        console.log(err);
    }


}

app.get('/stats', async(req,res)=>{

});



const ticketCheckService_router = require('./app/api/index.js');

app.use('/ticketCheck',ticketCheckService_router);

app.post('/start/:id', async (req,response)=>{

        let infos = await mem.find();
        let frauds = await axios.get("http://localhost:3006/frauds", { headers: { Accept: "application/json" } } )
            .then(res => {
                return res.data ;
            });
        console.log(frauds);
        /* STATISTICS PART 
        let data = new FormData();
        data.append("id",infos[0]._id);
        data.append("tickets",infos[0].tickets);
        data.append("frauds", frauds);
        await axios({
            method: 'post',
            url: 'http://localhost:3009',
            data: data,
            headers: {'Content-Type': 'multipart/form-data' }
        })
            .then(function (response) {
                //handle success
                console.log(response);
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });
*/



    try{
        mem.deleteMany({},function(err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log( data);
            }
        });
        await saveData(req.params.id).then(r => console.log());
        response.status(200).json("done");
    }catch(e){await response.json({message : e})}

});

app.get('/currentStop', async (req, res) =>{
    let infos = await mem.find();
   await res.status(200).json(infos[0].currentStop);
});

// localhost:3003
app.listen(3003, () => {
    console.log(" Ticket ckeck component is up and listening on 3003...")
});
