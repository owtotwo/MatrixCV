const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

const shortid = require('shortid')

const form = {
    "admin": [
        { "id": "Admin", "password": "admin" },
        { "id": "AnotherAdmin", "password": "adminPasswd"}
    ],
    "user": [
        { 
            "username": "UserA", // 唯一
            "password": "plaintext",
            "cv": [ { "cvid": 1 } ], // 暂时一个用户只有一个简历
        },
    ],
    "cv": [
        {
            "id": 1,
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
            "id": 1,
            "user": "UserA",
            "cv": "cvid",
            "投递岗位": "产品经理",
            "投递时间": "UTC格式的时间",
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
        admin: [ {'id':'admin','password':'admin'} ],
        user: [],
        cv: [],
        delivery: [],
        attachment: [],
        position: []
    })
    .write();

const cvModel = {
    getCvFromId: function(cvid) {
        return db.get('cv')
            .find({ id: cvid })
            .value();
    },
    setCvFromId: function(cvid, cvContent) {
        db.get('cv')
            .find({ id: cvid })
            .assign({ content: cvContent })
            .write();
    },
    createCv: function(content, attachmentFilePath) {
        console.log('createCv: ', content);
        var newCvId = shortid.generate();
        const result = db.get('cv')
            .push({ id: newCvId, content: content })
            .write();
        return newCvId;
    },
    deleteCvFromId: function(cvid) {
        db.get('cv')
            .remove({ id: cvid })
            .write();
    }
}

const positionModel = {
    getPositionList: function() {
        return db.get('position')
            .value();
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
    position: positionModel
};
