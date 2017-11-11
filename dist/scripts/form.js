'use strict';

var linkToReg = document.querySelector('.login-form__to-reg');
var linkToLogin = document.querySelector('.reg-form__to-login');
var linkToReset = document.querySelector('.login-form__forgotten-pass');
var overlay = document.querySelector('.overlay');
var regWindow = document.querySelector('.reg-window');
var loginWindow = document.querySelector('.login-window');
var resetWindow = document.querySelector('.reset-window');

var windowCloseButtons = document.querySelectorAll('.window-close-button');
var onlyForUsers = document.querySelectorAll('.for-registered');

var showWindow = function showWindow(element, isFromPage, event) {
    event.preventDefault();
    if (isFromPage) {
        element.classList.add('show-window');
        overlay.classList.add('show-overlay');
    } else {
        loginWindow.classList.remove('show-window');
        regWindow.classList.remove('show-window');
        element.classList.add('show-window');
    }
};

var hideWindow = function hideWindow(element, event) {
    event.preventDefault();
    element.classList.add('hide');
    overlay.classList.add('hide');
    setTimeout(function () {
        overlay.classList.remove('hide');
        overlay.classList.remove('show-overlay');
        element.classList.remove('hide');
        element.classList.remove('show-window');
    }, 1000);
};

if (document.body.className === 'index-body') {
    var loginButton = document.querySelector('.main__login');
    var regButton = document.querySelector('.main__reg');
    loginButton.addEventListener('click', showWindow.bind(null, loginWindow, true));
    regButton.addEventListener('click', showWindow.bind(null, regWindow, true));
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
//# sourceMappingURL=form.js.map