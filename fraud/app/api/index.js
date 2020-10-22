const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const Fraud = require('../models/fraud');

const fraudType = {
    REDUCED : "40",
    NOTICKET : "50",
    FALSIFIED : "70"
};

app.post("/declare/fraud", async (req, res) => {
    console.log(req.body)
    let price1 = 0 ;
    switch (req.body.type) {
        case "reduced" : price1 = fraudType.REDUCED ;
            break;
        case "noticket" : price1 = fraudType.NOTICKET ; break;
        case "falsified" : price1 = fraudType.FALSIFIED ; break;
        default : price1 = 0 ;
    }
    let time = new Date();
    let a = time.getHours();
    const fraud = new Fraud({
        type : req.body.type,
        currentStop : req.body.currentStop ,
        controller : req.body.controller,
        time : a,
        price : price1
    });
    console.log(fraud);
    try{
        fraud.save();
    }catch (e) {
        await res.json({"message": e})
    }
    await res.json({
        "fraudId" : fraud._id,
        "FraudPrice:" : price1});
});

app.put("/pay/cash", async (req, res) => {
        Fraud.findByIdAndUpdate(req.body.id,{
            paid : "cash"
            }, {new: true},
            (err, todo) => {
                // Handle any possible database errors
                if (err) return res.status(500).send(err);
                return res.send(todo);
            });

});



module.exports = app;