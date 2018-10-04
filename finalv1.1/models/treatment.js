var mongoose = require("mongoose");

var treatmentSchema = mongoose.Schema({
    number:Number,
    disease:String,
    date: { type: Date },
    doc:String,
    createdAt:{type:Date, default:Date.now},
    beta: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username:String
    }
    
})

module.exports = mongoose.model("Treatment", treatmentSchema)