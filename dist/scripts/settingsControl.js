'use strict';

try {
    if (document.body.classList.contains('settings-body')) {
        (function () {
            var sendData = function sendData(data, url, isAsync, successCallback, errorCallback) {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', url, isAsync);
                xhr.send(data);
                xhr.onerror = errorCallback;
                xhr.onloadend = function () {
                    if (xhr.status === 200) {
                        successCallback();
                    } else {
                        errorCallback();
                    }
                };
            };

            var addButtonWaiter = function addButtonWaiter(element) {
                element.disabled = true;
                element.style.backgroundImage = 'url("../images/loading-light.svg")';
                element.style.backgroundPosition = '5px 50%';
                element.style.backgroundRepeat = 'no-repeat';
                element.style.backgroundSize = '35px 35px';
            };

            var removeButtonWaiter = function removeButtonWaiter(element) {
                element.disabled = undefined;
                element.style.backgroundImage = '';
                element.style.backgroundPosition = '';
                element.style.backgroundRepeat = '';
                element.style.backgroundSize = '';
            };

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
                            notify(true, 'Инструкция по смене данных отправлена на вашу почту.', 'success');
                        }.bind(this);
                        var errorCallback = function () {
                            removeButtonWaiter(this);
                            notify(true, 'При смене данных возникла ошибка. Попробуйте еще раз.', 'failure');
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
        })();
    }
} catch (error) {
    notify(true, '\u0427\u0442\u043E-\u0442\u043E \u043F\u043E\u0448\u043B\u043E \u043D\u0435 \u0442\u0430\u043A: ' + error.message, 'failure');
}

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

/**
 * Выводит уведомление, позиционированное сверху экрана и фиксированное при необходимости, в указанный элемент
 * @param {Boolean} isFixed
 * @param {String} message
 * @param {String} type
 * @param {HTMLElement} element
 */
function notify(isFixed, message, type) {
    var element = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : document.body;

    if (type !== 'success' && type !== 'failure' && type !== 'warning') {
        throw new TypeError('Неверное имя типа. Принимаются только "success", "warning" или "failure"');
    }
    var messageWindow = document.createElement('div');
    messageWindow.title = 'Скрыть';
    messageWindow.style.cursor = 'pointer';
    messageWindow.style.position = 'fixed';
    if (!isFixed) {
        messageWindow.style.position = 'absolute';
    }
    messageWindow.style.left = '0';
    messageWindow.style.right = '0';
    messageWindow.style.top = '0';
    messageWindow.style.padding = '10px';
    messageWindow.style.textAlign = 'center';
    messageWindow.style.border = '2px solid';
    messageWindow.style.zIndex = '20';
    messageWindow.style.backgroundColor = bgColors[type];
    messageWindow.style.color = colors[type];
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