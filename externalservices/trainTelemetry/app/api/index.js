const express  = require('express');
const bodyParser = require('body-parser');
const app =  express();
const Train = require('../models/telemetry');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/:id", async (req, res) => {
    try{
        const train = await Train.findById(req.params.id);
        await res.json(train);
    }catch(err) {
        await res.json({message: err});
    }
});
app.get("/currentStop/:id", async (req, res) => {
    try{
        const train = await Train.findById(req.params.id);
        await res.json({
            currentStop :train.currentStop,
            nextStop : train.nextStop
        });
    }catch(err) {
        await res.json({message: err});
    }
});
app.get("/stops/:id", async (req, res) => {
    try{
        const train = await Train.findById(req.params.id);
        await res.json(train.stops);
    }catch(err) {
        await res.json({message: err});
    }
});
app.post("/",async (req,res) => {
    const train = new Train({
        _id: req.body.id,
        currentStop : req.body.currentStop,
        nextStop : req.body.nextStop,
        stops :req.body.stops
    });
    try{
        const savedT = await train.save();
        await res.json(savedT);
    }catch(err) {
        await res.json({message: err});
    }
});

app.put("/:id", async (req,res) => {
    Train.findByIdAndUpdate(req.params.id,req.body, {new: true},

    (err, todo) => {
        // Handle any possible database errors
        if (err) return res.status(500).send(err);
        return res.send(todo);
    })
});



module.exports = app;