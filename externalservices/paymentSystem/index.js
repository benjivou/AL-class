const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
app.use(cors());
const bodyParser = require('body-parser');




app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next()
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(morgan('short'));
app.post("/bank", async (req, res) => {
    let result = false ;
    if(req.body.num.length === 16 ) {
        if(req.body.code.length === 3) result = true;
    } else result = false ;


    await res.json(result)
});
// localhost:3006
app.listen(3007, () => {
    console.log(" Fraud component is up and listening on 3007...")
});
