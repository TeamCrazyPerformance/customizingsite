var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var db = require('./db');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var userRouter = require('./routes/user');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'content-type, x-access-token');
    next();
});

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);

module.exports = app;
