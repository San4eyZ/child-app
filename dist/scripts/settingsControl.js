'use strict';

var openButtons = document.querySelectorAll('.main-settings__section-opener');
var changeButtons = document.querySelectorAll('.main-settings__change-button');

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
    for (var _iterator = openButtons[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var button = _step.value;

        button.addEventListener('click', function (event) {
            event.preventDefault();
            var section = this.nextElementSibling;
            if (!section.style.maxHeight) {
                section.style.maxHeight = '500px';
            } else {
                section.style.maxHeight = '';
            }
        });
    }
} catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
} finally {
    try {
        if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
        }
    } finally {
        if (_didIteratorError) {
            throw _iteratorError;
        }
    }
}

var _iteratorNormalCompletion2 = true;
var _didIteratorError2 = false;
var _iteratorError2 = undefined;

try {
    for (var _iterator2 = changeButtons[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _button = _step2.value;

        _button.addEventListener('click', function (event) {
            event.preventDefault();
            addButtonWaiter(this);
            var endCallback = function () {
                removeButtonWaiter(this);
                notify(this.parentElement, 'Инструкция по смене данных отправлена на вашу почту.', 'success');
            }.bind(this);
            var errorCallback = function () {
                removeButtonWaiter(this);
                notify(this.parentElement, 'При смене данных возникла ошибка. Попробуйте еще раз.', 'failure');
            }.bind(this);

            sendData('test', 'https://www.example.com', true, endCallback, errorCallback);
        });
    }
} catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
} finally {
    try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
        }
    } finally {
        if (_didIteratorError2) {
            throw _iteratorError2;
        }
    }
}

function sendData(data, url, isAsync, endCallback, errorCallback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, isAsync);
    xhr.send(data);
    xhr.onerror = errorCallback;
    xhr.onloadend = function () {
        if (xhr.status === 404) {
            errorCallback();
        }
        if (xhr.status === 200) {
            endCallback();
        }
    };
}

function addButtonWaiter(element) {
    element.disabled = true;
    element.style.backgroundImage = 'url("../images/loading-light.svg")';
    element.style.backgroundPosition = '5px 50%';
    element.style.backgroundRepeat = 'no-repeat';
    element.style.backgroundSize = '35px 35px';
}

function removeButtonWaiter(element) {
    element.disabled = undefined;
    element.style.backgroundImage = '';
    element.style.backgroundPosition = '';
    element.style.backgroundRepeat = '';
    element.style.backgroundSize = '';
}

function notify(element, message, type) {
    if (type !== 'success' && type !== 'failure' && type !== 'warning') {
        throw new TypeError();
    }
    var messageWindow = document.createElement('div');
    messageWindow.title = 'Скрыть';
    messageWindow.style.cursor = 'pointer';
    messageWindow.style.position = 'fixed';
    messageWindow.style.left = '0';
    messageWindow.style.right = '0';
    messageWindow.style.top = '0';
    messageWindow.style.padding = '10px';
    messageWindow.style.textAlign = 'center';
    messageWindow.style.border = '2px solid';
    messageWindow.style.backgroundColor = type === 'success' ? '#6eff95' : type === 'failure' ? '#ff0000' : '#fcff5a';
    messageWindow.style.color = type === 'success' ? '#00a919' : type === 'failure' ? '#850000' : '#de8004';
    messageWindow.innerHTML = message;
    var delayedRemoval = setTimeout(function () {
        element.removeChild(messageWindow);
    }, 5000);
    messageWindow.addEventListener('click', function (event) {
        event.preventDefault();
        element.removeChild(messageWindow);
        clearTimeout(delayedRemoval);
    });
    element.insertBefore(messageWindow, element.firstElementChild);
}
//# sourceMappingURL=settingsControl.js.map