var mongoose = require("mongoose");

var diagnoseSchema = mongoose.Schema({
    general:String,
    disease:String,
    doc:String,
    date: { type: Date },
    createdAt:{type:Date, default:Date.now},
    alpha: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username:String
    },
    treatments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Treatment"
        }    
    ]
    
});

module.exports = mongoose.model("Diagnose", diagnoseSchema);