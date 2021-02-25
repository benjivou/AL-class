const mongoose = require('mongoose');

const StatisticsSchema = mongoose.Schema({
        _id : {
            type: String ,
            required : false
        },
       tickets:[{
           _id:{
               type : String,
               required : false
           },
           passengerName : {
               type : String ,
               required : false
           },
           type : {
               type: String ,
               required : false
           },
           trainRef : {
               type : String,
               required : false
           },
           departure : {
               type : String,
               required : false
           },
           destination:{
               type : String,
               required : false
           },
           price : {
               type : Number,
               required : false
           },
           date : {
               type : String,
               required : false
           },
           controller:{
               type: String,
               required : false
           }
       }],

       frauds : [{
           type : {
               type : String ,
               required : false
           },
           currentStop : {
               type: String ,
               required : false
           },
           controller : {
               type : String,
               default : ""
           },
           time : {
               type : Number,
               required : false
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

module.exports = mongoose.model('Statistic', StatisticsSchema);