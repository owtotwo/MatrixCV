// 需要先引入axios

// axios拦截器
// 拦截请求，给所有的请求都带上token
axios.interceptors.request.use(request => {
    const matrixcv_json_web_token = window.localStorage.getItem('matrixcv_json_web_token');
    if (matrixcv_json_web_token) {
        // 此处有坑，在此记录request.headers['Authorization']
        // 必须通过此种形式设置Authorization，否则后端即使收到字段也会出现问题，返回401,
        // request.headers.Authorization或request.headers.authorization可以设置成功，
        // 浏览器查看也没有任何问题，但是在后端会报401并且后端一律只能拿到小写的，
        // 也就是res.headers.authorization，后端用大写获取会报undefined.
        request.headers['Authorization'] = `Bearer ${matrixcv_json_web_token}`;
    }
    return request;
});

// 拦截响应，遇到token不合法则报错
axios.interceptors.response.use(
    response => {
        if (response.data.token) {
            console.log('token:', response.data.token);
            window.localStorage.setItem('matrixcv_json_web_token', response.data.token);
        }
        return response;
    },
    error => {
        const errRes = error.response;
        if (errRes.status === 401) {
            window.localStorage.removeItem('matrixcv_json_web_token');
            app.$message.error('Jwt验证错误，请重新登录');
            window.setTimeout(() => (window.location.href = '/index.html'), 2000);
        }
        // 返回接口返回的错误信息
        return Promise.reject(error.message);
    });