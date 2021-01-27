const mongoose = require('mongoose');



const FraudSchema = mongoose.Schema({
    type : {
        type : String ,
        required : true
    },
    currentStop : {
        type: String ,
        required : false
    },
    controller : {
        type : String,
        required : true
    },
    time : {
        type : Number,
        required : true
    },
    paymentType : {
        type: String,
        required : false
    },
    paid : {
        type : Boolean,
        default : false
    },
    amount : {
        type : Number,
        default : 0
    },
    name : {
        type : String,
        required : false
    },
    lastName : {
        type : String,
        required : false
    },
    address : {
        type : String,
        required : false
    }

});

module.exports = mongoose.model('Fraud', FraudSchema);