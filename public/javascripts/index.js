var app = new Vue({
    el: '#app',
    data: {
        // 投递表单弹出框的弹出trigger
        deliveryDialogFormVisible: false,
        // 登录表单弹出框的弹出trigger
        loginDialogFormVisible: false,
        // 是“登录”还是“个人中心”的trigger，非即时同步，需要维护
        onLogined: false,
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
        ruleDeliveryForm: {
            name: '',
            positionName: '',
            place: '',
            freeTime: '',
            remark: ''
        },
        // 投递表单验证规则
        deliveryFormRules: {
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
        },
        // 带验证的登录表单
        ruleLoginForm: {
            username: '',
            password: ''
        },
        // 登录表单验证规则
        loginFormRules: {
            username: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { max: 24, message: '长度在不大于 24 个字符', trigger: 'blur' }
            ],
            password: [
                { required: true, message: '请输入密码', trigger: 'blur' },
                { max: 24, message: '长度在不大于 24 个字符', trigger: 'blur' }
            ]
        }
    },
    mounted() {
        // 加载岗位列表（从服务器获取）
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
                }
            })
            .catch(error => this.$message.error(error))
            .finally(() => this.loading = false);
        // 检查登录状态并更新onLogined
        axios
            .get('/api/user/isLogined')
            .then(response => {
                var data = response.data;
                console.log(data);
                if (data.state == 'success') {
                    this.onLogined = data.isLogined;
                } else if (data.state == 'fail') {
                    this.$message.error('从服务器获取登陆状态失败');
                }
            })
            .catch(error => this.$message.error(error))
            .finally(() => this.loading = false)
    },
    methods: {
        // 点击投递按钮后调用，需要在登录的情况下，已有简历，才能弹出 投递表单弹出框
        deliver(post) {
            // 懒得用Promise了，回调地狱走起
            // 若未登录
            this.isLogined((isLogined) => {
                if (!isLogined) {
                    this.$alert('请先登录后操作', '未登录', {
                        confirmButtonText: '登录',
                        callback: action => {
                            this.loginDialogFormVisible = true;
                        }
                    });
                } else {
                    this.hasCV((hasCV) => {
                        // 若未有简历
                        if (!hasCV) {
                            this.$alert('请先进入个人中心创建简历', '未创建简历', {
                                confirmButtonText: '转至个人中心',
                                callback: action => {
                                    window.location.href = '/profile.html';
                                }
                            });
                        } else {
                            // 若post参数没正确传入
                            if (typeof (post) === 'undefined') {
                                this.$message.error('呃噢，好像post参数没正确传入哦~');
                                return;
                            }
                            // 弹出表单填写框
                            this.$alert(`您要投递的岗位是【${post.name}】`, '提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    if (action == 'cancel') return;
                                    // 引用相应的岗位object
                                    this.positionSelected = post;
                                    // 填入面试岗位和面试地点到表单里（不可更改）
                                    this.ruleDeliveryForm.positionName = this.positionSelected.name;
                                    this.ruleDeliveryForm.place = this.positionSelected.place;
                                    // 关闭表单弹出框
                                    this.deliveryDialogFormVisible = true;
                                }
                            });
                        }
                    });
                }
            });
        },
        // 判断是否登录
        isLogined(callback) {
            axios
                .get('/api/user/islogined')
                .then(response => {
                    var data = response.data;
                    if (data.state == 'success') {
                        callback && callback(data.isLogined);
                    } else if (data.state == 'fail') {
                        this.$message.error('请求判断是否已登录失败，原因未知');
                    }
                })
                .catch(error => this.$message.error(error))
                .finally(() => this.loading = false)
        },
        hasCV(callback) {
            axios
                .get('/api/user/hascv')
                .then(response => {
                    var data = response.data;
                    if (data.state == 'success') {
                        callback && callback(data.hasCV);
                    } else if (data.state == 'fail') {
                        this.$message.error('请求判断是否已有简历错误，原因未知');
                    }
                })
                .catch(error => this.$message.error(error))
                .finally(() => this.loading = false)
        },
        submitDeliveryForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    axios
                        .post('/api/user/deliver', {
                            name: this.ruleDeliveryForm.name,
                            positionName: this.ruleDeliveryForm.positionName,
                            place: this.ruleDeliveryForm.place, // 其实用不上
                            freeTime: this.ruleDeliveryForm.freeTime,
                            remark: this.ruleDeliveryForm.remark
                        })
                        .then((response) => {
                            console.log('投递ajax返回了');
                            var data = response.data;
                            if (data.state == 'success') {
                                this.$message({
                                    message: '恭喜你，投递成功！',
                                    type: 'success'
                                });
                                this.deliveryDialogFormVisible = false;
                                window.setTimeout(() => (window.location.href = '/profile.html'), 2000);
                            } else if (data.state == 'fail') {
                                this.$message({
                                    message: data.errMsg,
                                    type: 'warning'
                                });
                            } else {
                                this.$message.error('未知错误');
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            this.$message.error(error);
                        })
                        .finally(() => this.loading = false);
                } else {
                    this.$message.error('哦噢，好像投递失败了~');
                    return false;
                }
            });
        },
        // 登录
        submitLoginForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log(this);
                    axios
                        .post('/api/user/login', {
                            username: this.ruleLoginForm.username,
                            // 单纯防止明文密码在网路上传输，也防止明文密码存在于服务器
                            // 实际加密处理在服务器执行
                            password: CryptoJS.MD5(this.ruleLoginForm.password).toString()
                        })
                        .then((response) => {
                            console.log('登录ajax返回了');
                            console.log(response);
                            var data = response.data;
                            if (data.state == 'success') {
                                this.$message({
                                    message: '恭喜你，登录成功！',
                                    type: 'success'
                                });
                                this.onLogined = true;
                                this.loginDialogFormVisible = false;
                                // window.location.href = '/profile.html';
                            } else if (data.state == 'fail') {
                                this.$message({
                                    message: data.errMsg,
                                    type: 'warning'
                                });
                            } else {
                                this.$message.error('未知错误');
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            this.$message.error(error);
                        })
                        .finally(() => this.loading = false);
                } else {
                    this.$message.error('哦噢，好像登录失败了~');
                    return false;
                }
            });
        }
    }
});
