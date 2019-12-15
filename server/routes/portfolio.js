var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var nodeMailer = require('nodemailer');
var db = require('../db');
const config = require('../config');
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

// Contact Sendmail
router.post('/contact/sendmail/:account', authMiddleware, [
    check('name').isString(),
    check('email').isString(),
    check('subject').isString(),
    check('message').isString()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errorMsg: "Bad Parameter", errors: errors.array() })
    }

    const account = req.params.account;

    let query = "SELECT user_id FROM ?? WHERE ??=?";
    const table = ["user_account", "account", account];
    query = mysql.format(query, table);

    db.query(query, function(err, rows) {
        if(err) {
            res.status(500).json({errorMsg : "Database connection error"});
        } else {
            if(rows.length === 1) {
                const user_id = rows[0].user_id;
                let query = "SELECT A.user_id, B.email, A.phone, A.github, A.blog, A.public FROM ?? A INNER JOIN user B ON A.user_id = B.user_id WHERE A.user_id = ?";
                const table = ["portfolio_contact", user_id];
                query = mysql.format(query, table);

                db.query(query, function(err, rows) {
                    if (err) {
                        res.status(500).json({errorMsg: "Database connection error"});
                    } else {
                        let is_public = null;

                        if(rows.length === 1) {
                            is_public = !!rows[0].public;
                        }

                        if (is_public) {
                            let transporter = nodeMailer.createTransport({
                                port: 587,
                                host: 'smtp.gmail.com',
                                secure: false,
                                requireTLS: true,
                                auth: {
                                    user: config.gmail.user,
                                    pass: config.gmail.pass
                                }
                            });
                            let mailOptions = {
                                from: 'CustomizingSite <customizingsite@gmail.com>',
                                replyTo: `${req.body.name} \<${req.body.email}\>`,
                                to: rows[0].email,
                                subject: req.body.subject,
                                body: req.body.message
                            };
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    res.status(500).json({errorMsg: "Cannot send email"});
                                    return console.log(error);
                                }
                                console.log('Message %s sent: %s', info.messageId, info.response);
                                res.json({message: "Success"});
                            });
                        } else {
                            res.status(403).json({errorMsg: "Not a public account"});
                        }
                    }
                });
            } else {
                res.status(404).json({errorMsg : "Account Not Found"});
            }
        }
    });
});

module.exports = router;
