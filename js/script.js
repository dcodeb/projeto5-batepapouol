let userName;

function conectionUser(getUsername) {
    const promiseConectionUser = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', getUsername);
}

function singUser(element) {
    const userName = document.querySelector('.input-sing-user').value;
    
    const sendUsername = {
        name: userName
    }

    const promiseUsername = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', sendUsername);
    promiseUsername.then(reloadMessages);
    promiseUsername.catch(verifyError);

    let stayConection = setInterval(function () {
        conectionUser(sendUsername);
    }, 5000);

}

function getMessages() {
    const allMessages = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    allMessages.then(loadMessages);
}

function reloadMessages() {
    console.log('sucesso');
    let reloadMessages = setInterval(getMessages, 3000);
    showSpinLoad();

}

function loadMessages(messages) {
    document.querySelector('.messages-users').innerHTML = '';
    let messageUser, messageType, messageTime, messageTemplate;
    let message;

    for (let i = 0; i < messages.data.length; i++) {
        message = messages.data[i];
        messageUser = message.from;
        messageReceiver = message.to;
        messageText = message.text;
        messageType = message.type;
        messageTime = message.time;

        if (messageType === 'status') {
            messageTemplate = `
            <li class="single-message status-message">
                <span>(${messageTime})</span>
                <span><strong>${messageUser}</strong>  ${messageText}</span>
            </li>`;

        } else if (messageType === 'message') {
            messageTemplate = `
            <li class="single-message public-message">
                <span>(${messageTime})</span>
                <span><strong>${messageUser}</strong> para <strong>${messageReceiver}</strong>: ${messageText}</span>
            </li>`;

        } else if (messageUser === userName && messageType === 'private_message') {
            messageTemplate = `
            <li class="single-message private-message">
                <span>(${messageTime})</span>
                <span><strong>${messageUser}</strong> reservadamente para <strong>${messageReceiver}</strong>: ${messageText}</span>
            </li>`;

        }

        document.querySelector('.messages-users').innerHTML += messageTemplate;
    }

}

function sendMessage() {
    const userMessageText = document.querySelector('.input-user-message').value;
    console.log(userMessageText);

    const newMessage = {
        from: userName,
        to: 'Todos',
        text: userMessageText,
        type: 'message'
    };

    const promiseSendMessage = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', newMessage);
    promiseSendMessage.then(getMessages);

    document.querySelector('.cobaia').scrollIntoView();
}

function verifyError(error) {
    if (error.response.status === 400) {
        showMessageError();

    }

}

//singUser();

function showMessageError() {
    document.querySelector('.input-sing-user').value = '';
    document.querySelector('.error-user').classList.add("error-on");
    setTimeout(function () { document.querySelector('.error-user').classList.remove('error-on'); }, 2500);
}

function showSpinLoad() {
    document.querySelector('.log-user').style.display = 'none';
    document.querySelector('.load-room').style.display = 'block';
    setTimeout(function () {
        document.querySelector('.home-page').style.display = 'none';
    }, 5000);
}

let inputField = document.querySelector('.input-sing-user');

inputField.addEventListener('focus', function () {
    inputField.setAttribute('placeholder', '');
});

inputField.addEventListener('blur', function () {
    inputField.setAttribute('placeholder', 'Digite seu nome');
});

inputField.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        singUser();
    }
});
