// const form = document.querySelector('.form-wrapper');
// const userName = document.querySelector('#userName');

// userName.onblur = async () => {
//     const value = userName.value;
//     const response = await fetch('https://study.duyiedu.com/api/user/exists?loginId=' + value);
//     const result = await response.json();
//     if(result.code!==0){
//         alert(result.msg);
//     }
// }

// form.onsubmit = async (e) => {
//     const pwd = document.querySelector('#userPassword');
//     const theSecondTimePwd = document.querySelector('#userConfirmPassword');
//     if (pwd.value !== theSecondTimePwd.value) {
//         alert('两次密码不一致');
//         return;
//     }
//     e.preventDefault();
//     const response = await fetch('https://study.duyiedu.com/api/user/reg', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             loginId: userName.value,
//             loginPwd: document.querySelector('#userPassword').value,
//             nickname: document.querySelector('#userNickname').value
//         })
//     });
//     const result = await response.json();
//     if (result.code !== 0) {
//         alert(result.msg);
//         return;
//     }
// }


(async () => {
    let isRepeat = false;

    const init = () => {
        initEvent();
    }


    const initEvent = () => {
        userName.onblur = onUserNameBlur;
        formContainer.onsubmit = onFormSubmit;
    }


    const onUserNameBlur = async () => {
        const value = userName.value.trim();
        if (!value) {
            return;
        }
        // 注意加上await，不然返回的是pending的promise对象
        const result = await myFetch({
            url: '/user/exists',
            params: {
                loginId: value
            }
        });
        isRepeat = result;


        // 传统形式
        // const response = await fetch('https://study.duyiedu.com/api/user/exists?loginId=' + value);
        // const result = await response.json();
        // isRepeat = result.data;
        // if (result.code !== 0) {
        //     alert(result.msg);
        // }
    }


    const onFormSubmit = async (e) => {
        e.preventDefault();
        const loginId = userName.value.trim();
        const nickname = userNickname.value.trim();
        const loginPwd = userPassword.value.trim();
        const confirmQwd = userConfirmPassword.value.trim();
        if (!checkForm(loginId, nickname, loginPwd, confirmQwd)) {
            return;
        };
        sendData(loginId, nickname, loginPwd);
    }


    const sendData = async (loginId, nickname, loginPwd) => {
        
        // 传统形式
        // const response = await fetch('https://study.duyiedu.com/api/user/reg', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         loginId,
        //         nickname,
        //         loginPwd
        //     }),
        // });
        // const result = await response.json();
        // if (result.code !== 0) {
        //     alert(result.msg);
        //     return;
        // }
        const result = await myFetch({
            url: '/user/reg',
            method: 'POST',
            params: { loginId, loginPwd, nickname }
        });
        result && window.location.replace(baseURL +'index.html');
    }


    const checkForm = (loginId, nickname, loginPwd, confirmQwd) => {
        switch (true) {
            case !loginId:
                alert('用户名不能为空');
                return;
            case !nickname:
                alert('昵称不能为空');
                return;
            case !loginPwd:
                alert('密码不能为空');
                return;
            case !confirmQwd:
                alert('确认密码不能为空');
                return;
            case confirmQwd !== loginPwd:
                alert('两次密码不一致');
                return;
            case isRepeat:
                alert('账号已存在');
                return;
            default: 2
                return true;
        }
    }


    init();
})();