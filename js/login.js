// const form = document.querySelector('form');
// form.onsubmit = async (e) => {
//     e.preventDefault();
//     const response = await fetch('https://study.duyiedu.com/api/user/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             loginId: document.querySelector('#userName').value,
//             loginPwd: document.querySelector('#userPassword').value
//         })
//     });
//     const result = await response.json();
//     console.log(result);
//     if (result.code !== 0) {
//         alert(result.msg);
//     }
// }




(() => {
    const init = () => {
        initEvent();
    }


    const initEvent = () => {
        formContainer.onsubmit = onFormSubmitClick;
    }

    const onFormSubmitClick = async (e) => {
        e.preventDefault();
        const loginId = userName.value.trim();
        const loginPwd = userPassword.value.trim();
        if (!loginId || !loginPwd) {
            alert('必填字段不能为空！');
            return;
        }
        sendData(loginId, loginPwd);
    }

    const sendData = async (loginId, loginPwd) => {
        // 传统形式
        // const response = await fetch('https://study.duyiedu.com/api/user/login', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         loginId: loginId,
        //         loginPwd: loginPwd
        //     })
        // });
        // const result = await response.json();
        // if (result.code !== 0) {
        //     alert(result.msg);
        //     return;
        // }

        const result = await myFetch({
            url: '/user/login',
            method: 'POST',
            params: { loginId, loginPwd }
        });

        result && window.location.replace(baseURL +'index.html');
        // 注意：跳转的相对路径是相对于html文件的位置，而不是相对于此js文件的位置
        // 参数如果为'/',表示跳转到http:127.0.0.1:5500的位置
    }







    init();
})();