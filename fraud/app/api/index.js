const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const Fraud = require('../models/fraud');
const axios = require('axios');

const fraudType = {
    REDUCED : 40,
    NOTICKET : 50,
    FALSIFIED : 70
};

app.post("/declare/fraud", async (req, res) => {
    console.log(req.body);
    let price1 = 0 ;
    switch (req.body.type) {
        case "reduced" : price1 = fraudType.REDUCED ;break;
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
        amount : price1
    });
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
    let fraud = await Fraud.findById( req.body.id );
    if(!fraud.paid){
        Fraud.findByIdAndUpdate(req.body.id,{
                paid : true,
                paymentType: "cash"
            }, {new: true},
            (err, todo) => {
                // Handle any possible database errors
                if (err) return res.status(500).json(false);
            });
        return await res.json(true);
    }else {return res.json("Already paid !")}


});

app.put("/pay/cb", async (req, res) => {
    let fraud = await Fraud.findById( req.body.id);
    let bankAuth =  await axios.post("http://localhost:3007/bank",req.body, { headers: { Accept: "application/json" } } );

    if(!fraud.paid){
        if(bankAuth){
        Fraud.findByIdAndUpdate(req.body.id,{
                paid : true,
                paymentType : "cb"
            }, {new: true},
            (err, todo) => {
                if (err) return res.status(500).send(err);
            });
        return await res.json(true);
        }
        else  return await res.json(false);
    }
    else {return res.json("Already paid !")}



});


app.put("/pay/later", async (req, res) => {
    let fraud = await Fraud.findById(req.body.id);
    let initialPrice = fraud.amount;
    if(!fraud.paid){
        Fraud.findByIdAndUpdate(req.body.id,{
                paymentType : "later",
                paid : true,
                amount: initialPrice*2,
                name : req.body.name,
                lastName: req.body.lastName,
                address : req.body.address
            }, {new: true},
            (err, todo) => {
                // Handle any possible database errors
                if (err) return res.status(500).send(err);
                return res.send(todo);
            });
    }else {return res.json("Already paid !")}


});




module.exports = app;