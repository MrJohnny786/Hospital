var express = require("express");
var router = express.Router();
var Patient = require("../models/patient")
var Diagnose = require("../models/diagnose")
var Treatment = require("../models/treatment");
var middleware = require('../middleware');
//var Calendar = require("../models/calendar")
var moment =require('moment')

