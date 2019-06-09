var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var model = require('./model');
var cvModel = model.cv;
var deliveryModel = model.delivery;
var config = require('../config');
const jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

const secretKey = config.secretKey;

// 判断是否为管理员的中间件（非用户），基于expressJwt中间件的req.user
const checkIsAdmin = function (req, res, next) {
    if (req.user.username && (req.user.isAdmin == true)) {
        console.log(`已确定为管理员【${req.user.username}】，非用户。`);
        next()
    } else {
        res.status(401).send(`此token为用户，不可请求管理员api`);
    }
};

// 获取所有投递
router.get('/delivery/all',
    expressJwt({ secret: secretKey }),
    checkIsAdmin,
    function (req, res, next) {
        // deliveryList格式为数据库中delivery表的格式
        var deliveryList = deliveryModel.getAllDeliveries();
        console.log('deliveryList is ', deliveryList);
        if (deliveryList) {
            return res.json({ state: 'success', deliveryList: deliveryList });
        } else {
            return res.json({ state: 'fail', errMsg: '从数据库中获取投递列表失败' });
        }
    });

// 获取所有简历
router.get('/cv/all',
    expressJwt({ secret: secretKey }),
    checkIsAdmin,
    function (req, res, next) {
        // cvList格式为数据库中cv表的格式
        var cvList = cvModel.getCvList();
        console.log('cvList is ', cvList);
        if (cvList) {
            return res.json({ state: 'success', cvList: cvList });
        } else {
            return res.json({ state: 'fail', errMsg: '从数据库中获取简历列表失败' });
        }
    });

// 流转（更新“待处理”投递的状态为“面试中”并且确定下面试时间）
router.post('/delivery/transfer',
    expressJwt({ secret: secretKey }),
    checkIsAdmin,
    function (req, res, next) {
        var deliveryId = req.body.deliveryId;
        var interviewTimestamp = req.body.timestamp;
        var delivery = deliveryModel.transfer(deliveryId, interviewTimestamp);
        if (delivery) {
            return res.json({ state: 'success', deliveryId: delivery["id"],
                deliveryState: delivery["环节状态"], interviewTimestamp: delivery["面试时间"] });
        } else {
            return res.json({ state: 'fail', errMsg: '从数据库中更新投递失败' });
        }
    });

// 结束面试（更新“面试中”投递的状态为“已通过”或“已结束”）
router.post('/delivery/complete',
    expressJwt({ secret: secretKey }),
    checkIsAdmin,
    function (req, res, next) {
        var deliveryId = req.body.deliveryId;
        var completeState = req.body.completeState;
        if (completeState != '已通过' && completeState != '已结束') {
            return res.json({ state: 'fail', errMsg: 'completeState参数应为"已通过"或"已结束"' });
        }
        var delivery = deliveryModel.setState(deliveryId, completeState);
        if (delivery) {
            return res.json({ state: 'success' });
        } else {
            return res.json({ state: 'fail', errMsg: '从数据库中更新投递的环节状态失败' });
        }
    });

router.get('/attachment/download/:file',
    expressJwt({ secret: secretKey }),
    checkIsAdmin,
    function (req, res, next) {
        var fileName = req.params.file;
        const filepath = path.join(__dirname, '..', 'attachment', fileName);
        if (!fs.existsSync(filepath)) {
            res.status(404).json({ state: 'fail', errMsg: '附件不存在' });
        }
        res.download(filepath); // Set disposition and send it.
    });
    

module.exports = router;
