let globalUsername;
let globalMessageType = 'message';
let globalUserReceiver = 'Todos';
let intervalStayConection, intervalReloadMessages, intervalReloadParticipants;
let objUsername = {};

let participantsAPI = 'https://mock-api.driven.com.br/api/v6/uol/participants';
let statusAPI = 'https://mock-api.driven.com.br/api/v6/uol/status';
let messagesAPI = 'https://mock-api.driven.com.br/api/v6/uol/messages';

function stayConectionUser() {
    const promiseConectionUser = axios.post(statusAPI, objUsername);
}

function loginRoomUser() {
    globalUsername = document.querySelector('.input-sing-user').value;
    objUsername.name = globalUsername;

    const promiseLoginUser = axios.post(participantsAPI, objUsername);
    promiseLoginUser.then(successLogin); // successLogin
    promiseLoginUser.catch(errorLogin); // errorLogin
}

function successLogin() {
    showSpinLoad();
    intervalReloadMessages = setInterval(getMessages, 3000);
    intervalStayConection = setInterval(stayConectionUser, 5000);
    getListParticipants();
    intervalReloadParticipants = setInterval(getListParticipants, 10000);
}

function errorLogin(error) {
    if (error.response.status === 400) {
        showMessageError();
        objUsername = {};
    }
}

function getMessages() {
    const promiseAllMessages = axios.get(messagesAPI);
    promiseAllMessages.then(renderMessages);
}

function getListParticipants() {
    const promiseListParticipants = axios.get(participantsAPI);
    promiseListParticipants.then(renderParticipants);
}

function renderParticipants(participants) {
    const allParticipants = participants.data;
    document.querySelector('.list-users').innerHTML = '';
    document.querySelector('.list-users').innerHTML = `
    <li name="Todos">
        <ion-icon name="people"></ion-icon>
        <span>Todos</span>
        <ion-icon name="checkmark-outline" class="check-select"></ion-icon>
    </li>`;
    
    for (let i = 0; i < allParticipants.length; i++) {
        let uniqueParticipant = allParticipants[i].name;
        if (uniqueParticipant !== globalUsername) {
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

function renderMessages(messages) {
    document.querySelector('.messages-users').innerHTML = '';
    let messageTemplate;

    for (let i = 0; i < messages.data.length; i++) {
        const message = messages.data[i];
        const aMessage = {
            sender: message.from,
            receiver: message.to,
            text: message.text,
            type: message.type,
            time: message.time
        }

        if (aMessage.type === 'status') {
            messageTemplate = `
            <li class="single-message status-message">
                <span>(${aMessage.time})</span>
                <span><strong>${aMessage.sender}</strong>  ${aMessage.text}</span>
            </li>`;

        } else if (aMessage.type === 'message') {
            messageTemplate = `
            <li class="single-message public-message">
                <span>(${aMessage.time})</span>
                <span><strong>${aMessage.sender}</strong> para <strong>${aMessage.receiver}</strong>: ${aMessage.text}</span>
            </li>`;

        } else if (aMessage.type === 'private_message') {
            if (aMessage.receiver === globalUsername || aMessage.sender === globalUsername) {
                messageTemplate = `
                <li class="single-message private-message">
                    <span>(${aMessage.time})</span>
                    <span><strong>${aMessage.sender}</strong> reservadamente para <strong>${aMessage.receiver}</strong>: ${aMessage.text}</span>
                </li>`;
            }

        }

        document.querySelector('.messages-users').innerHTML += messageTemplate;
    }

    document.querySelector('.messages-users').lastElementChild.scrollIntoView();
}

function sendMessage() {
    const inputMessage = document.querySelector('.input-user-message');
    const createdMessageText = inputMessage.value;

    const newMessage = {
        from: globalUsername,
        to: globalUserReceiver,
        text: createdMessageText,
        type: globalMessageType
    };
    
    const promiseSendMessage = axios.post(messagesAPI, newMessage);
    promiseSendMessage.then(getMessages);
    promiseSendMessage.catch(errorDeliverMessage);

    inputMessage.value = '';
}

function errorDeliverMessage(error) {
    if (error.response.status === 400) {
        setTimeout(function () { window.location.reload(); }, 2500);
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
        lateralMenu.classList.add('lm-on-off');
    }
}

function showUserReceiver() {
    if (globalUserReceiver === 'Todos') {
        globalMessageType = 'message';
        document.querySelector('.message-box p').innerHTML = `Enviando para Todos`;
    } else {
        let convMessageType;
        switch (globalMessageType) {
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

        if (globalUserReceiver.length > 25) {
            document.querySelector('.message-box p').innerHTML = `Enviando para ${(globalUserReceiver.substr(0, 24))}... (${convMessageType})`;
        } else {
            document.querySelector('.message-box p').innerHTML = `Enviando para ${globalUserReceiver} (${convMessageType})`;
        }
    }
}

function clickSelectParticipants() {
    let listUsers = document.querySelectorAll('.list-users li');
    for (let i = 0; i < listUsers.length; i++) {
        if (globalUserReceiver === listUsers[i].getAttribute('name')) {
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
            globalUserReceiver = li.getAttribute('name');

            if (globalUserReceiver !== 'Todos') {
                document.querySelector('.list-type').lastElementChild.classList.remove('block-type-message');
            } else {
                document.querySelector('.list-type').firstElementChild.classList.add('selected-type');
                document.querySelector('.list-type').lastElementChild.classList.remove('selected-type');
                document.querySelector('.list-type').lastElementChild.classList.add('block-type-message');
            }

            let listType = document.querySelectorAll('.list-type li');
            for (let i = 0; i < listType.length; i++) {
                if (listType[i].classList.contains('selected-type')) {
                    globalMessageType = listType[i].getAttribute('name');
                    break;
                }
            }

            showUserReceiver();
        });
    });
}

function clickSelectType() {
    let ulType = document.querySelectorAll('.list-type li').forEach(liType => {
        liType.addEventListener('click', event => {
            if (globalUserReceiver !== 'Todos') {
                let selectedType = document.querySelector('.selected-type');
                if (selectedType !== null) {
                    selectedType.classList.remove('selected-type');
                }

                liType.classList.add('selected-type');
                globalMessageType = liType.getAttribute('name');

                showUserReceiver();
            }
        });
    });
}

clickSelectType();

let inputFieldLogin = document.querySelector('.input-sing-user');
inputFieldLogin.addEventListener('focus', function () {
    inputFieldLogin.setAttribute('placeholder', '');
});

inputFieldLogin.addEventListener('blur', function () {
    inputFieldLogin.setAttribute('placeholder', 'Digite seu nome');
});

inputFieldLogin.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        loginRoomUser();
    }
});

let inputFieldMessage = document.querySelector('.input-user-message');
inputFieldMessage.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});