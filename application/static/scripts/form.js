let linkToReg = document.querySelector('.login-form__to-reg');
let linkToLogin = document.querySelector('.reg-form__to-login');
let linkToReset = document.querySelector('.login-form__forgotten-pass');
let overlay = document.querySelector('.overlay');
let regWindow = document.querySelector('.reg-window');
let loginWindow = document.querySelector('.login-window');
let resetWindow = document.querySelector('.reset-window');

let windowCloseButtons = document.querySelectorAll('.window-close-button');
let onlyForUsers = document.querySelectorAll('.for-registered');

if (document.body.classList.contains('index-body')) {
    let loginButton = document.querySelector('.main__login');
    let regButton = document.querySelector('.main__reg');
    loginButton.addEventListener('click', showWindow.bind(null, loginWindow, true));
    regButton.addEventListener('click', showWindow.bind(null, regWindow, true));
}

let gameWindowLogin = document.querySelector('.main-navigation__game-login');
if (gameWindowLogin) {
    gameWindowLogin.addEventListener('click', showWindow.bind(null, loginWindow, true));
}

linkToReg.addEventListener('click', showWindow.bind(null, regWindow, false));
linkToLogin.addEventListener('click', showWindow.bind(null, loginWindow, false));
linkToReset.addEventListener('click', showWindow.bind(null, resetWindow, false));

for (let button of windowCloseButtons) {
    button.addEventListener('click', hideWindow.bind(null, button.parentElement))
}

for (let user of onlyForUsers) {
    user.addEventListener('click', showWindow.bind(null, regWindow, true));
    user.addEventListener('click', function (event) {
        event.preventDefault();
        alert('Доступно только для зарегистрированных пользователей')
    })
}

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
    }, 1000)
}