var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

router.post('/attachment', function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, 'tmp'); // 文件保存的临时目录为当前项目下的tmp文件夹
    if (!fs.existsSync(form.uploadDir)) {
        fs.mkdirSync(form.uploadDir, (error) => { /* handle error */ });
    }
    form.maxFieldsSize = 2 * 1024 * 1024; // 用户头像大小限制为最大1M  
    form.keepExtensions = true; // 使用文件的原扩展名
    form.parse(req, function (err, fields, file) {
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
        var targetDir = path.join(__dirname, 'attachment');
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir);
        }
        var fileExt = filePath.substring(filePath.lastIndexOf('.'));
        // 判断文件类型是否允许上传
        if (('.zip').indexOf(fileExt.toLowerCase()) === -1) {
            // var err = new Error('此文件类型不允许上传');
            res.json({ state: 'fail', errMsg: '此文件类型不允许上传' });
        } else {
            // 以当前时间戳对上传文件进行重命名
            var fileName = new Date().getTime() + fileExt;
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

module.exports = router;
