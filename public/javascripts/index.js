var app = new Vue({
    el: '#app',
    data: {
        // 投递表单弹出框的弹出trigger
        deliveryDialogFormVisible: false,
        // 登录表单弹出框的弹出trigger
        loginDialogFormVisible: false,
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
                    this.deliveryDialogFormVisible = true;
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
        submitDeliveryForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$message({
                        message: '恭喜你，投递成功！',
                        type: 'success'
                    });
                    this.deliveryDialogFormVisible = false;
                    window.location.href = '/profile';
                } else {
                    this.$message.error('哦噢，好像投递失败了~');
                    return false;
                }
            });
        },
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
                                token = data.token
                                this.loginDialogFormVisible = false;
                                // window.location.href = '/profile';
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

// axios拦截器
// 拦截请求，给所有的请求都带上token
axios.interceptors.request.use(request => {
    const matrixcv_jwt_token = window.localStorage.getItem('matrixcv_jwt_token');
    if (matrixcv_jwt_token) {
        // 此处有坑，在此记录request.headers['Authorization']
        // 必须通过此种形式设置Authorization，否则后端即使收到字段也会出现问题，返回401,
        // request.headers.Authorization或request.headers.authorization可以设置成功，
        // 浏览器查看也没有任何问题，但是在后端会报401并且后端一律只能拿到小写的，
        // 也就是res.headers.authorization，后端用大写获取会报undefined.
        request.headers['Authorization'] = `Bearer ${matrixcv_jwt_token}`;
    }
    return request;
});

// 拦截响应，遇到token不合法则报错
axios.interceptors.response.use(
    response => {
        if (response.data.token) {
            console.log('token:', response.data.token);
            window.localStorage.setItem('matrixcv_jwt_token', response.data.token);
        }
        return response;
    },
    error => {
        const errRes = error.response;
        if (errRes.status === 401) {
            window.localStorage.removeItem('matrixcv_jwt_token');
            this.$message.error('Jwt验证错误');
        }
        // 返回接口返回的错误信息
        return Promise.reject(error.message);
    });