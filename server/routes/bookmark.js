var express = require('express');
var router = express.Router();
var path = require('path');
var mysql = require('mysql');
var db = require('../db');
var authMiddleware = require('../middlewares/auth');
const { check, validationResult } = require('express-validator');

// My Bookmark Info
router.get('/', authMiddleware, function(req, res, next) {
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
                let query = "SELECT user_id, title, description, public FROM ?? WHERE ??=?";
                const table = ["bookmark", "user_id", user_id];
                query = mysql.format(query, table);

                db.query(query, function(err, rows) {
                    if (err) {
                        res.status(500).json({errorMsg: "Database connection error"});
                    } else {
                        let title = null;
                        let description = null;
                        let is_public = null;

                        if(rows.length === 1) {
                            title = rows[0].title;
                            description = rows[0].description;
                            is_public = !!rows[0].public;
                        }

                        let query = "SELECT item_id, title, url, color, initial FROM ?? WHERE ??=?";
                        const table = ["bookmark_item", "user_id", user_id];
                        query = mysql.format(query, table);

                        db.query(query, function(err, rows) {
                            if (err) {
                                res.status(500).json({errorMsg: "Database connection error"});
                            } else {
                                let items = [];
                                rows.forEach((v, k) => {
                                    items.push({
                                        itemId: v.item_id,
                                        title: v.title,
                                        url: v.url,
                                        color: v.color,
                                        initial: v.initial,
                                    });
                                });

                                res.json({
                                    email: email,
                                    title: title,
                                    description: description,
                                    isPublic: is_public,
                                    items: items
                                });
                            }
                        });
                    }
                });
            } else {
                res.status(404).json({errorMsg : "User Not Found"});
            }
        }
    });
});

// Edit or Create Bookmark
router.post('/', authMiddleware, [
    check('title').isString(),
    check('description').isString(),
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
                const table = ["bookmark", "user_id", user_id];
                query = mysql.format(query, table);

                db.query(query, function(err, rows) {
                    if (err) {
                        res.status(500).json({errorMsg: "Database connection error"});
                    } else {
                        if(rows.length === 1) {
                            let query = "UPDATE bookmark SET title = ?, description = ?, public = ? WHERE user_id=?";
                            const table = [req.body.title, req.body.description, req.body.isPublic, user_id];
                            query = mysql.format(query, table);

                            db.query(query, function(err, rows) {
                                if (err) {
                                    res.status(500).json({errorMsg : "Cannot Save Bookmark"});
                                } else {
                                    res.json({message : "Success"});
                                }
                            });
                        } else {
                            let query = "INSERT INTO ?? SET ?";
                            const table = ["bookmark"];
                            query = mysql.format(query, table);

                            const bookmark = {
                                user_id: user_id,
                                title: req.body.title,
                                description: req.body.description,
                                public: req.body.isPublic
                            };

                            db.query(query, bookmark, function(err, rows) {
                                if (err) {
                                    res.status(500).json({errorMsg : "Cannot Save Bookmark"});
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
