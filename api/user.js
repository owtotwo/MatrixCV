var express = require('express');
var router = express.Router();
var model = require('./model');
var userModel = model.user;
var config = require('../config');
const jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

var secretKey = config.secretKey;

router.use(expressJwt({ secret: secretKey }).unless({path: ["/login"]}));

// 用户登录
router.post('/login', function (req, res, next) {
    console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    var isExisted = userModel.isUserExisted(username);
    var isMatched = userModel.isMatched(username, password);
    console.log('isExisted result:', isExisted);
    console.log('isMatched result:', isMatched);
    if (isExisted == false) {
        return res.json({ state: 'fail', errMsg: '此用户不存在' });
    }
    if (isMatched == false) {
        return res.json({ state: 'fail', errMsg: '密码错误' });
    }
    // 用户登录成功过后生成token返给前端
    var token = jwt.sign({ username: username }, secretKey, {
        expiresIn: 60 * 60 * 12 // 授权时效24小时
    });
    console.log('token = ', token);
    res.json({ state: 'success', token: token });
});

// 测试jwt用，获取用户的cv列表(cvid list)
router.get('/cv', function (req, res, next) {
        console.log(req.headers);
        if (req.headers.authorization) {
            jwt.verify(token, secretKey, function (err, decoded) {
                if (err) {
                    return res.json({ state: 'fail', errMsg: '未知错误' });
                } else {
                    // 如果验证通过，在req中写入解密结果
                    //   req.decoded = decoded;  
                    console.log(decoded);
                    res.json({ state: 'fail', errMsg: '有效的token.', decoded: decoded });
                }
            });
        } else {
            console.log('没有json web token');
            return res.json({ state: 'fail', errMsg: '无效的token.' });
        }
    });

module.exports = router;
