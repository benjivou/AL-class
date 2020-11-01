const mongoose = require('mongoose');


const TrainInfoSchema = mongoose.Schema({
    _id:{
        type : String,
        required : true
    },
    trips:[{
        _id:{
            type : String,
            required : true
        },
        currentStop : {
            type : String ,
            required : true
        },
        nextStop : {
            type: String ,
            required : true
        },
        stops : {
            type : [String],
            required : true
        }

    }]

});

module.exports = mongoose.model('Train', TrainInfoSchema);