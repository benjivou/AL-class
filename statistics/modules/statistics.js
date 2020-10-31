const mongoose = require('mongoose');

const StatisticsSchema = mongoose.Schema({
        _id : {
            type: String ,
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
               required : true
           }
       }],

       frauds : [{
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
       }]
});

module.exports = mongoose.model('Statistics', StatisticsSchema);