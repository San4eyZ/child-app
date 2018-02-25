'use strict';

var bgColors = {
    success: '#6eff95',
    failure: '#ff0000',
    warning: '#fcff5a'
};
var colors = {
    success: '#00a919',
    failure: '#850000',
    warning: '#de8004'
};
var currentZindex = 20;

function notify(isFixed, message, type) {
    var element = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : document.body;
    var styles = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

    if (type !== 'success' && type !== 'failure' && type !== 'warning') {
        throw new TypeError('Неверное имя типа. Принимаются только "success", "warning" или "failure"');
    }
    var messageWindow = document.createElement('div');
    messageWindow.title = 'Скрыть';
    messageWindow.innerHTML = message;

    var notifyStyles = {
        left: '50%',
        top: '20%',
        transform: 'translate(-50%, -20%)',
        padding: '50px',
        textAlign: 'center',
        fontSize: '1.5rem',
        border: '2px solid #4a254a',
        zIndex: String(currentZindex),
        backgroundColor: bgColors[type],
        color: colors[type],
        borderRadius: '10px',
        cursor: 'pointer',
        position: isFixed ? 'fixed' : 'absolute'
    };
    currentZindex++;

    Object.assign(messageWindow.style, notifyStyles);
    Object.assign(messageWindow.style, styles);

    var delayedRemoval = setTimeout(function () {
        element.removeChild(messageWindow);
    }, 5000);

    messageWindow.addEventListener('click', function () {
        element.removeChild(messageWindow);
        clearTimeout(delayedRemoval);
    });

    element.insertBefore(messageWindow, element.firstElementChild);
}
//# sourceMappingURL=notify.js.map