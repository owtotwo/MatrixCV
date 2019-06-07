var app = new Vue({
    el: '#app',
    data: {
        visible: false,
        message: 'Hello Vue!',
        isCVreadonly: true,
        cv: {
            name: '李老八',
            grade: '大一',
            college: '数据科学与计算机学院',
            major: '软件工程',
            project_exp: '无',
            internship_exp: '真的没有',
            activity_exp: '不骗你',
            skill: '吃饭',
            evaluation: '很能吃'
        },
        ruleForm: {
            name: '',
            grade: '',
            college: '',
            major: '',
            project_exp: '',
            internship_exp: '',
            activity_exp: '',
            skill: '',
            evaluation: ''
        },
        rules: {
            name: [
                { required: true, message: '请输入姓名', trigger: 'blur' },
                { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
            ],
            grade: [
                { required: true, message: '请输入年级', trigger: 'blur' },
                { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
            ],
            college: [
                { required: true, message: '请输入学院', trigger: 'blur' },
                { min: 2, max: 48, message: '长度在 2 到 48 个字符', trigger: 'blur' }
            ],
            major: [
                { required: true, message: '请输入专业', trigger: 'blur' },
                { min: 2, max: 48, message: '长度在 2 到 48 个字符', trigger: 'blur' }
            ],
            project_exp: [
                { required: false, message: '请填写项目经验', trigger: 'blur' }
            ],
            internship_exp: [
                { required: false, message: '请填写实习经验', trigger: 'blur' }
            ],
            activity_exp: [
                { required: false, message: '请填写校园活动经验', trigger: 'blur' }
            ],
            skill: [
                { required: false, message: '请填写自身技能', trigger: 'blur' }
            ],
            evaluation: [
                { required: false, message: '请填写自我评价', trigger: 'blur' }
            ],
        },
        deliveries: [
            {
                position: '前端开发',
                state: '待处理',
            },
            {
                position: '服务端开发',
                state: '面试中',
                interviewInfo: {
                    time: '2019-03-05 14:00',
                    place: '数据院A302',
                }
            },
            {
                position: '后台开发',
                state: '已结束',
            },
            {
                position: '产品经理',
                state: '已通过',
            },
        ]
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var form = this.ruleForm;
                    var cv = this.cv;
                    cv.name = form.name;
                    cv.grade = form.grade;
                    cv.college = form.college;
                    cv.major = form.major;
                    cv.project_exp = form.project_exp;
                    cv.internship_exp = form.internship_exp;
                    cv.activity_exp = form.activity_exp;
                    cv.skill = form.skill;
                    cv.evaluation = form.evaluation;
                    this.$message({
                        message: '恭喜你，保存成功！',
                        type: 'success'
                    });
                    this.isCVreadonly = true;
                } else {
                    console.log('error submit!!');
                    this.$message.error('哦噢，好像保存失败了~');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
});