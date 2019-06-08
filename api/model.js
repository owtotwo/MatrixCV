const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

const shortid = require('shortid')

const form = {
    "admin": [
        { "id": "Admin", "password": "admin" },
        { "id": "AnotherAdmin", "password": "adminPasswd" }
    ],
    "user": [
        {
            "username": "UserA", // 唯一
            "password": "ciphertext", // MD5加密的密文
            "cv": "Xv_I6Vo3v", // 此用户第一个简历id（以后可能会有多个，这里指首个），没有则为空字符串
        },
    ],
    "cv": [
        {
            "id": "Xv_I6Vo3v", // shortid生成的唯一id
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
                "附件简历": "attachmentId"
            }
        }
    ],
    "delivery": [
        {
            "id": "Ac_I6Vo3v", // 似乎暂时没用
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
    "attachment": [
        {
            "id": "ABC",
            "filepath": "某个/路径/下的文件"
        }
    ],
    "position": [
        {
            "name": "岗位名称",
            "description": "岗位描述",
            "requirement": "岗位要求",
            "place": "面试地点"
        }
    ]
};

// Set some defaults (required if your JSON file is empty)
db.defaults({
    admin: [{ 'id': 'admin', 'password': 'admin' }],
    user: [],
    cv: [],
    delivery: [],
    attachment: [],
    position: []
})
.write();

const cvModel = {
    getCvFromId: function (cvid) {
        return db.get('cv')
            .find({ id: cvid })
            .value();
    },
    setCvFromId: function (cvid, cvContent) {
        db.get('cv')
            .find({ id: cvid })
            .assign({ content: cvContent })
            .write();
    },
    createCv: function (username, content, attachmentFilePath) {
        console.log('username: ', username);
        console.log('createCv: ', content);
        var newCvId = shortid.generate();
        db.get('cv')
            .push({ id: newCvId, user: username, content: content })
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
    }
};

const positionModel = {
    getPositionList: function () {
        return db.get('position')
            .value();
    }
};

const userModel = {
    isMatched: function (username, password) {
        return Boolean(db.get('user')
            .find({ username: username, password: password })
            .value());
    },
    isUserExisted: function (username) {
        return Boolean(db.get('user')
            .find({ username: username })
            .value());
    },
    hasCvByUser: function (username) {
        return Boolean(db.get('user')
            .find({ username: username })
            .value()
            .cv);
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
    }
}
// // Add a user
// db.get('users')
//   .push({ id: 1, title: 'lowdb is awesome'})
//   .write()

// // Set a user using Lodash shorthand syntax
// db.set('user.name', 'typicode')
//   .write()

// // Increment count
// db.update('count', n => n + 1)
//   .write()

module.exports = {
    cv: cvModel,
    position: positionModel,
    user: userModel,
    delivery: deliveryModel
};
