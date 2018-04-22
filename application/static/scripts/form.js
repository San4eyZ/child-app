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


let regForm = regWindow.querySelector('.reg-form');
let regInputs = regForm.querySelectorAll('input');
let regFormBtn = regForm.querySelector('.reg-form__button');

regFormBtn.addEventListener('click', function (event) {
    let values = [...regInputs].map(({ value }) => value);

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

    if (!values.every(value => value)) {
        event.preventDefault();
        notify(true, 'Пожалуйста, заполните все поля.', 'warning');
    }
});

let loginForm = loginWindow.querySelector('.login-form');
let loginInputs = [...loginForm.querySelectorAll('input')].slice(0, 2);
let loginFormBtn = loginWindow.querySelector('.login-form__button');

loginFormBtn.addEventListener('click', function () {
    let values = loginInputs.map(({ value }) => value);

    if (values[0] && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,5})+$/.test(values[0])) {
        event.preventDefault();
        notify(true, 'Введен некорректный email.', 'warning');

        return;
    }

    if (values[1] && !/^[.\-_@a-zA-Z0-9]{6,20}$/.test(values[1])) {
        event.preventDefault();
        notify(true, 'Введите подходящий пароль. Пароль может содержать латинские буквы, цифры, @, -, _' +
            ' и должен быть не менее 6 символов в длину и не более 20', 'warning');

        return;
    }

    if (!values.every(value => value)) {
        event.preventDefault();
        notify(true, 'Пожалуйста, заполните все поля.', 'warning');
    }
});

let resetForm = resetWindow.querySelector('.reset-form');
let emailForReset = resetForm.querySelector('input');
let resetFormBtn = resetForm.querySelector('.reset-form__button');

resetFormBtn.addEventListener('click', function (event) {
    let value = emailForReset.value;

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
    }, 1000)
}
