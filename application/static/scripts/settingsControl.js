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

            let values = inputs.map(({value}) => value);

            if (values[1] && values[2] && values[1] !== values[2]) {
                notify(true, 'Введенные пароли не совпадают.', 'warning');

                return;
            }

            if (inputs[0] && inputs[0].type === 'email' && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,5})+$/.test(inputs[0].value)) {
                notify(true, 'Введен некорректный email.', 'warning');

                return;
            }

            if (values.every(value => value)) {
                addButtonWaiter(this);
                let endCallback = function (xhr) {
                    removeButtonWaiter(this);
                    notify(true, 'Инструкция по смене данных отправлена на вашу почту.', 'success');
                }.bind(this);
                let errorCallback = function (xhr) {
                    removeButtonWaiter(this);
                    notify(true, `При смене данных возникла ошибка: (${xhr.status}). Попробуйте еще раз.`, 'failure');
                }.bind(this);

                let data = inputs[0].type === 'email' ? {
                    newEmail: values[0],
                    password: values[1],
                    confirm: values[2]
                } : {
                    newPassword: values[0],
                    password: values[1],
                    confirm: values[2]
                };

                let link =  window.location.origin + (inputs[0].type === 'email' ? '/changeEmail' : '/changePass');
                sendData(JSON.stringify(data), link, true, endCallback, errorCallback);
            } else {
                notify(true, 'Пожалуйста, заполните все поля.', 'warning');
            }
        })
    }

    function sendData(data, url, isAsync, successCallback, errorCallback) {
        let xhr = new XMLHttpRequest();
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
    }

    function addButtonWaiter(element) {
        element.disabled = true;
        element.classList.add('btn-loading_dark');
    }

    function removeButtonWaiter(element) {
        element.disabled = undefined;
        element.classList.remove('btn-loading_dark');
    }
}

function calculateHeight(element) {
    return [...element.children].reduce((init, cur) => {
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
