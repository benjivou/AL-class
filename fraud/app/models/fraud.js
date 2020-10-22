const mongoose = require('mongoose');



const FraudSchema = mongoose.Schema({
    type : {
        type : String ,
        required : true
    },
    currentStop : {
        type: String ,
        required : true
    },
    controller : {
        type : String,
        required : true
    },
    time : {
        type : Number,
        required : true
    },
    paid : {
        type : String,
        required : false
    },
    amount : {
        type : Number,
        required : false
    }

});

module.exports = mongoose.model('Fraud', FraudSchema);