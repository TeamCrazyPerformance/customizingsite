var express = require('express');
var router = express.Router();
var path = require('path');
var mysql = require('mysql');
var db = require('../db');
var authMiddleware = require('../middlewares/auth');
const { check, validationResult } = require('express-validator');
const uuid = require('uuid');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
AWS.config.loadFromPath(__dirname + '/../config.json');
let s3 = new AWS.S3();

let upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'customizingsite',
        key: function (req, file, cb) {
            let extension = path.extname(file.originalname);
            cb(null, 'album/' + uuid.v4() + extension);
        },
        acl: 'public-read-write',
    })
});

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

                        let query = "SELECT item_id, img_key, title, description, date FROM ?? WHERE ??=?";
                        const table = ["album_item", "user_id", user_id];
                        query = mysql.format(query, table);

                        db.query(query, function(err, rows) {
                            if (err) {
                                res.status(500).json({errorMsg: "Database connection error"});
                            } else {
                                let items = [];
                                rows.forEach((v, k) => {
                                    items.push({
                                        itemId: v.item_id,
                                        imgKey: v.img_key,
                                        title: v.title,
                                        description: v.description,
                                        date: v.date,
                                    });
                                });

                                res.json({
                                    email: email,
                                    handwritten: handwritten,
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

// Edit or Create Album
router.post('/', authMiddleware, [
    check('handwritten').isString(),
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
                const table = ["album", "user_id", user_id];
                query = mysql.format(query, table);

                db.query(query, function(err, rows) {
                    if (err) {
                        res.status(500).json({errorMsg: "Database connection error"});
                    } else {
                        if(rows.length === 1) {
                            let query = "UPDATE album SET handwritten = ?, description = ?, public = ? WHERE user_id=?";
                            const table = [req.body.handwritten, req.body.description, req.body.isPublic, user_id];
                            query = mysql.format(query, table);

                            db.query(query, function(err, rows) {
                                if (err) {
                                    res.status(500).json({errorMsg : "Cannot Save Album"});
                                } else {
                                    res.json({message : "Success"});
                                }
                            });
                        } else {
                            let query = "INSERT INTO ?? SET ?";
                            const table = ["album"];
                            query = mysql.format(query, table);

                            const album = {
                                user_id: user_id,
                                handwritten: req.body.handwritten,
                                description: req.body.description,
                                public: req.body.isPublic
                            };

                            db.query(query, album, function(err, rows) {
                                if (err) {
                                    res.status(500).json({errorMsg : "Cannot Save Album"});
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

// Upload Image
router.post('/upload', authMiddleware, upload.single("imgFile"), [
    check('title').isString(),
    check('title').isLength({ min: 1, max: 20 }),
    check('description').isString(),
    check('date').isString(),
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
                let imgFile = req.file;

                const user_id = rows[0].user_id;
                const img_key = imgFile.key;

                let query = "INSERT INTO ?? SET ?";
                const table = ["album_item"];
                query = mysql.format(query, table);

                const album_item = {
                    user_id: user_id,
                    img_key: img_key,
                    title: req.body.title,
                    description: req.body.description,
                    date: req.body.date
                };

                db.query(query, album_item, function(err, rows) {
                    if (err) {
                        res.status(500).json({errorMsg : "Cannot Save Album Item"});
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

// Modify Album Item
router.put('/:itemId', authMiddleware, [
    check('title').isString(),
    check('title').isLength({ min: 1, max: 20 }),
    check('description').isString(),
    check('date').isString(),
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

                let query = "UPDATE album_item SET title = ?, description = ?, date = ?, modified_date = current_timestamp() WHERE item_id=? AND user_id=?";
                const table = [req.body.title, req.body.description, req.body.date, req.params.itemId, user_id];
                query = mysql.format(query, table);

                db.query(query, function(err, rows) {
                    if (err) {
                        res.status(500).json({errorMsg : "Cannot Modify Album Item"});
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

// Delete Album Item
router.delete('/:itemId', authMiddleware, function(req, res, next) {
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

                let query = "DELETE FROM ?? WHERE ??=? AND ??=?";
                const table = ["album_item", "item_id", req.params.itemId, "user_id", user_id];
                query = mysql.format(query, table);

                db.query(query, function(err, rows) {
                    if (err) {
                        res.status(500).json({errorMsg : "Cannot Delete Album Item"});
                    } else {
                        /*
                        TODO remove s3 bucket
                        var params = {  Bucket: 'your bucket', Key: 'your object' };
                        s3.deleteObject(params, function(err, data) {
                            if (err) console.log(err, err.stack);  // error
                            else     console.log();                 // deleted
                        });
                        */

                        res.json({message : "Success"});
                    }
                });
            } else {
                res.status(404).json({errorMsg : "User Not Found"});
            }
        }
    });
});

// Album Info By Account
router.get('/:account', function(req, res, next) {
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

                        if (is_public) {
                            let query = "SELECT item_id, img_key, title, description, date FROM ?? WHERE ??=?";
                            const table = ["album_item", "user_id", user_id];
                            query = mysql.format(query, table);

                            db.query(query, function(err, rows) {
                                if (err) {
                                    res.status(500).json({errorMsg: "Database connection error"});
                                } else {
                                    let items = [];
                                    rows.forEach((v, k) => {
                                        items.push({
                                            itemId: v.item_id,
                                            imgKey: v.img_key,
                                            title: v.title,
                                            description: v.description,
                                            date: v.date,
                                        });
                                    });

                                    res.json({
                                        handwritten: handwritten,
                                        description: description,
                                        items: items
                                    });
                                }
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
