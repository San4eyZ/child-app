try {
    if (document.body.classList.contains('settings-body')) {
        let openButtons = document.querySelectorAll('.main-settings__section-opener');
        let changeButtons = document.querySelectorAll('.main-settings__change-button');

        for (let button of openButtons) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                let section = this.nextElementSibling;
                // Вычисление высоты для раскрывающегося списка

                if (!section.style.maxHeight) {
                    section.style.maxHeight = String(calculateHeight(section)) + 'px';
                } else {
                    section.style.maxHeight = '';
                }
            })
        }

        for (let button of changeButtons) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                let inputs = [...this.parentElement.children].slice(0, this.parentElement.children.length - 1);
                if (inputs.every(inp => inp.value)) {
                    addButtonWaiter(this);
                    let endCallback = function () {
                        removeButtonWaiter(this);
                        notify(true, 'Инструкция по смене данных отправлена на вашу почту.', 'success');
                    }.bind(this);
                    let errorCallback = function () {
                        removeButtonWaiter(this);
                        notify(true, 'При смене данных возникла ошибка. Попробуйте еще раз.', 'failure');
                    }.bind(this);

                    sendData('test', 'https://www.example.com', true, endCallback, errorCallback);
                } else {
                    notify(true, 'Пожалуйста, заполните все поля', 'warning');
                }
            })
        }

        function sendData(data, url, isAsync, successCallback, errorCallback) {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', url, isAsync);
            xhr.send(data);
            xhr.onerror = errorCallback;
            xhr.onloadend = function () {
                if (xhr.status === 200) {
                    successCallback();
                } else {
                    errorCallback();
                }
            }
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
    }
} catch (error) {
    notify(true, `Что-то пошло не так: ${error.message}`, 'failure');
}

let bgColors = {
    success: '#6eff95',
    failure: '#ff0000',
    warning: '#fcff5a'
};
let colors = {
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
function notify(isFixed, message, type, element = document.body) {
    if (type !== 'success' && type !== 'failure' && type !== 'warning') {
        throw new TypeError('Неверное имя типа. Принимаются только "success", "warning" или "failure"');
    }
    let messageWindow = document.createElement('div');
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
    let delayedRemoval = setTimeout(function () {
        element.removeChild(messageWindow);
    }, 5000);
    messageWindow.addEventListener('click', function (event) {
        event.preventDefault();
        element.removeChild(messageWindow);
        clearTimeout(delayedRemoval);
    });
    element.insertBefore(messageWindow, element.firstElementChild);
}

function calculateHeight(element) {
    return[...element.children].reduce((init, cur) => {
        let computedStyle = window.getComputedStyle(cur);
        return init + parseInt(computedStyle.height) +
            parseInt(computedStyle.marginTop) +
            parseInt(computedStyle.marginBottom) +
            parseInt(computedStyle.borderTopWidth) +
            parseInt(computedStyle.borderBottomWidth) +
            parseInt(computedStyle.paddingBottom) +
            parseInt(computedStyle.paddingTop);
    }, 0);
}