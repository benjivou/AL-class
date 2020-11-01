const express  = require('express');
const bodyParser = require('body-parser');
const app =  express();
const Statistics = require('../models/statistics');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

/*************get Number of frauds done by the controller *************/
app.get('/controller/frauds/:id',async (req,resp)=>{

    let sum = 0 ;
    let stats ;
    try{
        stats =await Statistics.find();
    }catch (e) {
        await resp.json({"message": e});
    }
    stats.forEach( s =>  {
        let l = s.frauds.filter(element => element.controller === req.params.id);
        sum = sum + l.length;
    });
    await resp.json({"nbFrauds" : sum});

});

/*************get Number of controlled tickets by the controller Id *************/
app.get('/controller/tickets/:id',async (req,res)=>{

    let sum = 0 ;
    let stats ;
    try{
        stats =await Statistics.find();
    }catch (e) {
        await res.json({"message": e});
    }
    stats.forEach( s =>  {
        let l = s.tickets.filter(element => element.controller === req.params.id);
        console.log(l);
        sum = sum + l.length;});
    await res.json({"nbControlledTickets": sum});

});

/*************get the total number of frauds *************/
app.get('/frauds', async (req,res)=>{
    try{
        let sum = 0 ;
        let stats =await Statistics.find();
        stats.forEach( s =>  {
            sum = sum + s.frauds.length;
        });
        await res.json({"nbTotalFrauds":sum });
    }catch (e) {
        await res.json({"message": e});
    }
});

/*************get the total number of the uncontrolled tickets*************/
app.get('/UncontrolledTickets',async (req,res)=>{
    try{
        let sum = 0 ;
        let stats =await Statistics.find();
        stats.forEach( s =>  {
            let l = s.tickets.filter(element => element.controller === "");
            sum = sum + l.length;
        });
        await res.json({"nbUncontrolledTickets":sum });
    }catch (e) {
        await res.json({"message": e});
    }
});

/*************get the total number of the controlled tickets*************/
app.get('/controlledTickets',async (req,res)=>{
    try{
        let sum = 0 ;
        let stats =await Statistics.find();
        stats.forEach( s =>  {
            let l = s.tickets.filter(element => element.controller !== "");
            console.log(l);
            sum = sum + l.length;
        });
        await res.json({"nbControlledTickets":sum });
    }catch (e) {
        await res.json({"message": e});
    }
});

module.exports = app;