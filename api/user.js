var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var model = require('./model');
var userModel = model.user;
var deliveryModel = model.delivery;
var cvModel = model.cv;
var adminModel = model.admin;
var config = require('../config');
const jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

const secretKey = config.secretKey;

// 这个不知道怎么才用对 先不用了
// router.use(expressJwt({ secret: secretKey }).unless({ path: ["/login"] }));

// 用户登录
router.post('/login', function (req, res, next) {
    console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    var isAdminExisted = adminModel.isAdminExisted(username);
    // 默认用户名不能与管理员ID重复
    if (isAdminExisted == true) {
        var isAdminMatched = adminModel.isAdminMatched(username, password);
        console.log('isAdminMatched result:', isAdminMatched);
        if (isAdminMatched == false) {
            return res.json({ state: 'fail', errMsg: '管理员密码错误' });
        } else {
            // 管理员登录成功过后生成token返给前端
            var adminToken = jwt.sign({
                username: username,
                isAdmin: true
            }, secretKey, {
                    expiresIn: 60 * 60 * 6 // 授权时效6小时
                });
            console.log('adminToken = ', adminToken);
            return res.json({ state: 'success', token: adminToken, isAdmin: true });
        }
    }
    // 已判断非管理员，那么下面是判断用户登录
    var isUserExisted = userModel.isUserExisted(username);
    console.log('isUserExisted result:', isUserExisted);
    if (isUserExisted == false) {
        return res.json({ state: 'fail', errMsg: '此用户不存在' });
    }
    var isUserMatched = userModel.isUserMatched(username, password);
    console.log('isUserMatched result:', isUserMatched);
    if (isUserMatched == false) {
        return res.json({ state: 'fail', errMsg: '密码错误' });
    }
    // 用户登录成功过后生成token返给前端
    var token = jwt.sign({
        username: username,
        isAdmin: false
    }, secretKey, {
            expiresIn: 60 * 60 * 2 // 授权时效2小时
        });
    console.log('token = ', token);
    res.json({ state: 'success', token: token, isAdmin: false });
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

// 判断是否为用户的中间件（非管理员），基于expressJwt中间件的req.user
const checkIsUser = function (req, res, next) {
    if (req.user.username && (req.user.isAdmin == false)) {
        console.log(`已确定为用户【${req.user.username}】，非管理员。`);
        next()
    } else {
        res.status(401).send(`此token为管理员，不可请求用户api`);
    }
};

// 查询是否已有简历
router.get('/hascv',
    expressJwt({ secret: secretKey }),
    checkIsUser,
    function (req, res, next) {
        res.json({
            state: 'success', hasCV: cvModel.hasCvByUser(req.user.username)
        });
    });

// 获取我的简历
router.get('/cv',
    expressJwt({ secret: secretKey }),
    checkIsUser,
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
    checkIsUser,
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
    checkIsUser,
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
            "自我评价": cvContent.evaluation,
            "附件简历": cvContent.attachment
        });
        res.json({ state: 'success' });
    });

// 新建用户简历
router.post('/cv/create',
    expressJwt({ secret: secretKey }),
    checkIsUser,
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
            "自我评价": cvContent.evaluation,
            "附件简历": cvContent.attachment
        });
        res.json({ state: 'success' });
    });

// 用户投递
router.post('/deliver',
    expressJwt({ secret: secretKey }),
    checkIsUser,
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

router.post('/attachment',
    expressJwt({ secret: secretKey }),
    checkIsUser,
    function (req, res, next) {
        var username = req.user.username;
        var form = new formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, '..', 'tmp'); // 文件保存的临时目录为当前项目下的tmp文件夹
        if (!fs.existsSync(form.uploadDir)) {
            fs.mkdirSync(form.uploadDir, (error) => { /* handle error */ });
        }
        form.maxFieldsSize = 2 * 1024 * 1024; // 用户头像大小限制为最大1M  
        form.keepExtensions = true; // 使用文件的原扩展名
        form.parse(req, (err, fields, file) => {
            var filePath = '';
            // 如果提交文件的form中将上传文件的input名设置为tmpFile，就从tmpFile中取上传文件。否则取for in循环第一个上传的文件。
            if (file.tmpFile) {
                filePath = file.tmpFile.path;
            } else {
                for (var key in file) {
                    if (file[key].path && filePath === '') {
                        filePath = file[key].path;
                        break;
                    }
                }
            }
            // 文件移动的目录文件夹，不存在时创建目标文件夹
            var targetDir = path.join(__dirname, '..', 'attachment');
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir);
            }
            var fileExt = filePath.substring(filePath.lastIndexOf('.'));
            // 判断文件类型是否允许上传
            if (('.zip').indexOf(fileExt.toLowerCase()) === -1) {
                // var err = new Error('此文件类型不允许上传');
                res.json({ state: 'fail', errMsg: '此文件类型不允许上传' });
            } else {

                // // 以当前时间戳对上传文件进行重命名
                // var fileName = new Date().getTime() + fileExt;

                // 以用户名为附件文件名
                var fileName = username + fileExt;
                var targetFile = path.join(targetDir, fileName);
                // 移动文件
                fs.rename(filePath, targetFile, function (err) {
                    if (err) {
                        console.info(err);
                        res.json({ state: 'fail', errMsg: '操作失败' });
                    } else {
                        // 上传成功，返回文件的相对路径
                        var fileUrl = '/attachment/' + fileName;
                        res.json({ state: 'success', fileUrl: fileUrl, fileName: fileName });
                    }
                });
            }
        });
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
