var Patient = require("../models/patient");
var Diagnose = require("../models/diagnose");
var Treatment = require("../models/treatment");

var middlewareObj = {};

middlewareObj.checkPatientOwnership = function(req, res, next){
       if(req.isAuthenticated()){
        Patient.findById(req.params.id, function(err, foundPatient){
            //console.log(foundPatient.author.id)
            if(err){
                req.flash("error", "Δημιουργηθηκε καποιο προβλημα")
                res.redirect("/patients");
            }else{
                //console.log(foundPatient.author.id);
                //console.log(req.user.id);
                if (foundPatient.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                }else {
                    req.flash("error", "Δεν εχεις την απαραιτητη εξουσιοδοτηση!")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Πρεπει να εισαι συνδεδεμενος!")
        res.redirect("back");
    }
}


middlewareObj.checkDiagnoseOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Diagnose.findById(req.params.diagnose_id, function(err, foundDiagnose){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the diagnose?
            if(foundDiagnose.alpha.id.equals(req.user._id) || req.user.isAdmin) {
                next();
            } else {
                req.flash("error", "Δεν εχεις την απαραιτητη εξουσιοδοτηση!")
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "Πρεπει να εισαι συνδεδεμενος για να κανεις αυτην την ενεργεια!")
        res.redirect("back");
    }
}

middlewareObj.checkTreatmentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Treatment.findById(req.params.treatment_id, function(err, foundTreatment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the treatment?
            if(foundTreatment.beta.id.equals(req.user._id) || req.user.isAdmin) {
                next();
            } else {
                req.flash("error", "Δεν εχεις την απαραιτητη εξουσιοδοτηση!")
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "Πρεπει να εισαι συνδεδεμενος για να κανεις αυτην την ενεργεια!")
        res.redirect("back");
    }
}


middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Πρεπει να εισαι συνδεδεμενος για να κανεις αυτην την ενεργεια!")
    res.redirect("/");
}






module.exports = middlewareObj;