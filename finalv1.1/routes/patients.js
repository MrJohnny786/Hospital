var express = require("express");
var router = express.Router();
var Patient = require("../models/patient")
var Diagnose = require("../models/diagnose")
var Treatment = require("../models/treatment");
var middleware = require('../middleware');
var moment =require('moment')


router.get("/", function(req, res){
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Patient.find({lastName: regex}, function(err, allPatients){
       if(err){
           console.log(err);
       } else {
          res.render("patients/index",{patients:allPatients});
       }
    });
    }else if(req.query.search1){
        const regex = new RegExp(escapeRegex(req.query.search1), 'gi');
        Patient.find({doc: regex}, function(err, allPatients){
       if(err){
           console.log(err);
       } else {
          res.render("patients/index",{patients:allPatients});
       }
    });
    }
    else{
        // Get all patient from DB
    Patient.find({}, function(err, allPatients){
       if(err){
           console.log(err);
       } else {
          res.render("patients/index",{patients:allPatients});
       }
    });
    }
    
});

router.post("/",middleware.isLoggedIn, function(req, res){
    
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    //var birthday = new Date();
    var birthday = req.body.birthday; // to do:   change how is the format of User Interface
    //var fomatted_date = moment(birthday).format('YYYY-DD-MM');
    var mPhone = req.body.mPhone;
    var sPhone = req.body.sPhone;
    var city = req.body.city;
    var address = req.body.address;
    var bloodType = req.body.bloodType;
    var doc = req.body.doc;
    
    var general = req.body.general;
    var author ={
        id:req.user._id,
        username: req.user.username
    }
    var newPatient = {firstName: firstName,lastName : lastName,birthday:birthday,general:general, author:author,mPhone:mPhone,sPhone:sPhone,city:city,
    address:address,bloodType:bloodType, doc:doc};
    console.log(newPatient)
    
    Patient.create(newPatient, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/patients");
        }
    });
    
});

router.get("/new",middleware.isLoggedIn, function(req, res){
    res.render("patients/new.ejs");
});



//SHOW PATIENT ROUTE 
router.get("/:id", function(req, res){
    //find the patient with provided ID
    Patient.findById(req.params.id).populate("diagnoses").exec(function(err, foundPatient){
        if(err){
            console.log(err);
        } else {
            //console.log(foundPatient);
            //render show template with that patient
            res.render("patients/show", {patient: foundPatient});
        }
    });
});

// Edit Route
router.get("/:id/edit",middleware.checkPatientOwnership, function(req, res){
        Patient.findById(req.params.id, function(err, foundPatient){
                //console.log(req.params.id)
                res.render("patients/edit", {p_id:req.params.id, patient: foundPatient});
        });
});

// Update Route
router.put("/:id",middleware.checkPatientOwnership, function(req, res){   
    Patient.findByIdAndUpdate(req.params.id,req.body.patient,function(err, updatedPatient){
        console.log(req.body)
        if(err){
            res.redirect("/patients");
            console.log(err)
        }else{
            res.redirect("/patients/" + req.params.id);
        }
    });
});


//Destroy Patient

router.delete("/:id",middleware.checkPatientOwnership, function(req, res){
   Patient.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/patients");
      } else {
          res.redirect("/patients");
      }
   });
});



function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");    
}




module.exports = router
