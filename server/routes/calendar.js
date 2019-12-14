var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db = require('../db');
var authMiddleware = require('../middlewares/auth');
const { check, validationResult } = require('express-validator');

// My Calendar Info
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
                let query = "SELECT user_id, public FROM ?? WHERE ??=?";
                const table = ["calendar", "user_id", user_id];
                query = mysql.format(query, table);

                db.query(query, function(err, rows) {
                    if (err) {
                        res.status(500).json({errorMsg: "Database connection error"});
                    } else {
                        let is_public = null;

                        if(rows.length === 1) {
                            is_public = !!rows[0].public;
                        }

                        res.json({
                            email: email,
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

// Edit or Create Calendar
router.post('/', authMiddleware, [
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
                const table = ["calendar", "user_id", user_id];
                query = mysql.format(query, table);

                db.query(query, function(err, rows) {
                    if (err) {
                        res.status(500).json({errorMsg: "Database connection error"});
                    } else {
                        if(rows.length === 1) {
                            let query = "UPDATE calendar SET public = ? WHERE user_id=?";
                            const table = [req.body.isPublic, user_id];
                            query = mysql.format(query, table);

                            db.query(query, function(err, rows) {
                                if (err) {
                                    res.status(500).json({errorMsg : "Cannot Save Calendar"});
                                } else {
                                    res.json({message : "Success"});
                                }
                            });
                        } else {
                            let query = "INSERT INTO ?? SET ?";
                            const table = ["calendar"];
                            query = mysql.format(query, table);

                            const calendar = {
                                user_id: user_id,
                                public: req.body.isPublic
                            };

                            db.query(query, calendar, function(err, rows) {
                                if (err) {
                                    res.status(500).json({errorMsg : "Cannot Save Calendar"});
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

// Add Calendar
router.post('/add', authMiddleware, [
    check('date').isString(),
    check('todo').isString(),
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

                let query = "INSERT INTO ?? SET ?";
                const table = ["calendar_item"];
                query = mysql.format(query, table);

                const calendar_item = {
                    user_id: user_id,
                    date: req.body.date,
                    todo: req.body.todo
                };

                db.query(query, calendar_item, function(err, rows) {
                    if (err) {
                        res.status(500).json({errorMsg : "Cannot Save Calendar Item"});
                    } else {
                        res.status(201).json({message : "Success"});
                    }
                });
            } else {
                res.status(404).json({errorMsg : "User Not Found"});
            }
        }
    });
});

// Modify Calendar Item
router.put('/:itemId', authMiddleware, [
    check('todo').isString(),
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

                let query = "UPDATE calendar_item SET todo = ?, modified_date = current_timestamp() WHERE item_id=? AND user_id=?";
                const table = [req.body.todo, req.params.itemId, user_id];
                query = mysql.format(query, table);

                db.query(query, function(err, rows) {
                    if (err) {
                        res.status(500).json({errorMsg : "Cannot Modify Calendar Item"});
                    } else {
                        res.json({message : "Success"});
                    }
                });
            } else {
                res.status(404).json({errorMsg : "User Not Found"});
            }
        }
    });
});

module.exports = router;
