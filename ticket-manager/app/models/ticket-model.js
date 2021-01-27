const mongoose = require('mongoose');

const currentTripInfos = mongoose.Schema({
    trainId:{
        type : String,
        required : true
    },
    _id:{
        type : String,
        required : true
    },
    tickets:[{
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
            required : true
        },
        trainRef : {
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
        },
        controller:{
            type: String,
            default : ""
        }



    }],
    trainStops:{
        type : [String]
    },
    currentStop : {
        type : String,
        required : true
    }



});

module.exports = mongoose.model('TrainInternalDB', currentTripInfos);