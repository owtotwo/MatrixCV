// cv.js文件

// 引入lowdb模块
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

/*
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
            "cvid": 1,
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
                "附件简历": "某个/路径/下的文件"
            }
        }
    ],
    "application": [
        {
            "id": 1,
            "user": "UserA",
            "cv": "cvid",
            "投递岗位": "产品经理",
            "投递时间": "UTC格式的时间",
            "环节状态": "待处理/面试中/已结束/已通过"
        }
    ]
};
*/

// Set some defaults (required if your JSON file is empty)
db.defaults({ admin: [ {'id':'admin','password':'admin'} ], user: [], cv: [], application: [ ] })
  .write();

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

//导出model模块
const Hero = module.exports = mongoose.model('hero',heroSchema);
