const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const api = require('./api/index');





module.exports = (cb) => {
    const app = express();
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        next()
    });

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(morgan('short'));

    mongoose.connect("mongodb+srv://user:al123@cluster0.dsrqm.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }).then(()=>{
        console.log(`connection to database established`)});
    app.disable('x-powered-by');
    app.use(cors());
    app.use('/ticketCheck', api);
    app.use('*', (req, res) => res.status(404).end());
    var port = process.argv[2];
    console.log(port);
    if(port == undefined){
        port = 8880;
    }
    const server = app.listen(process.env.PORT || port, () => cb && cb(server));
};
