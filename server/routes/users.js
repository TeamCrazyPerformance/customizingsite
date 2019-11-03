var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var db = require('../db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function(req, res, next) {
  var user = {
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
    nickname: req.body.nickname
  };

  var query = "SELECT email FROM ?? WHERE ??=?";
  var table = ["user", "email", user.email];
  query = mysql.format(query, table);

  db.query(query, function(err, rows) {
    if(err) {
      res.status(500).json({"errorMsg" : "Database connection error"});
    } else {
      if(rows.length === 0) {
        var query = "INSERT INTO ?? SET ?";
        var table = ["user"];
        query = mysql.format(query, table);

        db.query(query, user, function(err, rows) {
          if (err) {
            res.status(500).json({"errorMsg" : "Cannot register user"});
          } else {
            res.status(201).json({"message" : "Success"});
          }
        });
      } else {
        res.status(406).json({"errorMsg" : "Email already exists"});
      }
    }
  })

});

module.exports = router;
