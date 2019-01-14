var express = require("express");
var router = express.Router({ mergeParams: true });

var Patient = require("../models/patient")
var Diagnose = require("../models/diagnose")
var Treatment = require("../models/treatment");
var middleware = require('../middleware');

router.get("/new",middleware.isLoggedIn, function(req, res) {
    // find patient by id
    Patient.findById(req.params.id, function(err, patient) {
        console.log(patient);
        if (err) {
            console.log(err);
        }
        else {
            res.render("diagnoses/new", { patient: patient });
        }
    });
});

router.post("/",middleware.isLoggedIn, function(req, res) {
    //lookup patient using ID
    Patient.findById(req.params.id, function(err, patient) {
        if (err) {
            console.log(err);
            res.redirect("/patients");
        }
        else {
            console.log(req.body.diagnose);
            Diagnose.create(req.body.diagnose, function(err, diagnose) {
                if (err) {
                    req.flash("error", "Δημιουργηθηκε καποιο προβλημα")
                    console.log(err);
                }
                else {
                    diagnose.alpha.id = req.user._id;
                    diagnose.alpha.username = req.user.username
                    diagnose.save();

                    patient.diagnoses.push(diagnose);
                    patient.save();
                    req.flash("success", "Δημιουργηθηκε καινουρια Διαγνωση")
                    res.redirect('/patients/' + patient._id);
                }
            });
        }
    });
});


//Show Diagnose Route
router.get("/:diagnose_id", function(req, res) {
    Diagnose.findById(req.params.diagnose_id).populate("treatments").exec( function(err, foundDiagnose) {
        if (err) {
            res.redirect("/patients");
        }
        else {
            res.render("diagnoses/show", { patient_id: req.params.id, diagnose: foundDiagnose });
        }
    });
});

//Edit Diagnose Route
router.get("/:diagnose_id/edit", middleware.checkDiagnoseOwnership, function(req, res) {
    Diagnose.findById(req.params.diagnose_id, function(err, foundDiagnose) {
        if (err) {
            res.redirect("/patients");
        }
        else {
            res.render("diagnoses/edit", { patient_id: req.params.id, diagnose: foundDiagnose });
        }
    });
});

// Update Diagnose Route
router.put("/:diagnose_id",middleware.checkDiagnoseOwnership, function(req, res) {
    Diagnose.findByIdAndUpdate(req.params.diagnose_id, req.body.diagnose, function(err, updatedDiagnose) {
        if (err) {
            res.redirect("back");
            console.log(err)
        }
        else {
            res.redirect("/patients/" + req.params.id + "/diagnoses/" + req.params.diagnose_id );
        }
    });
});

// Destroy Diagnose Route

router.delete("/:diagnose_id",middleware.checkDiagnoseOwnership, function(req, res) {
    Diagnose.findByIdAndRemove(req.params.diagnose_id, function(err) {
        if (err) {
            res.redirect("back");
        }
        else {
            res.redirect("/patients/" + req.params.id)
        }
    })
})



module.exports = router
