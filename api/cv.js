var express = require('express');
var router = express.Router();
var model = require('./model');
var cvModel = model.cv;

router.get('/', function (req, res, next) {
    var cvId = req.query.id;
    if (!cvId)
        return res.json({ state: 'fail', errMsg: 'Wrong param cv id.'});
    console.log('cvid = ', cvId);
    
    var cv = cvModel.getCvFromId(cvId);
    if (typeof cv === 'undefined')
        return res.json({ state: 'fail', errMsg: 'The cv with this cvid does not exist.'});

    var cvContent = cv.content;
    console.log('cvContent = ', cvContent);
    res.json({ state: 'success', id: cvId, content: cvContent });
});

router.post('/new', function (req, res, next) {
    console.log('req.body = ', req.body);
    if (!req.body.cv) return res.json({ state: 'fail', errMsg: 'No param cv' });
    var newCvId = cvModel.createCv({
        "姓名": "李老八",
        "年级": "大一",
        "院系": "数据科学与计算机学院",
        "专业": "软件工程",
        "项目经历": "无",
        "实习经历": "无",
        "校园活动经验": "无",
        "自身技能": "无",
        "自我评价": "无",
        "附件简历": "某个/路径/下的文件"
    });
    res.json({ state: 'success', id: newCvId });
});

router.post('/update', function (req, res, next) {
    console.log('req.body = ', req.body);
    if (!req.body.cv) return res.json({ state: 'fail', errMsg: 'No param cv' });
    res.json({ state: 'success', cv: req.body.cv});
});

module.exports = router;
