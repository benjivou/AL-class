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
        });

        //No need to check the ticket if it has no ticketID (fraud without any tickets)
        if(req.body.ticketId != null){
            const response = await fraudCheck(fraud);
            //There is no fraud
            if(response.result){
                await res.json({'message': 'No fraud'});
            }else {
                await fraud.save();
                if(req.body.paymentType === "cash"){
                    await payCash(fraud._id)
                }else if(req.body.paymentType ==="cb"){
                    let cb = {
                        num : req.body.num ,
                        dateExp: req.body.dateExp,
                        code: req.body.code
                    };
                    await payCb(fraud._id, cb)
                }else if(req.body.paymentType ==="pay-later"){
                    await payLater(fraud._id, req.body.name, req.body.lastName, req.body.address)
                }
                await res.json({
                    "fraudId" : fraud._id,
                    "fraudPrice" : price1});
            }
        }
        //There is effectively a fraud
    }catch (e) {
        await res.json({"message": e})
    }

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
async function payCash(id) {
    try{
        let fraud = await Fraud.findById( id );
        if(fraud == null) {
            console.log("Fraud is not declared yet")
        }
        if(!fraud.paid){
            await Fraud.findByIdAndUpdate(id,{
                    paid : true,
                    paymentType: "cash"
                }, {new: true},
                (err, todo) => {
                    // Handle any possible database errors
                    if (err) console.log(err);
                });
            let updatedFraud = await Fraud.findById( id );
            await pushFraudOnKafka(updatedFraud);
        }else {console.log("Already paid !")}

    }catch (e) {
        console.log("Error")
    }


}

/******************pay fraud online******************/
async function payCb(id, cb) {
    try {
        let fraud = await Fraud.findById( id);
        if(fraud == null) {
            console.log("Fraud is not declared yet");
        }
        let bankAuth =  await axios.post("http://paymentsystemservice:3007/bank",cb, { headers: { Accept: "application/json" } } );
        if(!fraud.paid){
            if(bankAuth){
                await Fraud.findByIdAndUpdate(id,{
                        paid : true,
                        paymentType : "cb"
                    }, {new: true},
                    (err, todo) => {
                        if (err) console.log(err);
                    });
                let updatedFraud = await Fraud.findById( id );
                await pushFraudOnKafka(updatedFraud);
                console.log(true);
            }
            else  console.log(false);
        }
        else {console.log("Already paid !")}
    }catch (e) {
        console.log("Error") ;
    }

}

/******************pay fraud later******************/
async function payLater(id, name, lastName, address) {

    try{
        let fraud = await Fraud.findById(id);
        if(fraud == null) {
           console.log("Fraud is not declared yet")
        }
        let initialPrice = fraud.amount;
        if(!fraud.paid){
            Fraud.findByIdAndUpdate(id,{
                    paymentType : "later",
                    paid : true,
                    amount: initialPrice*2,
                    name : name,
                    lastName: lastName,
                    address : address
                }, {new: true},
                (err, todo) => {
                    // Handle any possible database errors
                    if (err) console.log(err);
                    console.log(todo);
                });
            let updatedFraud = await Fraud.findById( id );
            await pushFraudOnKafka(updatedFraud);
        }else {console.log("Already paid !")}
    }catch (e) {
        console.log("Error")
    }

};

async function pushFraudOnKafka(fraud){
    await producer.connect();
    console.log('connected');
    await producer.send({
        topic: 'declaredFrauds',
        messages: [
            {key: fraud.tripId ,value:JSON.stringify(fraud)}
        ],
    });
    console.log('sended');
}


module.exports = app;
