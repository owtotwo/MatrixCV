const secretKey = 'MatrixCV is Constant Victory';

const defaultDatabaseContent = {
    admin: [
        {
            'id': 'admin',
            'password': '21232f297a57a5a743894a0e4a801fc3' // "admin"
        }
    ],
    user: [
        {
            "username": "abc",
            "password": "e10adc3949ba59abbe56e057f20f883e", // "123456"
            "cv": ""
        }
    ],
    cv: [],
    delivery: [],
    position: [
        {
            "name": "前端",
            "description": "切图狗",
            "requirement": "熟练使用Javascript",
            "place": "数据科学与计算机学院楼A302实验室"
        },
        {
            "name": "服务端",
            "description": "就是捣鼓服务器的",
            "requirement": "熟练使用php",
            "place": "数据科学与计算机学院楼A302实验室"
        },
        {
            "name": "后台",
            "description": "实话说我也不知道跟服务端区别是啥",
            "requirement": "熟练使用Java, Tomcat, Apache",
            "place": "数据科学与计算机学院楼A302实验室"
        },
        {
            "name": "产品经理",
            "description": "产品狗没啥好说的",
            "requirement": "熟练使用Sketch, 墨刀",
            "place": "数据科学与计算机学院楼A302实验室"
        },
        {
            "name": "设计师",
            "description": "准时下班设计师",
            "requirement": "起码得会Webydo",
            "place": "数据科学与计算机学院楼A302实验室"
        },
        {
            "name": "运营",
            "description": "很惨的一个岗位",
            "requirement": "随时oncall，会用python，linux，shell脚本编写",
            "place": "数据科学与计算机学院楼A302实验室"
        }
    ]
};

module.exports = {
    secretKey: secretKey,
    defaultDatabaseContent: defaultDatabaseContent
};
