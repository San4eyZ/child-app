'use strict';

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }return arr2;
    } else {
        return Array.from(arr);
    }
}

var linkToReg = document.querySelector('.login-form__to-reg');
var linkToLogin = document.querySelector('.reg-form__to-login');
var linkToReset = document.querySelector('.login-form__forgotten-pass');
var overlay = document.querySelector('.overlay');
var regWindow = document.querySelector('.reg-window');
var loginWindow = document.querySelector('.login-window');
var resetWindow = document.querySelector('.reset-window');

var windowCloseButtons = document.querySelectorAll('.window-close-button');
var onlyForUsers = document.querySelectorAll('.for-registered');

if (document.body.classList.contains('index-body')) {
    var loginButton = document.querySelector('.main__login');
    var regButton = document.querySelector('.main__reg');
    loginButton.addEventListener('click', showWindow.bind(null, loginWindow, true));
    regButton.addEventListener('click', showWindow.bind(null, regWindow, true));
}

var gameWindowLogin = document.querySelector('.main-navigation__game-login');
if (gameWindowLogin) {
    gameWindowLogin.addEventListener('click', showWindow.bind(null, loginWindow, true));
}

linkToReg.addEventListener('click', showWindow.bind(null, regWindow, false));
linkToLogin.addEventListener('click', showWindow.bind(null, loginWindow, false));
linkToReset.addEventListener('click', showWindow.bind(null, resetWindow, false));

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
    for (var _iterator = windowCloseButtons[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var button = _step.value;

        button.addEventListener('click', hideWindow.bind(null, button.parentElement));
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
    for (var _iterator2 = onlyForUsers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var user = _step2.value;

        user.addEventListener('click', showWindow.bind(null, regWindow, true));
        user.addEventListener('click', function (event) {
            event.preventDefault();
            alert('Доступно только для зарегистрированных пользователей');
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

var regForm = regWindow.querySelector('.reg-form');
var regInputs = regForm.querySelectorAll('input');
var regFormBtn = regForm.querySelector('.reg-form__button');

regFormBtn.addEventListener('click', function (event) {
    var values = [].concat(_toConsumableArray(regInputs)).map(function (_ref) {
        var value = _ref.value;
        return value;
    });

    if (values[1] && values[2] && values[1] !== values[2]) {
        event.preventDefault();
        notify(true, 'Введенные пароли не совпадают.', 'warning');

        return;
    }

    if (values[0] && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,5})+$/.test(values[0])) {
        event.preventDefault();
        notify(true, 'Введен некорректный email.', 'warning');

        return;
    }

    if (!values.every(function (value) {
        return value;
    })) {
        event.preventDefault();
        notify(true, 'Пожалуйста, заполните все поля.', 'warning');
    }
});

var loginForm = loginWindow.querySelector('.login-form');
var loginInputs = [].concat(_toConsumableArray(loginForm.querySelectorAll('input'))).slice(0, 2);
var loginFormBtn = loginWindow.querySelector('.login-form__button');

loginFormBtn.addEventListener('click', function () {
    var values = loginInputs.map(function (_ref2) {
        var value = _ref2.value;
        return value;
    });

    if (values[0] && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,5})+$/.test(values[0])) {
        event.preventDefault();
        notify(true, 'Введен некорректный email.', 'warning');

        return;
    }

    if (values[1] && !/^[.\-_@a-zA-Z0-9]{6,20}$/.test(values[1])) {
        event.preventDefault();
        notify(true, 'Введите подходящий пароль. Пароль может содержать латинские буквы, цифры, @, -, _' + ' и должен быть не менее 6 символов в длину и не более 20', 'warning');

        return;
    }

    if (!values.every(function (value) {
        return value;
    })) {
        event.preventDefault();
        notify(true, 'Пожалуйста, заполните все поля.', 'warning');
    }
});

var resetForm = resetWindow.querySelector('.reset-form');
var emailForReset = resetForm.querySelector('input');
var resetFormBtn = resetForm.querySelector('.reset-form__button');

resetFormBtn.addEventListener('click', function (event) {
    var value = emailForReset.value;

    if (value && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,5})+$/.test(value)) {
        event.preventDefault();
        notify(true, 'Введен некорректный email.', 'warning');

        return;
    }
    if (!value) {
        event.preventDefault();
        notify(true, 'Пожалуйста, введите email.', 'warning');
    }
});

function showWindow(element, isFromPage, event) {
    event.preventDefault();
    if (isFromPage) {
        element.classList.add('show-window');
        overlay.classList.add('show-overlay');
    } else {
        loginWindow.classList.remove('show-window');
        regWindow.classList.remove('show-window');
        element.classList.add('show-window');
    }
}

function hideWindow(element, event) {
    event.preventDefault();
    element.classList.add('hide');
    overlay.classList.add('hide');
    setTimeout(function () {
        overlay.classList.remove('hide');
        overlay.classList.remove('show-overlay');
        element.classList.remove('hide');
        element.classList.remove('show-window');
    }, 1000);
}
