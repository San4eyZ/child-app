'use strict';

var bgColors = {
    success: '#dff2bf',
    failure: '#ffbaba',
    warning: '#bde5f8',
    confirm: '#ffae7e'
    // warning: '#feefb3'
};
var colors = {
    success: '#4f8a10',
    failure: '#d6010e',
    warning: '#00529b',
    confirm: '#4a2359'
    // warning: '#9f6000'
};
var types = {
    warning: 'warning',
    success: 'success',
    failure: 'failure',
    confirm: 'confirm'
};

function notify(isFixed, message, type, cb) {
    var element = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : document.body;

    if (!types[type]) {
        throw new TypeError('\u041D\u0435\u0432\u0435\u0440\u043D\u043E\u0435 \u0438\u043C\u044F \u0442\u0438\u043F\u0430 \u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F. \u041F\u0440\u0438\u043D\u044F\u0442\u043E ' + type);
    }
    if (type === 'confirm' && typeof cb !== 'function') {
        throw new Error('Не задана функция обратного вызова для confirm');
    }
    var messageWindow = document.createElement('div');
    messageWindow.classList.add('message-window');
    var messageText = document.createElement('p');
    messageText.innerHTML = message;
    messageText.classList.add('message-text');
    var okButton = document.createElement('button');
    okButton.innerHTML = 'Ок';
    okButton.classList.add('button_' + type + '-theme', 'message-button');
    var overlay = document.createElement('div');
    overlay.classList.add('message-overlay');

    var notifyStyles = {
        position: isFixed ? 'fixed' : 'absolute',
        backgroundColor: bgColors[type],
        color: colors[type]
    };

    overlay.addEventListener('click', removeMessage);
    okButton.addEventListener('click', removeMessage);

    messageWindow.appendChild(messageText);
    messageWindow.appendChild(okButton);
    if (type === 'confirm') {
        var cancelButton = document.createElement('button');
        cancelButton.classList.add('message-button', 'button_neg-confirm-theme');
        cancelButton.innerHTML = 'Отмена';
        messageWindow.appendChild(cancelButton);

        okButton.removeEventListener('click', removeMessage);
        cancelButton.addEventListener('click', removeMessage);
        okButton.addEventListener('click', function (event) {
            event.preventDefault();
            removeMessage(event);
            cb();
        });
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
//# sourceMappingURL=notify.js.map