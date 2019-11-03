var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var db = require('../db');
var jwt = require('jsonwebtoken');
var config = require('../config');

router.post('/login', function(req, res, next) {
    var user = {
        email: req.body.email,
        password: req.body.password
    };

    var query = "SELECT email, password FROM ?? WHERE ??=?";
    var table = ["user", "email", user.email];
    query = mysql.format(query, table);

    db.query(query, function(err, rows) {
        if(err) {
            res.status(500).json({"errorMsg" : "Database connection error"});
        } else {
            if(rows.length === 1 && bcrypt.compareSync(user.password, rows[0].password)) {
                var payload = {
                    email: user.email
                };
                var options = {
                    expiresIn: config.expiresIn
                };
                jwt.sign(payload, config.secret, options, function(err, token) {
                   if(err)
                       return res.status(500).json({"errorMsg" : "Internal server problem"});
                   res.json({"token" : token});
                });
            } else {
                res.status(406).json({"errorMsg" : "Email or Password is invalid"});
            }
        }
    })

});

module.exports = router;