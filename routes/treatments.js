var express = require("express");
var router = express.Router({ mergeParams: true });

var Patient = require("../models/patient");
var Diagnose = require("../models/diagnose");
var Treatment = require("../models/treatment");
var middleware = require('../middleware');



// New treatment Route
router.get("/new",middleware.isLoggedIn, function(req, res) {
    // find diagnose by id
    Diagnose.findById(req.params.diagnose_1, function(err, diagnose) {
        //console.log(req.params.diagnose_1)
        //console.log("LOL")
        //console.log()
        if (err) {
            console.log(err);
        }
        else {
            res.render("treatments/new", { patient_id: req.params.id, diagnose: diagnose });
        }
    });
});


router.post("/",middleware.isLoggedIn, function(req, res) {
    //lookup patient using ID

    Patient.findById(req.params.id, function(err, patient) {
        console.log(req.params.id);
        if (err) {
            console.log(err);
            res.redirect("/patients");
        }
        else {
            Diagnose.findById(req.params.diagnose_1, function(err, diagnose) {
                //console.log(req.params.diagnose_1);
                if (err) {
                    console.log(err);
                    res.redirect("/diagnoses");
                }
                else {
                    //console.log(req.body.treatment);
                    Treatment.create(req.body.treatment, function(err, treatment) {
                        console.log(req.body.treatment);
                        if (err) {
                            console.log(err);
                        }
                        else {
                            treatment.beta.id = req.user._id;
                            treatment.beta.username = req.user.username
                            treatment.save();

                            diagnose.treatments.push(treatment);
                            //console.log(treatment.general)
                            diagnose.save();
                            console.log(diagnose)
                            res.redirect('/patients/' + patient._id + '/diagnoses/' + diagnose.id);
                        }
                    });
                }
            });

        }
    });
});


//Show Diagnose Route
router.get("/:treatment_id", function(req, res){
    Treatment.findById(req.params.treatment_id, function(err, foundTreatment){
        if(err){
            res.redirect("/patients");
        }else{
            console.log(foundTreatment)
           // console.log(req.params.id)
            //console.log(req.params.diagnose_1)
            res.render("treatments/show",{patient_id: req.params.id,diagnose_id: req.params.diagnose_1, treatment: foundTreatment});
        }
    });
});





//Edit Treatment Route
router.get("/:treatment_id/edit",middleware.checkTreatmentOwnership, function(req, res){
    Treatment.findById(req.params.treatment_id, function(err, foundTreatment){
        if(err){
            res.redirect("/patients");
        }else{
            res.render("treatments/edit",{patient_id: req.params.id,diagnose_id: req.params.diagnose_1, treatment: foundTreatment});
        }
    });
});

//Update Treatment Route
router.put("/:treatment_id", middleware.checkTreatmentOwnership, function(req, res){
    Treatment.findByIdAndUpdate(req.params.treatment_id,req.body.treatment,function(err, updatedTreatment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/patients/" + req.params.id +"/diagnoses/" + req.params.diagnose_1 + "/treatments/" + req.params.treatment_id );
        }
    });
});

// Destroy Treatment Route

router.delete("/:treatment_id", middleware.checkTreatmentOwnership, function(req, res){
    Treatment.findByIdAndRemove(req.params.treatment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/patients/" + req.params.id +"/diagnoses/" + req.params.diagnose_1)
        }
    })
})




module.exports = router
