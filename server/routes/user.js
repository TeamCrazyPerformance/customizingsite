var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var db = require('../db');
var authMiddleware = require('../middlewares/auth');
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

router.put('/account', authMiddleware, [
  check('account').isString(),
  check('account').isLength({ min: 1, max: 20 }),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errorMsg: "Bad Parameter", errors: errors.array() })
  }

  const email = req.decoded.email;
  const account = req.body.account;

  let query = "SELECT user_id, email FROM ?? WHERE ??=?";
  const table = ["user", "email", email];
  query = mysql.format(query, table);

  db.query(query, function(err, rows) {
    if (err) {
      res.status(500).json({errorMsg: "Database connection error"});
    } else {
      if (rows.length === 1) {
        const user_id = rows[0].user_id;
        let query = "SELECT COUNT(*) AS account FROM ?? WHERE ??=?";
        const table = ["user_account", "account", account];
        query = mysql.format(query, table);

        db.query(query, function(err, rows) {
          if (err) {
            res.status(500).json({errorMsg: "Database connection error"});
          } else {
            if (rows[0].account === 0) {
              let query = "SELECT user_id FROM ?? WHERE ??=?";
              const table = ["user_account", "user_id", user_id];
              query = mysql.format(query, table);

              db.query(query, function(err, rows) {
                if (err) {
                  res.status(500).json({errorMsg: "Database connection error"});
                } else {
                  if(rows.length === 1) {
                    let query = "UPDATE user_account SET account = ? WHERE user_id=?";
                    const table = [account, user_id];
                    query = mysql.format(query, table);

                    db.query(query, function(err, rows) {
                      if (err) {
                        res.status(500).json({errorMsg : "Cannot Save Account"});
                      } else {
                        res.status(201).json({message : "Success"});
                      }
                    });
                  } else {
                    let query = "INSERT INTO ?? SET ?";
                    const table = ["user_account"];
                    query = mysql.format(query, table);

                    const acc = {
                      user_id: user_id,
                      account: account
                    };

                    db.query(query, acc, function(err, rows) {
                      if (err) {
                        res.status(500).json({errorMsg : "Cannot Save Account"});
                      } else {
                        res.status(201).json({message : "Success"});
                      }
                    });
                  }
                }
              });
            } else {
              res.status(406).json({errorMsg : "Account already exists"});
            }
          }
        });
      } else {
        res.status(404).json({errorMsg : "User Not Found"});
      }
    }
  });
});

router.get('/myinfo', authMiddleware, (req, res) => {
  const email = req.decoded.email;

  let query = "SELECT A.user_id, A.email, A.nickname, B.account FROM ?? A LEFT JOIN user_account B ON A.user_id = B.user_id WHERE A.email=?";
  const table = ["user", email];
  query = mysql.format(query, table);

  db.query(query, function(err, rows) {
    if (err) {
      res.status(500).json({errorMsg: "Database connection error"});
    } else {
      if (rows.length === 1) {
        res.status(200).json({email : email, nickname : rows[0].nickname, account : rows[0].account});
      } else {
        res.status(404).json({errorMsg : "User Not Found"});
      }
    }
  });
});

module.exports = router;
