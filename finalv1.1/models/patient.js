var mongoose = require("mongoose");



//schema setup
var patientSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    birthday: { type: Date },
    mPhone : Number,
    sPhone : Number,
    city:String,
    address :String,
    bloodType:String,
    allergies:Boolean,
    diabetes:Boolean,
    asthma:Boolean,
    doc:String,
    general:String,
    createdAt:{type:Date, default:Date.now},
    author : {
        id :{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String
    },
    diagnoses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Diagnose"
        }
        
    ]
});






module.exports = mongoose.model("Patient", patientSchema);