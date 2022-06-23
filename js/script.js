function singUser() {
    const userName = prompt('Qual o nome de usuário que você deseja usar?');
    
    const sendUsername = {
        name: userName
    }

    const promiseUsername = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', sendUsername);
    promiseUsername.then(getMessages);
    promiseUsername.catch(verifyError);

}

function getMessages() {
    console.log('sucesso');

    const allMessages = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    allMessages.then(loadMessages);

}

function verifyError(error) {

    if (error.response.status === 400) {
        alert('nome já usado no momento, utilize outro');
    }

}

function loadMessages(messages) {
    document.querySelector('.messages-users').innerHTML = '';
    let messageUser, messageType, messageTime, messageTemplate;

    for (let i = 0; i < messages.data.length; i++) {
        messageUser = messages.data[i].from;
        messageReceiver = messages.data[i].to;
        messageText = messages.data[i].text;
        messageType = messages.data[i].type;
        messageTime = messages.data[i].time;

        if (messageType === 'status') {
            messageTemplate = `
            <li class="single-message status-message">
                <span>(${messageTime})</span>
                <span><strong>${messageUser}</strong>  entra da sala...</span>
            </li>`;

        } else if (messageType === 'message') {
            messageTemplate = `
            <li class="single-message public-message">
                <span>(${messageTime})</span>
                <span><strong>${messageUser}</strong> para <strong>${messageReceiver}</strong>: ${messageText}</span>
            </li>`;

        } else if (messageType === 'private_message') {
            messageTemplate = `
            <li class="single-message private-message">
                <span>(${messageTime})</span>
                <span><strong>${messageUser}</strong> reservadamente para <strong>${messageReceiver}</strong>: ${messageText}</span>
            </li>`;

        }

        document.querySelector('.messages-users').innerHTML += messageTemplate;
    }

}

singUser();