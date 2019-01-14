var mongoose = require("mongoose");
var Patient = require("./models/patient")
var Diagnose = require("./models/diagnose")


var data = [
    {name: "john",
    lastname:"Damilatis",
    birth:"2/1/2001",
    general:"I like league of legends"
    }    
]

function seedDB(){
   //Remove all campgrounds
   Patient.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed patientss!");
         //add a few campgrounds
        data.forEach(function(seed){
            Patient.create(seed, function(err, patient){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a patient");
                    //create a comment
                    Diagnose.create(
                        {
                           number:'1',
                            doctor:"alex",
                            disease:"camcer",
                            date:"1/1/1111",
                            treatment:"XD",
                        }, function(err, diagnose){
                            if(err){
                                console.log(err);
                            } else {
                                patient.diagnoses.push(diagnose);
                                patient.save();
                                console.log("Created new diagnose");
                            }
                        });
                }
            });
        });
    }); 
    //add a few comments
}



module.exports = seedDB;
