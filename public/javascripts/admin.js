var app = new Vue({
    el: '#app',
    data: {
        activeName: '未完成',
        timeSettingDialogFormVisible: false,
        // 点击待处理按钮时选定要更新的投递
        interviewTimeSettingForm: {
            deliveryId: '', // 点击待处理按钮时更新
            position: '', // 点击待处理按钮时更新
            place: '', // 点击待处理按钮时更新
            freeTime: '', // 点击待处理按钮时更新
            remark: '', // 点击待处理按钮时更新
            date1: '', // 日期
            date2: '' // 时间
        },
        filterFrom: {
            positionName: '',
            state: '',
        },
        cvList: [],
        unfinishedTableData: [{
            id: '02',
            name: '孙艺兴',
            position: '前端',
            deliveryTime: '2019-11-11 43:52:30',
            state: '面试中',
            grade: '大一',
            college: '数据院',
            major: '软工',
            project_exp: '无',
            internship_exp: '无',
            activity_exp: '无',
            skill: '无',
            evaluation: '无',
            place: '不知道',
            freeTime: '用户说了算',
            remark: '无',
            interviewTime: '这是面试时间11月初'
        }, {
            id: '04',
            name: '孙艺兴',
            position: '设计师',
            deliveryTime: '2019-11-11 43:52:30',
            state: '面试中',
            grade: '大一',
            college: '数据院',
            major: '软工',
            project_exp: '无',
            internship_exp: '无',
            activity_exp: '无',
            skill: '无',
            evaluation: '无',
            place: '不知道',
            freeTime: '用户说了算',
            remark: '无',
            interviewTime: '这是面试时间11月初'
        }, {
            id: '01',
            name: '孙艺兴',
            position: '后台',
            deliveryTime: '2019-11-11 43:52:30',
            state: '待处理',
            grade: '大一',
            college: '数据院',
            major: '软工',
            project_exp: '无',
            internship_exp: '无',
            activity_exp: '无',
            skill: '无',
            evaluation: '无',
            place: '不知道',
            freeTime: '用户说了算',
            remark: '无',
            interviewTime: '这是面试时间11月初'
        }, {
            id: '03',
            name: '孙艺兴',
            position: '产品经理',
            deliveryTime: '2019-11-11 43:52:30',
            state: '面试中',
            grade: '大一',
            college: '数据院',
            major: '软工',
            project_exp: '无',
            internship_exp: '无',
            activity_exp: '无',
            skill: '无',
            evaluation: '无',
            place: '不知道',
            freeTime: '用户说了算',
            remark: '无',
            interviewTime: '这是面试时间11月初'
        }, {
            id: '04',
            name: '孙艺兴',
            position: '设计师',
            deliveryTime: '2019-11-11 43:52:30',
            state: '面试中',
            grade: '大一',
            college: '数据院',
            major: '软工',
            project_exp: '无',
            internship_exp: '无',
            activity_exp: '无',
            skill: '无',
            evaluation: '无',
            place: '不知道',
            freeTime: '用户说了算',
            remark: '无',
            interviewTime: '这是面试时间11月初'
        }, {
            id: '03',
            name: '孙艺兴',
            position: '产品经理',
            deliveryTime: '2019-11-11 43:52:30',
            state: '面试中',
            grade: '大一',
            college: '数据院',
            major: '软工',
            project_exp: '无',
            internship_exp: '无',
            activity_exp: '无',
            skill: '无',
            evaluation: '无',
            place: '不知道',
            freeTime: '用户说了算',
            remark: '无',
            interviewTime: '这是面试时间11月初'
        }],
        finishedTableData: [{
            id: '02',
            name: '孙艺兴',
            position: '前端',
            deliveryTime: '2019-11-11 43:52:30',
            state: '已通过',
            grade: '大一',
            college: '数据院',
            major: '软工',
            project_exp: '无',
            internship_exp: '无',
            activity_exp: '无',
            skill: '无',
            evaluation: '无',
            place: '不知道',
            freeTime: '用户说了算',
            remark: '无',
            interviewTime: '这是面试时间11月初'
        }, {
            id: '04',
            name: '孙艺兴',
            position: '设计师',
            deliveryTime: '2019-11-11 43:52:30',
            state: '已通过',
            grade: '大一',
            college: '数据院',
            major: '软工',
            project_exp: '无',
            internship_exp: '无',
            activity_exp: '无',
            skill: '无',
            evaluation: '无',
            place: '不知道',
            freeTime: '用户说了算',
            remark: '无',
            interviewTime: '这是面试时间11月初'
        }, {
            id: '01',
            name: '孙艺兴',
            position: '后台',
            deliveryTime: '2019-11-11 43:52:30',
            state: '已结束',
            grade: '大一',
            college: '数据院',
            major: '软工',
            project_exp: '无',
            internship_exp: '无',
            activity_exp: '无',
            skill: '无',
            evaluation: '无',
            place: '不知道',
            freeTime: '用户说了算',
            remark: '无',
            interviewTime: '这是面试时间11月初'
        }]
    },
    mounted() {
        // 检查登录状态
        axios
            .get('/api/user/isLogined')
            .then(response => {
                var data = response.data;
                console.log(data);
                if (data.state == 'success') {
                    if (data.isLogined == false || data.isAdmin == false) {
                        window.location.href = '/index.html';
                        return;
                    } else {
                        console.log('确认管理员已登录');
                    }
                } else if (data.state == 'fail') {
                    this.$message.error('从服务器获取登陆状态失败');
                }
            })
            .catch(error => this.$message.error(error))
            .finally(() => this.loading = false);
        // 加载所有简历的列表
        this.loadAllCv(() => { this.loadAllDelivery(); });
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
        joinDateAndTimeToTimestamp(yyyyMMdd, hhmmss) {
            return new Date(yyyyMMdd.getFullYear().toString(), yyyyMMdd.getMonth(), yyyyMMdd.getDate(),
                hhmmss.getHours(), hhmmss.getMinutes(), hhmmss.getSeconds()).getTime();
        },
        handleTabClick(tab, event) {
            console.log(tab, event);
        },
        // formatter(row, column) {
        //     return row.address;
        // },
        filterState(value, row) {
            return row.state === value;
        },
        filterHandler(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        loadAllCv(callback) {
            axios
                .get('/api/admin/cv/all')
                .then(response => {
                    var data = response.data;
                    console.log(data);
                    if (data.state == 'success') {
                        // 把简历列表保存好
                        this.cvList = data.cvList;
                        console.log('更新简历列表');
                        callback && callback();
                    } else if (data.state == 'fail') {
                        this.$message.error('从服务器获取简历列表失败');
                    }
                })
                .catch(error => this.$message.error(error))
                .finally(() => this.loading = false);
        },
        // 默认已有cvList，因为需要根据cvList中按索引id取出相应的简历信息到tableData里
        loadAllDelivery(callback) {
            axios
                .get('/api/admin/delivery/all')
                .then(response => {
                    var data = response.data;
                    console.log(data);
                    if (data.state == 'success') {
                        console.log('成功从服务器获取投递列表');
                        this.finishedTableData = [];
                        this.unfinishedTableData = [];
                        var tableDataRef = null; // 指向上述两个列表的引用
                        for (var d of data.deliveryList) {
                            if (d["环节状态"] == "已通过" || d["环节状态"] == "已结束") {
                                tableDataRef = this.finishedTableData;
                            } else if (d["环节状态"] == "面试中" || d["环节状态"] == "待处理") {
                                tableDataRef = this.unfinishedTableData;
                            } else {
                                console.log('环节状态不存在或错误，已忽略此项');
                                continue;
                            }
                            var cvRef = this.cvList.find((cv) => {
                                return cv["id"] == d["简历"];
                            });
                            if (!cvRef) {
                                console.log('找不到相应简历，忽略此项');
                                continue;
                            }
                            var cvContent = cvRef.content;
                            if (d["投递人姓名"] != cvContent["姓名"]) {
                                console.log(`注意！投递人姓名${d["投递人姓名"]}与简历中的姓名${cvContent["姓名"]}不匹配`);
                                console.log('仅显示投递人姓名，简历姓名不显示');
                            }
                            tableDataRef.push({
                                id: d["id"],
                                name: d["投递人姓名"],
                                position: d["投递岗位"],
                                deliveryTime: this.timestampToYyyyMMddhhmmss(d["投递时间"]),
                                state: d["环节状态"],
                                grade: cvContent["年级"],
                                college: cvContent["院系"],
                                major: cvContent["专业"],
                                project_exp: cvContent["项目经历"],
                                internship_exp: cvContent["实习经历"],
                                activity_exp: cvContent["校园活动经验"],
                                skill: cvContent["自身技能"],
                                evaluation: cvContent["自我评价"],
                                place: d["面试地点"],
                                freeTime: d["近期空闲时间"],
                                remark: d["备注"],
                                interviewTime: d["面试时间"],
                                attachment: cvContent["附件简历"]
                            });
                        }
                        console.log('两个tableData更新结束');
                        callback && callback();
                    } else if (data.state == 'fail') {
                        this.$message.error('从服务器获取投递列表失败');
                    }
                })
                .catch(error => this.$message.error(error))
                .finally(() => this.loading = false);
        },
        // 点击待处理按钮
        handlePendingClick(deliveryId) {
            this.timeSettingDialogFormVisible = true;
            this.chooseDeliveryToSetInterviewTime(deliveryId);
        },
        chooseDeliveryToSetInterviewTime(deliveryId) {
            var delivery = this.unfinishedTableData.find((element) => {
                return element["id"] == deliveryId;
            });
            this.interviewTimeSettingForm = {
                deliveryId: delivery.id,
                position: delivery.position,
                place: delivery.place,
                freeTime: delivery.freeTime,
                remark: delivery.remark,
                date1: '', // 日期
                date2: '' // 时间
            };
        },
        // 点击面试中按钮
        handleCompleteClick(deliveryId) {
            var resultAsync = '未知';
            this.$confirm('请确定面试结果（一经确定无法修改）', '结束面试', {
                distinguishCancelAndClose: true,
                iconClass: 'el-icon-finished',
                confirmButtonText: '通过',
                cancelButtonText: '未通过'
            })
                .then(() => {
                    resultAsync = '通过';
                })
                .catch(action => {
                    if (action == 'cancel') {
                        resultAsync = '未通过';
                    }
                }).finally(() => {
                    if (resultAsync == '通过' || resultAsync == '未通过') {
                        var completeState = '未知';
                        if (resultAsync == '通过') {
                            completeState = '已通过';
                        } else if (resultAsync == '未通过') {
                            completeState = '已结束';
                        }
                        axios
                            .post('/api/admin/delivery/complete', {
                                deliveryId: deliveryId,
                                completeState: completeState
                            })
                            .then((response) => {
                                var data = response.data;
                                console.log(data);
                                if (data.state == 'success') {
                                    var deliveryRef = this.unfinishedTableData.find((element) => {
                                        return element["id"] == deliveryId;
                                    });
                                    // 先将投递复制一份到已完成表中（设置好state为两种完成状态之一）
                                    deliveryRef.state = completeState;
                                    this.finishedTableData.push(deliveryRef);
                                    // 通过index删除未完成的表里的投递
                                    var index = this.unfinishedTableData.indexOf(deliveryRef);
                                    console.log('index=', index);
                                    if (index > -1) {
                                        this.unfinishedTableData.splice(index, 1);
                                    }
                                    console.log('将此投递从未完成表中转移到已完成表中 done');
                                    this.$message({
                                        type: 'success',
                                        message: `此面试已确认为${resultAsync}`
                                    });
                                } else if (data.state == 'fail') {
                                    this.$message.error(`未成功结束面试: ${data.errMsg}`);
                                } else {
                                    this.$message.error('因未知错误导致结束面试的请求未成功');
                                }
                            })
                            .catch(error => this.$message.error(error))
                            .finally(() => this.loading = false);
                    }
                });
        },
        // 提交流转
        submitTimeSettingForm() {
            var timestamp = this.joinDateAndTimeToTimestamp(this.interviewTimeSettingForm.date1,
                this.interviewTimeSettingForm.date2);
            axios
                .post('/api/admin/delivery/transfer', {
                    deliveryId: this.interviewTimeSettingForm.deliveryId, // 投递的id
                    timestamp: timestamp, // 面试时间
                })
                .then(response => {
                    var data = response.data;
                    console.log(data);
                    if (data.state == 'success') {
                        var delivery = this.unfinishedTableData.find((element) => {
                            return element["id"] == data.deliveryId;
                        });
                        delivery.state = data.deliveryState;
                        delivery.interviewTime = this.timestampToYyyyMMddhhmmss(data.interviewTimestamp);
                        this.$message({
                            message: `确认面试时间为${this.timestampToYyyyMMddhhmmss(timestamp)}`,
                            type: 'success'
                        });
                    } else if (data.state == 'fail') {
                        this.$message.error(`流转失败: ${data.errMsg}`);
                    } else {
                        this.$message.error('因未知错误导致流转的请求未成功');
                    }
                    // 重置
                    this.interviewTimeSettingForm = {
                        deliveryId: '', // 点击待处理按钮时更新
                        position: '', // 点击待处理按钮时更新
                        place: '', // 点击待处理按钮时更新
                        freeTime: '', // 点击待处理按钮时更新
                        remark: '', // 点击待处理按钮时更新
                        date1: '', // 日期
                        date2: '' // 时间
                    }
                    // 关闭弹出的表单框
                    this.timeSettingDialogFormVisible = false;
                })
                .catch(error => this.$message.error(error))
                .finally(() => this.loading = false);
        },
        downloadAttachment(fileName) {
            axios({
                url: `/api/admin/attachment/download/${fileName}`,
                method: 'GET',
                responseType: 'blob', // important
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName); // or any other extension
                document.body.appendChild(link);
                link.click();
            })
            .catch(error => this.$message.error(error))
            .finally(() => this.loading = false);
        },
        logout() {
            window.localStorage.removeItem('matrixcv_json_web_token');
            window.location.href = '/index.html'
        }
    }
});