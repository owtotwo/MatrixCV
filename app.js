var express = require('express');

var app = express();

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var api = require('./api/api');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.use('/api', api);

app.get('/', function(req, res, next) {
    res.location('/index.html');
});

app.listen(3000, function () {
	  console.log('Example app listening on port 3000!');
});
