const config = require('../config');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

const shortid = require('shortid')

// json数据库的格式样例
const form = {
    "admin": [
        // 管理员名字用“id”表示，作为唯一索引，注意密码暂定为md5处理后的哈希值而非明文
        { "id": "Admin", "password": "admin" },
        { "id": "AnotherAdmin", "password": "adminPasswd" }
    ],
    "user": [
        {
            "username": "UserA", // 索引：唯一
            "password": "ciphertext", // MD5加密的密文
            "cv": "Xv_I6Vo3v", // 此用户第一个简历id（以后可能会有多个，这里指首个），没有则为空字符串
        },
    ],
    "cv": [
        {
            "id": "Xv_I6Vo3v", // 索引：shortid生成的唯一id
            "user": "此简历所有者的用户名",
            "content":
            {
                "姓名": "李老八",
                "年级": "大一",
                "院系": "数据科学与计算机学院",
                "专业": "软件工程",
                "项目经历": "无",
                "实习经历": "无",
                "校园活动经验": "无",
                "自身技能": "无",
                "自我评价": "无",
                "附件简历": "一般是以此用户为文件名的zip后缀文件"
            }
        }
    ],
    "delivery": [
        {
            "id": "Ac_I6Vo3v", // 索引：但似乎暂时没用
            "user": "UserA",
            "投递人姓名": "李老八",
            "简历": "cvid",
            "投递岗位": "产品经理",
            "投递时间": "时间戳",
            "面试时间": "未确定/时间戳", // 由管理员确定
            "面试地点": "从岗位position信息中的面试地点place获取，但不与其同步",
            "近期空闲时间": "十月初到十月中旬（非标准时间格式）",
            "环节状态": "待处理/面试中/已结束/已通过"
        }
    ],
    "position": [
        {
            "name": "岗位名称", // 索引
            "description": "岗位描述",
            "requirement": "岗位要求",
            "place": "面试地点"
        }
    ]
};

// Set some defaults (required if your JSON file is empty)
db.defaults(config.defaultDatabaseContent).write();

const cvModel = {
    getCvFromId: function (cvid) {
        return db.get('cv')
            .find({ id: cvid })
            .value();
    },
    getCvFromUser: function (username) {
        var cvid = db.get('user')
            .find({ username: username })
            .value()
            .cv;
        return db.get('cv')
            .find({ id: cvid })
            .value();
    },
    getCvList: function () {
        return db.get('cv')
            .value();
    },
    updateCvFromId: function (cvid, cvContent) {
        db.get('cv')
            .find({ id: cvid })
            .assign({ content: cvContent })
            .write();
    },
    updateCvFromUser: function (username, cvContent) {
        console.log('username: ', username);
        console.log('createCv: ', cvContent);
        var cvid = db.get('user')
            .find({ username: username })
            .value()
            .cv;
        db.get('cv')
            .find({ id: cvid })
            .assign({ content: cvContent })
            .write();
    },
    createCv: function (username, cvContent) {
        console.log('username: ', username);
        console.log('createCv: ', cvContent);
        var newCvId = shortid.generate();
        db.get('cv')
            .push({ id: newCvId, user: username, content: cvContent })
            .write();
        db.get('user')
            .find({ username: username })
            .assign({ cv: newCvId })
            .write();
        return newCvId;
    },
    deleteCvFromId: function (cvid) {
        db.get('cv')
            .remove({ id: cvid })
            .write();
    },
    deleteAllCvFromUser: function (username) {
        db.get('cv')
            .remove({ user: username })
            .write();
    },
    hasCvByUser: function (username) {
        return Boolean(db.get('user')
            .find({ username: username })
            .value()
            .cv);
    }
};

const positionModel = {
    getPositionList: function () {
        return db.get('position')
            .value();
    }
};

const userModel = {
    isUserMatched: function (username, password) {
        return Boolean(db.get('user')
            .find({ username: username, password: password })
            .value());
    },
    isUserExisted: function (username) {
        return Boolean(db.get('user')
            .find({ username: username })
            .value());
    }
};

const deliveryModel = {
    // 默认前提为有简历
    deliver: function (username, content) {
        var newDeliveryId = shortid.generate();

        // 获取用户信息，主要用于获取用户的第一个简历id
        var user = db.get('user')
            .find({ username: username })
            .value();

        // 获取对应岗位的信息，主要用于获取面试地点
        var position = db.get('position')
            .find({ name: content.positionName })
            .value();

        db.get('delivery')
            .push({
                "id": newDeliveryId,
                "user": user.username,
                "投递人姓名": content.name,
                "简历": user.cv,
                "投递岗位": content.positionName,
                "投递时间": Date.now(),
                "近期空闲时间": content.freeTime,
                // 默认为 未确定，由管理员根据 近期空闲时间 确定
                "面试时间": "未确定",
                "面试地点": position.place,
                // 初次创建默认为 待处理
                "环节状态": "待处理",
                "备注": content.remark
            })
            .write();

        return newDeliveryId;
    },
    getDeliveryListFromUser: function (username) {
        console.log('获取用户' + username + '的投递列表');
        var deliveryList = db.get('delivery')
            .filter({ user: username })
            .value();
        console.log(deliveryList);
        return deliveryList;
    },
    getAllDeliveries: function () {
        return db.get('delivery')
            .value();
    },
    transfer: function (deliveryId, timestamp) {
        return db.get('delivery')
            .find({ id: deliveryId })
            .assign({ "面试时间": timestamp, "环节状态": '面试中' })
            .write();
    },
    setState: function (deliveryId, state) {
        return db.get('delivery')
            .find({ id: deliveryId })
            .assign({ "环节状态": state })
            .write();
    }
}

const adminModel = {
    isAdminExisted: function (username) {
        return Boolean(db.get('admin')
            .find({ id: username })
            .value());
    },
    isAdminMatched: function (username, password) {
        return Boolean(db.get('admin')
            .find({ id: username, password: password })
            .value());
    },
};

module.exports = {
    cv: cvModel,
    position: positionModel,
    user: userModel,
    delivery: deliveryModel,
    admin: adminModel
};
