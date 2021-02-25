const mongoose = require('mongoose');



const TicketInfoSchema = mongoose.Schema({
    _id:{
        type : String,
        required : false
    },
    passengerName : {
        type : String ,
        required : true
    },
    type : {
        type: String ,
        required : true
    },
    tripId : {
        type : String,
        required : true
    },
    departure : {
        type : String, 
        required : true
    },
    destination:{
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    date : {
        type : String,
        required : true
    }

});

module.exports = mongoose.model('tickets', TicketInfoSchema);