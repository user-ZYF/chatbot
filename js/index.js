// const token = localStorage.token;
// const sendMessage = document.querySelector('.send-btn');
// const textArea = document.querySelector('.input-container');
// const contentBody = document.querySelector('.content-body');


// // 显示当前用户信息
// (async () => {
//     const result = await myFetch({
//         url: '/user/profile',
//         headers: {
//             Authorization: 'Bearer ' + token,
//         }
//     });

//     const loginTime = document.querySelector('.login-time');
//     const accountName = document.querySelector('.account-name');
//     const nickName = document.querySelector('.nick-name');
//     loginTime.innerText = new Date(result.lastLoginTime).toLocaleString();
//     accountName.innerText = result.loginId;
//     nickName.innerText = result.nickname;
// })();


// // 发送聊天信息
// sendMessage.onclick = async () => {
//     const msg = textArea.value.trim();
//     if (!msg) {
//         alert('内容不能为空');
//         return;
//     }
//     const html = `<div class="chat-container avatar-container">
//         <img src="./img/avtar.png" alt="">
//         <div class="chat-txt">${msg}</div>
//     </div>`;
//     contentBody.innerHTML += html;
//     textArea.value = '';
//     const result = await myFetch({
//         url: '/chat',
//         method: 'POST',
//         headers: {
//             Authorization: 'Bearer ' + token
//         },
//         params: {
//             content: msg
//         }
//     });
//     if (result.code === 401) {
//         alert('登陆已过期，请重新登陆');
//         location.replace('./login.html');
//         return;
//     }
//     const robotMsg = result.content;
//     const robotHTML = `<div class="chat-container robot-container">
//         <img src="./img/robot.jpg" alt="">
//         <div class="chat-txt">
//             ${robotMsg}
//         </div>
//     </div>`;
//     contentBody.innerHTML += robotHTML;
// }


// // 获取聊天记录
// contentBody.onwheel = async (e) => {
//     if (false) {
//         const result = await myFetch({
//             url: '/chat/history?page=0&size=10',
//             headers: {
//                 Authorization: 'Bearer ' + token
//             }
//         });
//         const html = result.map(item => {
//             return `<div class="chat-container ${item.from === 'user' ? 'avatar' : item.from}-container">
//                 <img src="./img/${item.from === 'user' ? 'avtar.png' : item.from + '.jpg'}" alt="">
//                 <div class="chat-txt">
//                     ${item.content}
//                 </div>
//             </div>`;
//         }).join('');
//         contentBody.innerHTML = html;
//     }
// };


// // 切换发送按键
// const selectContainer = document.querySelector('.select-container');
// const arrowContainer = document.querySelector('.arrow-container');

// arrowContainer.onclick = function () {
//     if (this.dataset.hidden === 'true') {
//         this.dataset.hidden = 'false';
//         selectContainer.style.display = 'block';
//     } else {
//         this.dataset.hidden = 'true';
//         selectContainer.style.display = 'none';
//     }
// }

// selectContainer.querySelectorAll('div').forEach(item => {
//     item.onclick = function () {
//         const on = selectContainer.querySelector('.on');
//         on && on.classList.remove('on');
//         this.classList.add('on');
//         selectContainer.style.display = 'none';
//         arrowContainer.dataset.hidden = 'true';
//     }
// });

// textArea.onkeydown = function (e) {
//     const on = document.querySelector('.on');
//     if (e.key === 'Enter') {
//         if (on.getAttribute('type') === 'enter') {
//             e.preventDefault();
//             if (e.ctrlKey) {
//                 this.value += '\r\n';
//                 return;
//             }
//             sendMessage.onclick();
//             return;
//         }
//         if (e.ctrlKey) {
//             sendMessage.onclick();
//         }
//     }
// }


// // 清除内容
// const clearBtn=document.querySelector('.clear');
// clearBtn.onclick=()=>{
//     textArea.value='';
// }













