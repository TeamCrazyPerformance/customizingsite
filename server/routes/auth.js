var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var db = require('../db');
var jwt = require('jsonwebtoken');
var config = require('../config');
const { check, validationResult } = require('express-validator');

router.post('/login', [
    check('email').isEmail(),
    check('password').isString(),
    check('password').isLength({ min: 4, max: 20 })
    ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errorMsg: "Bad Parameter", errors: errors.array() })
    }

    const email = req.body.email;
    const password = req.body.password;

    let query = "SELECT email, password FROM ?? WHERE ??=?";
    const table = ["user", "email", email];
    query = mysql.format(query, table);

    db.query(query, function(err, rows) {
        if(err) {
            res.status(500).json({errorMsg : "Database connection error"});
        } else {
            if(rows.length === 1 && bcrypt.compareSync(password, rows[0].password)) {
                const payload = {
                    email: email
                };
                const options = {
                    expiresIn: config.expiresIn
                };
                jwt.sign(payload, config.secret, options, function(err, token) {
                   if(err)
                       return res.status(500).json({errorMsg : "Internal server problem"});
                   res.json({token : token});
                });
            } else {
                res.status(406).json({errorMsg : "Email or Password is invalid"});
            }
        }
    })

});

module.exports = router;