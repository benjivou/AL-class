const express  = require('express');
const bodyParser = require('body-parser');
const app =  express();
const User = require('../models/authentification');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/getToken", async (req, res) => {

    console.log(req.query)
    try{

        const user =  await User.find({"Users.userName" : req.query.username,"Users.passWord" : req.query.password });
        console.log(user);
        await res.json({
            token :user._id
            //token : "5f929d3af4889792258187d9"
        });


    }catch(err) {
        await res.json({message: "userName or passWord is wrong !!"});
    }
});

module.exports = app;