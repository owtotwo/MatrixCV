var express = require('express');
var router = express.Router();
var model = require('./model');
var userModel = model.user;
var model = require('./model');
var deliveryModel = model.delivery;
var config = require('../config');
const jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

var secretKey = config.secretKey;

// 这个不知道怎么才用对
// router.use(expressJwt({ secret: secretKey }).unless({ path: ["/login"] }));

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
    var token = jwt.sign({
        username: username,
        // 管理员部分暂时还没写，统一当作普通用户
        isAdmin: false
    }, secretKey, {
            expiresIn: 60 * 60 * 2 // 授权时效2分钟
        });
    console.log('token = ', token);
    res.json({ state: 'success', token: token });
});

// 查询是否已登录，并获取用户名与查看是否为管理员
router.get('/islogined',
    expressJwt({ secret: secretKey }),
    function (req, res, next) {
        console.log('判断登录时确定token有效');
        res.json({
            state: 'success', isLogined: true,
            username: req.user.username, isAdmin: req.user.isAdmin
        });
    },
    function(err, req, res, next) {
        console.log('判读登录时未发现有效token');
        res.json({ state: 'success', isLogined: false });
    });

// 查询是否已登录，并获取用户名与查看是否为管理员
router.get('/hascv',
    expressJwt({ secret: secretKey }),
    function (req, res, next) {
        if (userModel.hasCvByUser(req.user.username)) {
            res.json({
                state: 'success', hasCV: true
            });
        } else {
            res.json({
                state: 'fail', hasCV: false
            });
        }
    });

// 用户投递
router.post('/deliver',
    expressJwt({ secret: secretKey }),
    function (req, res, next) {
        var username = req.user.username;
        if (!userModel.hasCvByUser(username)) {
            return res.json({ state: 'fail', errMsg: '此用户没有简历，无法投递' });
        }
        var newDeliveryId = deliveryModel.deliver(username, {
            name: req.body.name,
            positionName: req.body.positionName,
            place: req.body.place, // 其实用不上
            freeTime: req.body.freeTime,
            remark: req.body.remark
        });
        if (newDeliveryId == "") {
            return res.json({ state: 'fail', errMsg: '因未知原因投递失败' });
        }
        res.json({ state: 'success' });
    });

router.use(function (err, req, res, next) {
    // 统一处理认证错误
    console.log('user.js中统一处理认证错误的中间件');
    console.log('err: ', err);
    console.log('req.body: ', req.body);
    if (err.name === 'UnauthorizedError') {
        res.status(err.status).send(`没有合法的token(${err.message})`);
    } else {
        res.json({ state: 'fail', errMsg: '未知错误' });
    }
});

module.exports = router;
