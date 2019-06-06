/**
 * Module dependencies.
 */

var express = require('express');
var router = express.Router();

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var userRouter = require('./user');
var adminRouter = require('./admin');
var pageNotFoundRouter = require('./404');
var errorRouter = require('./error');

app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/404', pageNotFoundRouter);
app.use('/error', errorRouter);


module.exports = app;

/* istanbul ignore next */
if (!module.parent) {
  app.use(logger('dev'));
}

// app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// General

app.get('/', function(req, res, next) {
    res.location('/index');
});

app.get('/index', function(req, res, next) {
    res.sendFile('index.html');
});

// Posts

app.get('/posts', post.list);

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}