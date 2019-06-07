var app = new Vue({
    el: '#app',
    data: {
        visible: false,
        message: 'Hello Vue!',
        dialogFormVisible: false,
        ruleForm: {
            name: '',
            position: '',
            place: '',
            freeTime: '',
            remark: ''
        },
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
        // formLabelWidth: '120px'
    },
    methods: {
        tryDeliver(position) {
            if (this.isLogined()) {
                this.$alert('请先登录后操作', '未登录', {
                    confirmButtonText: '登录',
                    callback: action => {
                        window.location.href = '/login';
                    }
                });
                return true;
            }
            if (this.hasCV()) {
                this.$alert('请先进入个人中心创建简历', '未创建简历', {
                    confirmButtonText: '转至个人中心',
                    callback: action => {
                        window.location.href = '/profile';
                    }
                });
                return true;
            }
            if (position !== '') {
                this.$alert(`您要投递的岗位是【${position}】`, '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.dialogFormVisible = true;
                    }
                });
                return true;
            }
            this.$message.error('哦噢，好像不符合三种情况~');
            return false;
        },
        isLogined() {
            return true;
        },
        hasCV() {
            return true;
        },
        deliver() {
            this.$message({
                message: '恭喜你，投递成功！',
                type: 'success'
            });
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