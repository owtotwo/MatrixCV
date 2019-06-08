var express = require('express');

// const jwt= require('jsonwebtoken');
var expressJwt = require('express-jwt');
var config = require('./config');

var app = express();

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var api = require('./api/api');

var secretKey = config.secretKey;

app.use(cookieParser());
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use('/api', api);


// function generateToken() {
// 	return jwt.sign({
// 		name: 'Everyone'
// 	}, secret, {
// 		expiresIn:  360 //秒到期时间
// 	});
// }

app.get('/', function(req, res, next) {
    res.location('/index.html');
});

// app.get('/index', function(req, res, next) {
// 	res.sendFile('index.html');
// });

// app.get('/profile', function(req, res, next) {
// 	res.sendFile('profile.html');
// });

//定义一个接口，返回token给客户端
// app.get('/getToken', function(req, res) {
//     res.json({
//         token: generateToken()
//     });
// });

// app.get('/admin',
//   expressJwt({ secret: secret }),
//   function(req, res) {
//     if (!req.user.admin) return res.sendStatus(401);
// 	res.sendStatus(200);
// 	res.send('Now you are admin.');
//   });

app.listen(3000, function () {
	  console.log('Example app listening on port 3000!');
});
