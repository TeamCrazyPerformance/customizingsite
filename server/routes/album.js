var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db = require('../db');
var authMiddleware = require('../middlewares/auth');

// My Album Info
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
                let query = "SELECT user_id, handwritten, description, public FROM ?? WHERE ??=?";
                const table = ["album", "user_id", user_id];
                query = mysql.format(query, table);

                db.query(query, function(err, rows) {
                    if (err) {
                        res.status(500).json({errorMsg: "Database connection error"});
                    } else {
                        let handwritten = null;
                        let description = null;
                        let is_public = null;

                        if(rows.length === 1) {
                            handwritten = rows[0].handwritten;
                            description = rows[0].description;
                            is_public = !!rows[0].public;
                        }

                        res.json({
                            email: email,
                            handwritten: handwritten,
                            description: description,
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

module.exports = router;
