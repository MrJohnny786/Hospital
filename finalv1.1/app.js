var express    =  require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    flash       = require("connect-flash"),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    Patient    = require("./models/patient"),
    Diagnose = require("./models/diagnose"),
    Treatment = require("./models/treatment"),
    methodOverride = require('method-override'),
    User = require('./models/user'),
    seedDB = require("./seeds");

var patientRoutes = require("./routes/patients"),
    diagnoseRoutes = require("./routes/diagnoses"),
    treatmentRoutes = require("./routes/treatments"),
    indexRoutes = require("./routes/index")

 //mongoose.connect("mongodb://localhost/hospital");  // WHENEVER I GIT PUSH CHANGE MONGOOSE CONNECT !!!!!!!!!!!!!!!!!
 const mongoURI = 'mongodb://localhost/hospital';

mongoose.connect("mongodb://john:" + encodeURIComponent('kalamata1') + "@ds233541.mlab.com:33541/hospital");

//mongodb://<john>:<kalamata1>@ds233541.mlab.com:33541/hospital
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
//app.use(express.static('./views/public'));
app.use(express.static(__dirname + '/public'));
//app.use(express.static(__dirname + "/public"));
// amazing
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();
app.use(require("express-session")({
    secret:"MrJohnny786",
    resave:false,
    saveUninitialized:false
}));

app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/patients",patientRoutes);
app.use("/patients/:id/diagnoses",diagnoseRoutes);
app.use("/patients/:id/diagnoses/:diagnose_1/treatments",treatmentRoutes);
app.use("/",indexRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Started");
});


// By John Damilatis
