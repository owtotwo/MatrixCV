var app = new Vue({
    el: '#app',
    data: {
        // 投递表单弹出框的弹出trigger
        dialogFormVisible: false,
        // 选择投递的岗位的引用
        positionSelected: {},
        // 从服务器获取的岗位列表
        positionList: [
            {
                name: '前端（假）',
                description: '切图狗（假）',
                requirement: '熟练使用Javascript（假）',
                place: '数据科学与计算机学院楼A302实验室（假）',
            },
            {
                name: '服务端（假）',
                description: '就是捣鼓服务器的（假）',
                requirement: '熟练使用php（假）',
                place: '数据科学与计算机学院楼A302实验室（假）',
            }
        ],
        // 带验证的投递表单值
        ruleForm: {
            name: '',
            positionName: '',
            place: '',
            freeTime: '',
            remark: ''
        },
        // 验证规则
        rules: {
            name: [
                { required: true, message: '请输入投递人姓名', trigger: 'blur' },
                { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
            ],
            freeTime: [
                { required: true, message: '请填写近期空闲时间', trigger: 'blur' },
                { min: 2, max: 48, message: '长度在 2 到 48 个字符', trigger: 'blur' }
            ],
            internship_exp: [
                { required: false, message: '请填写备注', trigger: 'blur' },
                { max: 140, message: '长度小于 140 个字符', trigger: 'blur' }
            ]
        }
    },
    mounted() {
        axios
            .get('/api/position')
            .then(response => {
                console.log('已收到');
                console.log(response);
                var data = response.data;
                if (data.state == 'success') {
                    this.positionList = data.positionList;
                } else if (data.state == 'fail') {
                    this.$message.error('从服务器获取岗位列表失败');
                } else {
                    return;
                }
            })
            .catch(error => this.$message.error(error))
            .finally(() => this.loading = false)
    },
    methods: {
        // 点击投递按钮后调用，需要在登录的情况下，已有简历，才能弹出 投递表单弹出框
        deliver(post) {
            // 若未登录
            if (!this.isLogined()) {
                this.$alert('请先登录后操作', '未登录', {
                    confirmButtonText: '登录',
                    callback: action => {
                        window.location.href = '/login';
                    }
                });
                return true;
            }
            // 若未有简历
            if (!this.hasCV()) {
                this.$alert('请先进入个人中心创建简历', '未创建简历', {
                    confirmButtonText: '转至个人中心',
                    callback: action => {
                        window.location.href = '/profile';
                    }
                });
                return true;
            }
            // 若post参数没正确传入
            if (typeof (post) === 'undefined') {
                this.$message.error('呃噢，好像post参数没正确传入哦~');
                return false;
            }
            // 弹出表单填写框
            this.$alert(`您要投递的岗位是【${post.name}】`, '提示', {
                confirmButtonText: '确定',
                callback: action => {
                    if (action == 'cancel') return;
                    // 引用相应的岗位object
                    this.positionSelected = post;
                    // 填入面试岗位和面试地点到表单里（不可更改）
                    this.ruleForm.positionName = this.positionSelected.name;
                    this.ruleForm.place = this.positionSelected.place;
                    // 关闭表单弹出框
                    this.dialogFormVisible = true;
                }
            });
            return true;
        },
        // 判断是否登录
        isLogined() {

            return true;
        },
        hasCV() {
            return true;
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$message({
                        message: '恭喜你，投递成功！',
                        type: 'success'
                    });
                    dialogFormVisible = false;
                    window.location.href = '/profile';
                } else {
                    this.$message.error('哦噢，好像投递失败了~');
                    return false;
                }
            });
        },
    }
});