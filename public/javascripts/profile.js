var app = new Vue({
    el: '#app',
    data: {
        isCVreadonly: false,
        hasCV: false,
        cv: {
            name: '等待更新',
            grade: '等待更新',
            college: '等待更新',
            major: '等待更新',
            project_exp: '等待更新',
            internship_exp: '等待更新',
            activity_exp: '等待更新',
            skill: '等待更新',
            evaluation: '等待更新'
        },
        ruleCvForm: {
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
                position: '前端开发（假）',
                state: '待处理（假）',
            },
            {
                position: '服务端开发（假）',
                state: '面试中',
                interviewInfo: {
                    time: '2019-03-05 14:00（假）',
                    place: '数据院A302（假）',
                }
            },
            {
                position: '后台开发（假）',
                state: '已结束（假）',
            },
            {
                position: '产品经理（假）',
                state: '已通过（假）',
            },
        ],
        attachment: {
            fileName: '',
            fileUrl: ''
        },
        fileList: []
    },
    mounted() {
        // 检查登录状态
        axios
            .get('/api/user/isLogined')
            .then(response => {
                var data = response.data;
                console.log(data);
                if (data.state == 'success') {
                    if (data.isLogined == false) {
                        window.location.href = '/index.html';
                        return;
                    } else if (data.isAdmin == true) {
                        window.location.href = '/admin.html'
                    } else {
                        console.log('确认用户已登录');
                    }
                } else if (data.state == 'fail') {
                    this.$message.error('从服务器获取登陆状态失败');
                }
            })
            .catch(error => this.$message.error(error))
            .finally(() => this.loading = false);
        // 更新 “我是否有简历” 参数hasCV
        this.updateHasCV((hasCV) => {
            if (hasCV) {
                // 加载我的简历（从服务器获取）
                this.loadMyCv(() => (this.isCVreadonly = true));
            } else {
                this.isCVreadonly = false;
                this.$message('未发现简历，请新建');
            }
        });
        // 加载我的投递列表
        this.loadMyDelivery();
    },
    methods: {
        timestampToYyyyMMddhhmmss(timestamp) {
            const pad2 = (n) => (n < 10 ? '0' + n : n);
            var date = new Date(timestamp);
            return date.getFullYear().toString() + '-'
                + pad2(date.getMonth() + 1) + '-'
                + pad2(date.getDate()) + ' '
                + pad2(date.getHours()) + ':'
                + pad2(date.getMinutes()) + ':'
                + pad2(date.getSeconds());
        },
        updateHasCV(callback) {
            axios
                .get('/api/user/hascv')
                .then(response => {
                    var data = response.data;
                    console.log(data);
                    if (data.state == 'success') {
                        var hasCV = data.hasCV;
                        this.hasCV = hasCV;
                        callback && callback(hasCV);
                    } else if (data.state == 'fail') {
                        this.$message.error('从服务器获取我的简历失败');
                    } else {
                        this.$message.error('未知错误');
                    }
                })
                .catch(error => this.$message.error(error))
                .finally(() => this.loading = false);
        },
        loadMyCv(callback) {
            axios
                .get('/api/user/cv')
                .then(response => {
                    var data = response.data;
                    console.log(data);
                    if (data.state == 'success') {
                        this.cv.name = data.cv["姓名"];
                        this.cv.grade = data.cv["年级"];
                        this.cv.college = data.cv["院系"];
                        this.cv.major = data.cv["专业"];
                        this.cv.project_exp = data.cv["项目经历"];
                        this.cv.internship_exp = data.cv["实习经历"];
                        this.cv.activity_exp = data.cv["校园活动经验"];
                        this.cv.skill = data.cv["自身技能"];
                        this.cv.evaluation = data.cv["自我评价"];
                        console.log('简历加载完毕');
                        this.ruleCvForm.name = this.cv.name;
                        this.ruleCvForm.grade = this.cv.grade;
                        this.ruleCvForm.college = this.cv.college;
                        this.ruleCvForm.major = this.cv.major;
                        this.ruleCvForm.project_exp = this.cv.project_exp;
                        this.ruleCvForm.internship_exp = this.cv.internship_exp;
                        this.ruleCvForm.activity_exp = this.cv.activity_exp;
                        this.ruleCvForm.skill = this.cv.skill;
                        this.ruleCvForm.evaluation = this.cv.evaluation;
                        console.log('简历表单默认值加载完成');
                        callback && callback();
                    } else if (data.state == 'fail') {
                        this.$message.error('从服务器获取我的简历失败');
                    }
                })
                .catch(error => this.$message.error(error))
                .finally(() => this.loading = false);
        },
        loadMyDelivery(callback) {
            axios
                .get('/api/user/delivery')
                .then(response => {
                    var data = response.data;
                    console.log(data);
                    if (data.state == 'success') {
                        this.deliveries = [];
                        for (var delivery of data.deliveryList) {
                            this.deliveries.push({
                                position: delivery["投递岗位"],
                                state: delivery["环节状态"],
                                interviewInfo: {
                                    time: this.timestampToYyyyMMddhhmmss(delivery["面试时间"]),
                                    place: delivery["面试地点"]
                                }
                            });
                        }
                        console.log('加载我的投递列表完成');
                        callback && callback();
                    } else if (data.state == 'fail') {
                        this.$message.error('从服务器获取我的投递列表失败');
                    }
                })
                .catch(error => this.$message.error(error))
                .finally(() => this.loading = false)
        },
        submitCvForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid && this.hasCV) {
                    axios
                        .post('/api/user/cv/update', {
                            name: this.ruleCvForm.name,
                            grade: this.ruleCvForm.grade,
                            college: this.ruleCvForm.college,
                            major: this.ruleCvForm.major,
                            project_exp: this.ruleCvForm.project_exp,
                            internship_exp: this.ruleCvForm.internship_exp,
                            activity_exp: this.ruleCvForm.activity_exp,
                            skill: this.ruleCvForm.skill,
                            evaluation: this.ruleCvForm.evaluation,
                            attachment: this.attachment.fileName
                        })
                        .then((response) => {
                            var data = response.data;
                            console.log(data);
                            if (data.state == 'success') {
                                this.$message({
                                    message: '恭喜你，更新简历成功！',
                                    type: 'success'
                                });
                                // 更新hasCV
                                this.updateHasCV((hasCV) => {
                                    if (hasCV) {
                                        // 重新加载简历并显示“我的简历”
                                        this.loadMyCv(() => (this.isCVreadonly = true));
                                    } else {
                                        this.$message.error('不知道为什么更新成功但服务器说没有简历');
                                    }
                                });
                            } else if (data.state == 'fail') {
                                this.$message({
                                    message: data.errMsg,
                                    type: 'warning'
                                });
                            } else {
                                this.$message.error('未知错误');
                            }
                        })
                        .catch((error) => this.$message.error(error))
                        .finally(() => this.loading = false);
                } else if (valid && !this.hasCV) {
                    axios
                        .post('/api/user/cv/create', {
                            name: this.ruleCvForm.name,
                            grade: this.ruleCvForm.grade,
                            college: this.ruleCvForm.college,
                            major: this.ruleCvForm.major,
                            project_exp: this.ruleCvForm.project_exp,
                            internship_exp: this.ruleCvForm.internship_exp,
                            activity_exp: this.ruleCvForm.activity_exp,
                            skill: this.ruleCvForm.skill,
                            evaluation: this.ruleCvForm.evaluation,
                            attachment: this.attachment.fileName // 附件以文件名方式上传，一用户只允许一个附件，为空则没有
                        })
                        .then((response) => {
                            var data = response.data;
                            console.log(data);
                            if (data.state == 'success') {
                                this.$message({
                                    message: '恭喜你，新建简历成功！',
                                    type: 'success'
                                });
                                // 更新hasCV
                                this.updateHasCV((hasCV) => {
                                    if (hasCV) {
                                        // 重新加载简历并显示“我的简历”
                                        this.loadMyCv(() => (this.isCVreadonly = true));
                                    } else {
                                        this.$message.error('不知道为什么新建成功但服务器说没有简历');
                                    }
                                });
                            } else if (data.state == 'fail') {
                                this.$message({
                                    message: data.errMsg,
                                    type: 'warning'
                                });
                            } else {
                                this.$message.error('未知错误');
                            }
                        })
                        .catch((error) => this.$message.error(error))
                        .finally(() => this.loading = false);
                } else {
                    this.$message.error('哦噢，好像表单不合法~');
                }
            });
        },
        logout() {
            window.localStorage.removeItem('matrixcv_json_web_token');
            window.location.href = '/index.html'
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`);
        },
        getJwtAuthHeaderObj() {
            var header = {};
            const matrixcv_json_web_token = window.localStorage.getItem('matrixcv_json_web_token');
            if (matrixcv_json_web_token) {
                header['Authorization'] = `Bearer ${matrixcv_json_web_token}`;
            }
            return header;
        },
        onBeforeUpload(file) {
            console.log(file);
            console.log('file type is', file.type);
            console.log('file size is', file.size);
            const isZip = file.type === 'application/zip' || file.type === 'application/x-zip-compressed';
            const isLessthan2M = (file.size / 1024 / 1024) < 2;
            if (!isZip) {
                this.$message.error('上传文件只能是zip格式!');
            }
            if (!isLessthan2M) {
                this.$message.error('上传文件大小不能超过 2 MB!');
            }
            return isZip && isLessthan2M;
        },
        onUploadSuccess(res, file, fileList) {
            console.log(res);
            console.log(file);
            if (res.state == 'success') {
                this.$message({
                    type: 'success',
                    message: '已更新到服务器'
                });
                this.attachment.fileName = res.fileName;
                this.attachment.fileUrl = res.fileUrl;
            } else {
                this.$message({
                    type: 'warning',
                    message: `更新到服务器未成功: ${res.errMsg}`
                });
            }
        }
    }
});