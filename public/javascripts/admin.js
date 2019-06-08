var app = new Vue({
    el: '#app',
    data: {
        activeName: '未完成',
        filterFrom: {
            positionName: '',
            state: '',
        },
        unfinishedTableData: [{
            id: '02',
            name: '孙艺兴',
            position: '前端',
            time: '2019-11-11 43:52:30',
            state: '面试中',
            grade: '大一',
            college: '数据院',
            major: '软工',
            project_exp: '无',
            internship_exp: '无',
            activity_exp: '无',
            skill: '无',
            evaluation: '无'
        }, {
            id: '04',
            name: '孙艺兴',
            position: '设计师',
            time: '2019-11-11 43:52:30',
            state: '面试中',
            grade: '大一',
            college: '数据院',
            major: '软工',
            project_exp: '无',
            internship_exp: '无',
            activity_exp: '无',
            skill: '无',
            evaluation: '无'
        }, {
            id: '01',
            name: '孙艺兴',
            position: '后台',
            time: '2019-11-11 43:52:30',
            state: '待处理',
            grade: '大一',
            college: '数据院',
            major: '软工',
            project_exp: '无',
            internship_exp: '无',
            activity_exp: '无',
            skill: '无',
            evaluation: '无'
        }, {
            id: '03',
            name: '孙艺兴',
            position: '产品经理',
            time: '2019-11-11 43:52:30',
            state: '面试中',
            grade: '大一',
            college: '数据院',
            major: '软工',
            project_exp: '无',
            internship_exp: '无',
            activity_exp: '无',
            skill: '无',
            evaluation: '无'
        }, {
            id: '04',
            name: '孙艺兴',
            position: '设计师',
            time: '2019-11-11 43:52:30',
            state: '面试中',
            grade: '大一',
            college: '数据院',
            major: '软工',
            project_exp: '无',
            internship_exp: '无',
            activity_exp: '无',
            skill: '无',
            evaluation: '无'
        }, {
            id: '03',
            name: '孙艺兴',
            position: '产品经理',
            time: '2019-11-11 43:52:30',
            state: '面试中',
            grade: '大一',
            college: '数据院',
            major: '软工',
            project_exp: '无',
            internship_exp: '无',
            activity_exp: '无',
            skill: '无',
            evaluation: '无'
        }],
        finishedTableData: [{
            id: '02',
            name: '孙艺兴',
            position: '前端',
            time: '2019-11-11 43:52:30',
            state: '已通过',
            grade: '大一',
            college: '数据院',
            major: '软工',
            project_exp: '无',
            internship_exp: '无',
            activity_exp: '无',
            skill: '无',
            evaluation: '无'
        }, {
            id: '04',
            name: '孙艺兴',
            position: '设计师',
            time: '2019-11-11 43:52:30',
            state: '已通过',
            grade: '大一',
            college: '数据院',
            major: '软工',
            project_exp: '无',
            internship_exp: '无',
            activity_exp: '无',
            skill: '无',
            evaluation: '无'
        }, {
            id: '01',
            name: '孙艺兴',
            position: '后台',
            time: '2019-11-11 43:52:30',
            state: '已结束',
            grade: '大一',
            college: '数据院',
            major: '软工',
            project_exp: '无',
            internship_exp: '无',
            activity_exp: '无',
            skill: '无',
            evaluation: '无'
        }]
    },
    // mounted: {},
    methods: {
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
        }
    }
});