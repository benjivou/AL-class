const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const Fraud = require('../models/fraud');
const axios = require('axios');

const fraudType = {
    REDUCED : 40,
    NOTICKET : 50,
    FALSIFIED : 70,
    TRAJECTORY : 40
};
/******************get fraud's list******************/
app.get('/frauds/:id', async (req,res)=>{

    try{
        let frauds = await Fraud.find();
        await sendDataToTelemetry(req.params.id, frauds);
        await clearDb();
        await res.json(frauds);
    }catch (e) {
        await res.json({"message": e})
    }
});

/******************send Data to Fraud telemetry******************/
async function sendDataToTelemetry(id,frauds){
    let data = {"id": id,
        "frauds": frauds,
    };
    await axios({method: 'post', url: 'http://fraudetelemetryservice:3010', data: data, headers: { Accept: "application/json" }})
        .catch(function (response) {console.log(response); });
    return true;
}

/******************clear train's internal DB******************/
async function clearDb(){
    Fraud.deleteMany({},function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log( data);
        }
    });
}

/******************get cash amount payed to the correspendant controller******************/
app.get('/cash/:id', async (req,res)=>{
    let sum = 0;
    let controllerFrauds = await Fraud.find({'controller': req.params.id, "paymentType":"cash"});
    console.log(controllerFrauds);
    controllerFrauds.forEach(f=>{
        sum = sum +f.amount ;
    });
    await  res.json({"sum": sum});

});

/******************declare a new fraud******************/
app.post("/declare/fraud", async (req, res) => {
    console.log(req.body);
    let price1 = 0 ;
    let currentStation =await axios.get("http://ticketcheckservice:3003/currentStop", { headers: { Accept: "application/json" } })
        .then(res => {return res.data});
    switch (req.body.type) {
        case "reduced" : price1 = fraudType.REDUCED ;break;
        case "noticket" : price1 = fraudType.NOTICKET ; break;
        case "falsified" : price1 = fraudType.FALSIFIED ; break;
        case "trajectory" : price1 = fraudType.TRAJECTORY; break;
        default : price1 = 0 ;
    }
    let time = new Date();
    let a = time.getHours();
    const fraud = new Fraud({
        type : req.body.type,
        controller : req.body.controller,
        currentStop : currentStation,
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
        "fraudPrice" : price1});
});

/******************pay fraud cash******************/
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
        return await res.json({"paid":true});
    }else {return await res.json({"paid": false,"msg":"Already paid!"})}


});

/******************pay fraud online******************/
app.put("/pay/cb", async (req, res) => {
    let fraud = await Fraud.findById( req.body.id);
    let bankAuth =  await axios.post("http://paymentsystemservice:3007/bank",req.body, { headers: { Accept: "application/json" } } );

    if(!fraud.paid){
        if(bankAuth){
        Fraud.findByIdAndUpdate(req.body.id,{
                paid : true,
                paymentType : "cb"
            }, {new: true},
            (err, todo) => {
                if (err) return res.status(500).send(err);
            });
            return await res.json({"paid":true})
        }
        else  return await res.json({"paid": false,"msg":"Already paid !"})
    }
    else {return await res.json({"paid": false,"msg":"Already paid !"})}



});

/******************pay fraud later******************/
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
        return await res.json({"paid":true});
    }else {return await res.json({"paid": false,"msg":"Already paid !"})}
});


module.exports = app;
