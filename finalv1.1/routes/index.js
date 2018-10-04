var express = require("express");
var router = express.Router();

var passport = require("passport")
var User = require("../models/user")
var middleware = require('../middleware');




router.get("/register", function(req, res){
    res.render('register');
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    if (req.body.adminCode === "786"){   // ADMIN CODE 
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            console.log(err)
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate('local')(req, res, function(){
            req.flash("success", "Εγινε συνδεση του/της " + user.username);
            res.redirect('/patients');
        });
    });
});

// LOGIN

router.get("/",function(req, res){
    res.render("login");
});

router.post("/login",passport.authenticate("local",
{
    successRedirect:"/patients",
    failureRedirect: "/"
}), function(req, res){
});

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Εγινε Αποσυνδεση")
    res.redirect("/");
});





module.exports = router
