var express = require('express');

// const jwt= require('jsonwebtoken');
var expressJwt = require('express-jwt');
var config = require('./config');

var app = express();

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var api = require('./api/api');
// var uploader = require('./uploader');

var secretKey = config.secretKey;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.use('/api', api);
// app.use('/upload', uploader);

app.get('/', function(req, res, next) {
    res.location('/index.html');
});

app.listen(3000, function () {
	  console.log('Example app listening on port 3000!');
});
