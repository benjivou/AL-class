const mongoose = require('mongoose');


const userInfoSchema = mongoose.Schema({
    _id:{
        type : String,
        required : true
    },
    userName : {
        type : String ,
        required : true
    },
    type : {
        type: String ,
        required : true
    }

});

module.exports = mongoose.model('Users', userInfoSchema );