(() => {
    let page = 0;
    let size = 10;
    let chatTotal = 0;
    let sendType = 'enter';


    // 入口函数
    const init = () => {
        getUserInfo();
        initChatList('bottom');
        initEvent();
    }


    // 获取和设置用户信息
    const getUserInfo = async () => {
        const result = await myFetch({
            url: '/user/profile',
        });
        nickName.innerText = result.nickname;
        accountName.innerText = result.loginId;
        loginTime.innerText = formatDate(result.lastLoginTime);
    }


    // 格式化日期函数
    const formatDate = (time) => {
        // 补0函数
        const fillZero = (num) => {
            return num < 10 ? '0' + num : num;
        }
        const date = new Date(time);
        return `${date.getFullYear()}-${fillZero(date.getMonth() + 1)}-${fillZero(date.getDate())} ${fillZero(date.getHours())}:${fillZero(date.getMinutes())}:${fillZero(date.getSeconds())}`;
    }


    // 获取历史聊天记录
    const initChatList = async (status) => {
        const result = await myFetch({
            url: '/chat/history',
            params: {
                page,
                size
            }
        });
        chatTotal = result.chatTotal;
        renderChatForm(result.data, status);
    }


    // 设置聊天信息函数
    const renderChatForm = (list, direction) => {
        if (!list.length) {
            contentBody.innerHTML = `<div class="chat-container robot-container">
                <img src="./img/robot.jpg" alt="">
                <div class="chat-txt">
                    您好！我是腾讯机器人，非常欢迎您的到来，有什么想和我聊聊的吗？
                </div>
            </div>`;
        }
        const chatData = list.reverse().map(item => {
            return item.from === 'robot'
                ? `<div class="chat-container robot-container">
                    <img src="./img/robot.jpg" alt="">
                    <div class="chat-txt">${item.content}</div>
                </div>`
                : `<div class="chat-container avatar-container">
                    <img src="./img/avtar.png" alt="">
                    <div class="chat-txt">${item.content}</div>
                </div>`;
        });
        if (direction === 'bottom') {
            contentBody.innerHTML += chatData.join('');
            const bottomDistance = document.querySelectorAll('.chat-container');
            // 最后一个子元素的top值，即让容器的bottom为0
            const bottom = bottomDistance[bottomDistance.length - 1].offsetTop;
            contentBody.scrollTop = bottom;
        } else {
            contentBody.innerHTML = chatData.join('') + contentBody.innerHTML;
        }
    }


    // 绑定事件函数
    const selectItem = document.querySelectorAll('.select-item');
    const textarea = document.querySelector('textarea');
    const initEvent = async () => {
        sendBtn.onclick = onSendBtnClick;
        contentBody.onscroll = onContentBodyScroll;
        arrowBtn.onclick = onArrowBtnClick;
        selectItem.forEach(item => {
            // 点击切换发送按键
            item.onclick = () => {
                const on = document.querySelector('.on');
                on.classList.remove('on');
                item.classList.add('on');
                sendType = item.getAttribute('type');
                selectType.style.display = 'none';
            }
        });
        textarea.onkeyup = (e) => {
            // 按下enter输入回车是发生在键盘按下时，所以是先有换行再触发keyup事件
            if (e.keyCode === 13 && sendType === 'enter' && !e.ctrlKey || e.keyCode === 13 && sendType === 'ctrlEnter' && e.ctrlKey) {
                onSendBtnClick();
            }
        };
        // 点击X退出
        closeBtn.onclick = () => {
            localStorage.removeItem('token');
            location.replace('./login.html');
        }
    }


    const onArrowBtnClick = () => {
        selectType.style.display = 'block';
    }


    const onSendBtnClick = async () => {
        const value = textarea.value.trim();
        if (!value) {
            textarea.value = '';
            alert('内容不能为空');
            return;
        }
        renderChatForm([{ from: 'user', content: value }], 'bottom');
        textarea.value = '';
        const result = await myFetch({
            method: 'post',
            url: '/chat/',
            params: {
                content: value
            }
        });
        renderChatForm([{ from: 'robot', content: result.content }], 'bottom');
    }


    // 上拉加载聊天数据
    const onContentBodyScroll = async () => {
        if (!contentBody.scrollTop) {
            // 临界值处理
            // 记录是有限的，所以不需要在临界值处进行数据获取
            if (chatTotal <= size * (page + 1)) {
                return;
            }
            initChatList(++page);
            initChatList('top');
        }
    }


    init();
})();