let bgColors = {
    success: '#dff2bf',
    failure: '#ffbaba',
    warning: '#bde5f8',
    confirm: '#ffae7e'
    // warning: '#feefb3'
};
let colors = {
    success: '#4f8a10',
    failure: '#d6010e',
    warning: '#00529b',
    confirm: '#4a2359'
    // warning: '#9f6000'
};
let types = {
    warning: 'warning',
    success: 'success',
    failure: 'failure',
    confirm: 'confirm'
};

function notify(isFixed, message, type, cb, element = document.body) {
    if (!types[type]) {
        throw new TypeError(`Неверное имя типа Уведомления. Принято ${type}`);
    }
    let messageWindow = document.createElement('div');
    messageWindow.classList.add('message-window');
    let messageText = document.createElement('p');
    messageText.innerHTML = message;
    messageText.classList.add('message-text');
    let okButton = document.createElement('button');
    okButton.innerHTML = 'Ок';
    okButton.classList.add(`button_${type}-theme`, 'message-button');
    let overlay = document.createElement('div');
    overlay.classList.add('message-overlay');

    let notifyStyles = {
        position: isFixed ? 'fixed' : 'absolute',
        backgroundColor: bgColors[type],
        color: colors[type],
    };

    overlay.addEventListener('click', removeMessage);
    okButton.addEventListener('click', removeMessage);

    messageWindow.appendChild(messageText);
    messageWindow.appendChild(okButton);
    if (type === 'confirm') {
        let cancelButton = document.createElement('button');
        cancelButton.classList.add('message-button', 'button_neg-confirm-theme');
        cancelButton.innerHTML = 'Отмена';
        messageWindow.appendChild(cancelButton);

        overlay.removeEventListener('click', removeMessage);
        okButton.removeEventListener('click', removeMessage);
        cancelButton.addEventListener('click', removeMessage);
        okButton.addEventListener('click', function (event) {
            event.preventDefault();
            removeMessage();
            cb();
        })
    }

    Object.assign(messageWindow.style, notifyStyles);

    element.insertBefore(messageWindow, element.firstElementChild);
    element.insertBefore(overlay, messageWindow);

    function removeMessage(event) {
        event.preventDefault();
        element.removeChild(messageWindow);
        element.removeChild(overlay);
    }
}
