var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db = require('../db');
var authMiddleware = require('../middlewares/auth');
const { check, validationResult } = require('express-validator');



module.exports = router;
