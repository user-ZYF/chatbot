const baseUrl = 'https://study.duyiedu.com/api'

const myFetch = async ({ url, method = 'GET', params = {} }) => {
    if (method === 'GET' && Object.keys(params).length > 0) {
        url += '?' + Object.keys(params).map((key) => ''.concat(key, '=', params[key])).join('&');
    }
    const headers = {};
    localStorage.token && (headers.Authorization = 'Bearer ' + localStorage.token);
    try {
        const response = await fetch(baseUrl + url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: method === 'GET' ? null : JSON.stringify(params)
        });

        // 如果响应头内有token，则需要在获取到response之后获取token
        const token = response.headers.get('Authorization');
        // 逻辑运算符内如果有赋值操作，则需要给赋值操作加括号
        token && (localStorage.token = token);

        const result = await response.json();

        if (result.code !== 0) {
            if (result.status === 401) {
                alert('无效的令牌');
                localStorage.removeItem('token');
                // 跳转页面并不会停止代码执行，只有等到所有代码执行完才跳转
                location.replace('./login.html');
                return;
            }
            alert(result.msg);
            return;
        }
        if (result.hasOwnProperty('chatTotal')) {
            result.data = {
                chatTotal: result.chatTotal,
                data: result.data
            }
        }
        return result.data;
    } catch (err) {
        console.log(err);
    }
}


