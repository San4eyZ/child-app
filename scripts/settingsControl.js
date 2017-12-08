try {
    if (document.body.classList.contains('settings-body')) {
        let openButtons = document.querySelectorAll('.main-settings__section-opener');
        let changeButtons = document.querySelectorAll('.main-settings__change-button');

        for (let button of openButtons) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                let section = this.nextElementSibling;
                if (!section.style.maxHeight) {
                    section.style.maxHeight = '500px';
                } else {
                    section.style.maxHeight = '';
                }
            })
        }

        for (let button of changeButtons) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
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
            })
        }

        function sendData(data, url, isAsync, endCallback, errorCallback) {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', url, isAsync);
            xhr.send(data);
            xhr.onerror = errorCallback;
            xhr.onloadend = function () {
                if (xhr.status === 200) {
                    endCallback();
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
    if (document.body.classList.contains('groups-body')) {

    }
} catch (error) {
    notify(true, `Что-то пошло не так: ${error.message}`, 'failure');
}

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
    messageWindow.style.backgroundColor = type === 'success' ? '#6eff95' : type === 'failure' ? '#ff0000' : '#fcff5a';
    messageWindow.style.color = type === 'success' ? '#00a919' : type === 'failure' ? '#850000' : '#de8004';
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
