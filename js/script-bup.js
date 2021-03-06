let userName;
let userStayConection;
let userMessageType = 'message';
let userReceiver = 'Todos';
let objUsername = {};

function loginRoomUser(element) {
    userName = document.querySelector('.input-sing-user').value;
    objUsername.name = userName;

    const promiseUsername = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', objUsername);
    promiseUsername.then(reloadMessages); // enterChat
    promiseUsername.catch(verifyError); // errorLogin
}

function reloadMessages() {
    console.log('sucesso');
    let reloadMessages = setInterval(getMessages, 3000);
    showSpinLoad();

    userStayConection = setInterval(function () {
        conectionUser(objUsername);
    }, 5000);

    const promiseParticipants = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    promiseParticipants.then(getParticipants);
    promiseParticipants.catch();

    setInterval(reloadParticipants, 10000);
}


function conectionUser(getUsername) {
    console.log('conectado');
    const promiseConectionUser = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', getUsername);
}

function reloadParticipants() {
    const promiseParticipants = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    promiseParticipants.then(getParticipants);
    promiseParticipants.catch();
}


function getParticipants(participants) {
    const allParticipants = participants.data;
    document.querySelector('.list-users').innerHTML = '';
    document.querySelector('.list-users').innerHTML = `
    <li name="Todos">
        <ion-icon name="people"></ion-icon>
        <span>Todos</span>
        <ion-icon name="checkmark-outline" class="check-select"></ion-icon>
    </li>`;
    
    for(let i = 0; i < allParticipants.length; i++) {
        let uniqueParticipant = allParticipants[i].name;
        if (uniqueParticipant !== userName) {
            document.querySelector('.list-users').innerHTML += `
                <li name="${uniqueParticipant}">
                    <ion-icon name="person-circle"></ion-icon>
                    <span>${uniqueParticipant}</span>
                    <ion-icon name="checkmark-outline" class="check-select"></ion-icon>
                </li>`;
        }
    }

    clickSelectParticipants();
}

function getMessages() {
    const allMessages = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    allMessages.then(loadMessages);
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

        } else if (messageType === 'private_message') {
            if (messageReceiver === userName || messageUser === userName) {
                messageTemplate = `
                <li class="single-message private-message">
                    <span>(${messageTime})</span>
                    <span><strong>${messageUser}</strong> reservadamente para <strong>${messageReceiver}</strong>: ${messageText}</span>
                </li>`;
            }

        }

        document.querySelector('.messages-users').innerHTML += messageTemplate;
    }

    document.querySelector('.messages-users').lastElementChild.scrollIntoView();
}

function sendMessage() {
    const inputMessage = document.querySelector('.input-user-message');
    const userMessageText = inputMessage.value;
    console.log(userMessageText);

    console.log(userName);

    const newMessage = {
        from: userName,
        to: userReceiver,
        text: userMessageText,
        type: userMessageType
    };


    const promiseSendMessage = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', newMessage);
    promiseSendMessage.then(getMessages);
    promiseSendMessage.catch(errorMessage);

    inputMessage.value = '';
}

function verifyError(error) {
    if (error.response.status === 400) {
        showMessageError();
        objUsername = {};

    }

}

function errorMessage(error) {
    if (error.response.status === 400) {
        window.location.reload();

    }
}

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

function showHideLateralMenu() {
    let lateralMenu = document.querySelector('.lateral-menu');

    if (lateralMenu.classList.contains('lm-on-off')) {
        lateralMenu.classList.remove('lm-on-off');
    } else {
        console.log('oi');
        lateralMenu.classList.add('lm-on-off');
    }
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
        loginRoomUser();
        console.log('logado');
    }
});

function showUserReceiver() {
    if (userReceiver === 'Todos') {
        document.querySelector('.message-box p').innerHTML = `Enviando para Todos`;

    } else {
        let convMessageType;
        switch (userMessageType) {
            case 'message':
                convMessageType = 'publicamente';
                break;
            case 'private_message':
                convMessageType = 'reservadamente';
                break;

            default:
                convMessageType = '';
                break;
        }

        if (userReceiver.length > 25) {
            document.querySelector('.message-box p').innerHTML = `Enviando para ${(userReceiver.substr(0, 24))}... (${convMessageType})`;
        } else {
            document.querySelector('.message-box p').innerHTML = `Enviando para ${userReceiver} (${convMessageType})`;
        }
    }
}

function clickSelectParticipants() {
    let listUsers = document.querySelectorAll('.list-users li');
    console.log(listUsers);
    for (let i = 0; i < listUsers.length; i++) {
        if (userReceiver === listUsers[i].getAttribute('name')) {
            listUsers[i].classList.add('selected-user');
        }
    }

    showUserReceiver();

    let ulUsers = document.querySelectorAll('.list-users li').forEach(li => {
        li.addEventListener('click', event => {
            let selectedUser = document.querySelector('.selected-user');
            if (selectedUser !== null) {
                selectedUser.classList.remove('selected-user');
            }

            li.classList.add('selected-user');
            userReceiver = li.getAttribute('name');
            console.log(userReceiver);

            showUserReceiver();
        });
    });
}

let ulType = document.querySelectorAll('.list-type li').forEach(liType => {
    liType.addEventListener('click', event => {
        let selectedType = document.querySelector('.selected-type');
        if (selectedType !== null) {
            selectedType.classList.remove('selected-type');
        }

        liType.classList.add('selected-type');
        userMessageType = liType.getAttribute('name');
        console.log(userMessageType);

        showUserReceiver();
    });
});