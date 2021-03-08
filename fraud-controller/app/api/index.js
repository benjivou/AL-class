const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const Fraud = require('../models/fraud');
const axios = require('axios');

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'fraudController',
    brokers: ['kafka:9092']
})

const producer = kafka.producer();

const fraudType = {
    REDUCED : 40,
    NOTICKET : 50,
    FALSIFIED : 70
};
/******************get fraud's list******************/
app.get('/frauds/:id', async (req,res)=>{

    try{
        let frauds = await Fraud.find();
        await sendDataToTelemetry(req.params.id, frauds);
        //    await clearDb();
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
    switch (req.body.type) {
        case "reduced" : price1 = fraudType.REDUCED ;break;
        case "noticket" : price1 = fraudType.NOTICKET ; break;
        case "falsified" : price1 = fraudType.FALSIFIED ; break;
        default : price1 = 0 ;
    }
    let time = new Date();
    let a = time.getHours();
    console.log('tripId', req.body.tripId);
    let fraud;

    try{
        fraud = new Fraud({
            type : req.body.type,
            currentStop : req.body.currentStop ,
            controller : req.body.controller,
            time : a,
            amount : price1,
            tripId : req.body.tripId,
            ticketId : req.body.ticketId,
            date : req.body.date
        })
        //No need to check the ticket if it has no ticketID (fraud without any tickets)
        if(req.body.ticketId != null){
            const response = await fraudCheck(fraud)
            console.log('RESPONSE', response);
            //There is no fraud
            if(response.result){
                await res.json({'message': 'No fraud'});
                return;
            }
        }
        //There is effectively a fraud
        fraud.save();
        await pushFraudOnKafka(fraud);
    }catch (e) {
        await res.json({"message": e})
    }
    await res.json({
        "fraudId" : fraud._id,
        "fraudPrice" : price1});
});

async function fraudCheck(fraud){
    let result = undefined;
    await axios({method: 'post', url: 'http://ticketcheckservice:3003/ticketCheck', headers: { Accept: 'application/json' }, data: {tripId: fraud.tripId, ticketId: fraud.ticketId, date: fraud.date}})
        .then(res => {
            result = res.data;
        });
    return result;
}

/******************pay fraud cash******************/
app.put("/pay/cash", async (req, res) => {
    try{
        let fraud = await Fraud.findById( req.body.id );
        if(fraud == null) {
            return res.json("Fraud is not declared yet")
        }
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

    }catch (e) {
        res.json("Error")
    }


});

/******************pay fraud online******************/
app.put("/pay/cb", async (req, res) => {
    try {
        let fraud = await Fraud.findById( req.body.id);
        if(fraud == null) {
            return res.json("Fraud is not declared yet")
        }
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
                return await res.json(true);
            }
            else  return await res.json(false);
        }
        else {return res.json("Already paid !")}
    }catch (e) {
        return res.json("Error")
    }




});

/******************pay fraud later******************/
app.put("/pay/later", async (req, res) => {
    try{
        let fraud = await Fraud.findById(req.body.id);
        if(fraud == null) {
            return res.json("Fraud is not declared yet")
        }
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
    }catch (e) {
        return res.json("Error")
    }

});

async function pushFraudOnKafka(fraud){
    await producer.connect();
    console.log('connected');
    await producer.send({
        topic: 'declaredFrauds',
        messages: [
            {key: 'fraud.tripId',value:JSON.stringify(fraud)}
        ],
    });
    console.log('sended');
}


module.exports = app;
