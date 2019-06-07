var express = require('express');
var router = express.Router();
var model = require('./model');
var positionModel = model.position;

// 获取可提供岗位(position)的信息
router.get('/', function (req, res, next) {
    var positionList = positionModel.getPositionList();
    // if (typeof positionList === 'undefined')
    //     return res.json({ state: 'fail', errMsg: 'The cv with this cvid does not exist.'});
    console.log('positionList is ', positionList);
    res.json({ state: 'success', positionList: positionList });
});

module.exports = router;
