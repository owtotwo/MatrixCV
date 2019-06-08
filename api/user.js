var express = require('express');
var router = express.Router();
var model = require('./model');
var userModel = model.user;
var deliveryModel = model.delivery;
var cvModel = model.cv;
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
    function (err, req, res, next) {
        console.log('判读登录时未发现有效token');
        res.json({ state: 'success', isLogined: false });
    });

// 查询是否已有简历
router.get('/hascv',
    expressJwt({ secret: secretKey }),
    function (req, res, next) {
        res.json({
            state: 'success', hasCV: cvModel.hasCvByUser(req.user.username)
        });
    });

// 获取我的简历
router.get('/cv',
    expressJwt({ secret: secretKey }),
    function (req, res, next) {
        var cv = cvModel.getCvFromUser(req.user.username);
        if (!cv) {
            return res.json({ state: 'fail', errMsg: '无法获得' })
        }
        res.json({
            state: 'success',
            // 附件信息不传，不允许用户查看或下载，只允许更新
            cv: {
                "姓名": cv.content["姓名"],
                "年级": cv.content["年级"],
                "院系": cv.content["院系"],
                "专业": cv.content["专业"],
                "项目经历": cv.content["项目经历"],
                "实习经历": cv.content["实习经历"],
                "校园活动经验": cv.content["校园活动经验"],
                "自身技能": cv.content["自身技能"],
                "自我评价": cv.content["自我评价"]
            }
        });
    });

// 获取我的投递列表
router.get('/delivery',
    expressJwt({ secret: secretKey }),
    function (req, res, next) {
        var deliveryList = deliveryModel.getDeliveryListFromUser(req.user.username);
        if (!deliveryList) {
            return res.json({ state: 'fail', errMsg: '从数据库中获取用户的投递列表失败' })
        }
        res.json({
            state: 'success',
            deliveryList: deliveryList
        });
    });

// 更新用户简历
router.post('/cv/update',
    expressJwt({ secret: secretKey }),
    function (req, res, next) {
        var cvContent = req.body;
        cvContent["附件简历"] = ""; // 附件还没写
        var hasCV = cvModel.hasCvByUser(req.user.username);
        if (!hasCV) {
            return res.json({ state: 'fail', errMsg: '此用户还没有简历，无法更新' });
        }
        cvModel.updateCvFromUser(req.user.username, {
            "姓名": cvContent.name,
            "年级": cvContent.grade,
            "院系": cvContent.college,
            "专业": cvContent.major,
            "项目经历": cvContent.project_exp,
            "实习经历": cvContent.internship_exp,
            "校园活动经验": cvContent.activity_exp,
            "自身技能": cvContent.skill,
            "自我评价": cvContent.evaluation
        });
        res.json({ state: 'success' });
    });

// 新建用户简历
router.post('/cv/create',
    expressJwt({ secret: secretKey }),
    function (req, res, next) {
        var cvContent = req.body;
        cvContent["附件简历"] = ""; // 附件还没写
        var hasCV = cvModel.hasCvByUser(req.user.username);
        if (hasCV) {
            return res.json({ state: 'fail', errMsg: '用户已有简历，最多一个简历，无法再创建' });
        }
        cvModel.createCv(req.user.username, {
            "姓名": cvContent.name,
            "年级": cvContent.grade,
            "院系": cvContent.college,
            "专业": cvContent.major,
            "项目经历": cvContent.project_exp,
            "实习经历": cvContent.internship_exp,
            "校园活动经验": cvContent.activity_exp,
            "自身技能": cvContent.skill,
            "自我评价": cvContent.evaluation
        }, cvContent["附件简历"]);
        res.json({ state: 'success' });
    });

// 用户投递
router.post('/deliver',
    expressJwt({ secret: secretKey }),
    function (req, res, next) {
        var username = req.user.username;
        if (!cvModel.hasCvByUser(username)) {
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
