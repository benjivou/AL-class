const mongoose = require('mongoose');


const TicketInfoSchema = mongoose.Schema({
    _id:{
        type : String,
        required : true
    },
    passengerName : {
        type : String ,
        required : true
    },
    type : {
        type: String ,
        require : true
    },
    trainRef : {
        type : String,
        require: true
    }

});

module.exports = mongoose.model('Ticket', TicketInfoSchema);