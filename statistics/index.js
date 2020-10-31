const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
app.use(cors());
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv/config');
const Stats = require('./modules/statistics');




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

app.post('/',async (req,res)=>{
    console.log(req.body);
    let stats = new Stats({
        _id : req.body.id,
        tickets : req.body.tickets,
        frauds: req.body.frauds
    })
    try{
        let savedStats = await stats.save();
        await res.json(savedStats);
    }catch (e) {
       await res.json({message: e});
    }
});


// localhost:3005
app.listen(3009, () => {
    console.log(" Statistics is up and listening on 3009...")
});
