var express = require('express');

const jwt= require('jsonwebtoken');
var expressJwt = require('express-jwt');

var app = express();

const secret = 'hardcoding-secret-sysu';

function generateToken() {
	return jwt.sign({
		name: 'Everyone'
	}, secret, {
		expiresIn:  360 //秒到期时间
	});
}

app.get('/', function (req, res) {
	  res.send('Hello World! \n<a href="/getToken">Get Token</a>\n<a href="/admin">I am Admin.</a>');
});

//定义一个接口，返回token给客户端
app.get('/getToken', function(req, res) {
    res.json({
        token: generateToken()
    });
});

app.get('/admin',
  expressJwt({ secret: secret }),
  function(req, res) {
    if (!req.user.admin) return res.sendStatus(401);
	res.sendStatus(200);
	res.send('Now you are admin.');
  });

app.listen(3000, function () {
	  console.log('Example app listening on port 3000!');
});
