'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

if (document.body.classList.contains('settings-body')) {
    (function () {
        var sendData = function sendData(data, url, isAsync, successCallback, errorCallback) {
            var xhr = new XMLHttpRequest();
            console.log(url);
            xhr.open('POST', url, isAsync);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onerror = errorCallback.bind(null, xhr);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    successCallback(xhr);
                } else {
                    errorCallback(xhr);
                }
            };
            xhr.send(data);
        };

        var addButtonWaiter = function addButtonWaiter(element) {
            element.disabled = true;
            element.classList.add('btn-loading_dark');
        };

        var removeButtonWaiter = function removeButtonWaiter(element) {
            element.disabled = undefined;
            element.classList.remove('btn-loading_dark');
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
                    // Вычисление высоты для раскрывающегося списка

                    if (!section.style.maxHeight) {
                        section.style.maxHeight = String(calculateHeight(section)) + 'px';
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
                    var inputs = [].concat(_toConsumableArray(this.parentElement.children)).slice(0, this.parentElement.children.length - 1);

                    var values = inputs.map(function (_ref) {
                        var value = _ref.value;
                        return value;
                    });

                    if (values[1] && values[2] && values[1] !== values[2]) {
                        notify(true, 'Введенные пароли не совпадают.', 'warning');

                        return;
                    }

                    if (inputs[0] && inputs[0].type === 'email' && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,5})+$/.test(inputs[0].value)) {
                        notify(true, 'Введен некорректный email.', 'warning');

                        return;
                    }

                    if (values.every(function (value) {
                        return value;
                    })) {
                        addButtonWaiter(this);
                        var endCallback = function (xhr) {
                            removeButtonWaiter(this);
                            notify(true, 'Инструкция по смене данных отправлена на вашу почту.', 'success');
                        }.bind(this);
                        var errorCallback = function (xhr) {
                            removeButtonWaiter(this);
                            notify(true, '\u041F\u0440\u0438 \u0441\u043C\u0435\u043D\u0435 \u0434\u0430\u043D\u043D\u044B\u0445 \u0432\u043E\u0437\u043D\u0438\u043A\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430: (' + xhr.status + '). \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0435 \u0440\u0430\u0437.', 'failure');
                        }.bind(this);

                        var data = inputs[0].type === 'email' ? {
                            newEmail: values[0],
                            password: values[1],
                            confirm: values[2]
                        } : {
                            newPassword: values[0],
                            password: values[1],
                            confirm: values[2]
                        };

                        var link = window.location.origin + (inputs[0].type === 'email' ? '/change-email' : '/change-pass');
                        sendData(JSON.stringify(data), link, true, endCallback, errorCallback);
                    } else {
                        notify(true, 'Пожалуйста, заполните все поля.', 'warning');
                    }
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

function calculateHeight(element) {
    return [].concat(_toConsumableArray(element.children)).reduce(function (init, cur) {
        var computedStyle = window.getComputedStyle(cur);
        return init + parseInt(computedStyle.height) + parseInt(computedStyle.marginTop) + parseInt(computedStyle.marginBottom) + parseInt(computedStyle.borderTopWidth) + parseInt(computedStyle.borderBottomWidth) + parseInt(computedStyle.paddingBottom) + parseInt(computedStyle.paddingTop);
    }, 0);
}
