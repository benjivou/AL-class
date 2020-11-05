const express  = require('express');
const bodyParser = require('body-parser');
const app =  express();
const User = require('../models/authentification');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/getToken/:userName/:passWord", async (req, res) => {


    try{

        const user =  await User.find({"users.userName" : req.params.username,"users.passWord" : req.params.password });
        await res.json({
            token :user[0]._id

        });


    }catch(err) {
        await res.json({message: "userName or passWord is wrong !!"});
    }
});

app.post("/addUser", async (req, res) => {
    console.log(req.body);

    const user = new User ({
        //_id : req.body.id,
        type : req.body.type,
        userName : req.body.userName ,
        passWord : req.body.passWord,
    });
    try{
        user.save();
    }catch (e) {
        await res.json({"message": e})
    }
    await res.json({
        "token" : user._id}
        );
});

module.exports = app;
