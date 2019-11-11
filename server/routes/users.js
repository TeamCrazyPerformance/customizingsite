var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var db = require('../db');
const { check, validationResult } = require('express-validator');

router.post('/register', [
    check('email').isEmail(),
    check('password').isString(),
    check('password').isLength({ min: 4, max: 20 }),
    check('nickname').isString(),
    check('password').isLength({ min: 2, max: 16 }),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errorMsg: "Bad Parameter", errors: errors.array() })
  }

  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password);
  const nickname = req.body.nickname;

  let query = "SELECT email FROM ?? WHERE ??=?";
  const table = ["user", "email", email];
  query = mysql.format(query, table);

  db.query(query, function(err, rows) {
    if(err) {
      res.status(500).json({errorMsg : "Database connection error"});
    } else {
      if(rows.length === 0) {
        let query = "INSERT INTO ?? SET ?";
        const table = ["user"];
        query = mysql.format(query, table);

        const user = {
          email: email,
          password: password,
          nickname: nickname
        };
        db.query(query, user, function(err, rows) {
          if (err) {
            res.status(500).json({errorMsg : "Cannot register user"});
          } else {
            res.status(201).json({message : "Success"});
          }
        });
      } else {
        res.status(406).json({errorMsg : "Email already exists"});
      }
    }
  })

});

module.exports = router;
