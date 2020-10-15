const express  = require('express');
const bodyParser = require('body-parser');
const app =  express();
const axios = require("axios");

const currentTrainId ="ABCDEFYIS";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/:id", async (req, res) => {
    try{
        const url = "http://localhost:3004/ticket/" + req.params.id ;
        let ticket = undefined ;
        await axios.get(url, { headers: { Accept: "application/json" } })
            .then(res => {
                ticket = res.data;
            });
        if(ticket !== undefined && ticket.trainRef === currentTrainId){
            await res.json(true);
        }else {
            await res.json(false);
        }
    }catch(err) {
        await res.json({message: err});
    }
});



module.exports = app;