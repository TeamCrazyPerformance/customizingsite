var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db = require('../db');
var authMiddleware = require('../middlewares/auth');
const { check, validationResult } = require('express-validator');

// Get Contact
router.get('/contact', authMiddleware, function(req, res, next) {
    const email = req.decoded.email;

    let query = "SELECT user_id, email FROM ?? WHERE ??=?";
    const table = ["user", "email", email];
    query = mysql.format(query, table);

    db.query(query, function(err, rows) {
        if(err) {
            res.status(500).json({errorMsg : "Database connection error"});
        } else {
            if(rows.length === 1) {
                const user_id = rows[0].user_id;
                let query = "SELECT user_id, phone, github, blog, public FROM ?? WHERE ??=?";
                const table = ["portfolio_contact", "user_id", user_id];
                query = mysql.format(query, table);

                db.query(query, function(err, rows) {
                    if (err) {
                        res.status(500).json({errorMsg: "Database connection error"});
                    } else {
                        let phone = null;
                        let github = null;
                        let blog = null;
                        let is_public = null;

                        if(rows.length === 1) {
                            phone = rows[0].phone;
                            github = rows[0].github;
                            blog = rows[0].blog;
                            is_public = !!rows[0].public;
                        }

                        res.json({
                            email: email,
                            phone: phone,
                            github: github,
                            blog: blog,
                            isPublic: is_public
                        });
                    }
                });
            } else {
                res.status(404).json({errorMsg : "User Not Found"});
            }
        }
    });
});

// Edit or Create Contact
router.post('/contact', authMiddleware, [
    check('phone').isString(),
    check('github').isString(),
    check('blog').isString(),
    check('isPublic').isBoolean()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errorMsg: "Bad Parameter", errors: errors.array() })
    }

    const email = req.decoded.email;

    let query = "SELECT user_id, email FROM ?? WHERE ??=?";
    const table = ["user", "email", email];
    query = mysql.format(query, table);

    db.query(query, function(err, rows) {
        if(err) {
            res.status(500).json({errorMsg : "Database connection error"});
        } else {
            if(rows.length === 1) {
                const user_id = rows[0].user_id;
                let query = "SELECT user_id FROM ?? WHERE ??=?";
                const table = ["portfolio_contact", "user_id", user_id];
                query = mysql.format(query, table);

                db.query(query, function(err, rows) {
                    if (err) {
                        res.status(500).json({errorMsg: "Database connection error"});
                    } else {
                        if(rows.length === 1) {
                            let query = "UPDATE portfolio_contact SET phone = ?, github = ?, blog = ?, public = ? WHERE user_id=?";
                            const table = [req.body.phone, req.body.github, req.body.blog, req.body.isPublic, user_id];
                            query = mysql.format(query, table);

                            db.query(query, function(err, rows) {
                                if (err) {
                                    res.status(500).json({errorMsg : "Cannot Save Contact"});
                                } else {
                                    res.json({message : "Success"});
                                }
                            });
                        } else {
                            let query = "INSERT INTO ?? SET ?";
                            const table = ["portfolio_contact"];
                            query = mysql.format(query, table);

                            const contact = {
                                user_id: user_id,
                                phone: req.body.phone,
                                github: req.body.github,
                                blog: req.body.blog,
                                public: req.body.isPublic
                            };

                            db.query(query, contact, function(err, rows) {
                                if (err) {
                                    res.status(500).json({errorMsg : "Cannot Save Contact"});
                                } else {
                                    res.status(201).json({message : "Success"});
                                }
                            });
                        }
                    }
                });
            } else {
                res.status(404).json({errorMsg : "User Not Found"});
            }
        }
    });
});

module.exports = router;
