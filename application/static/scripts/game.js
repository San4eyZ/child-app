/*  Создание игры  */
function CreateGame(interval, capacity, quantity, theme, collection, answer, homeworkId) {
    this.interval = Number(interval) * 1000;
    this.quantity = Number(quantity);
    this.capacity = Number(capacity);
    this.theme = theme;
    this.collection = collection || createCollection(capacity, quantity);
    this.index = 0;
    this.answer = answer || this.collection.reduce((n, sum) => n + sum, 0);
    this.homeworkId = homeworkId;
    this.createBoard();
    this.numberField = this.board.querySelector('.game__number');
}

CreateGame.prototype = {
    /* Меняет текущий индекс и накапливает сумму */
    changeNumber: function () {
        let number = this.collection[this.index];
        this.numberField.innerHTML = String(number);
        this.numberField.classList.remove('hide');
        this.index++;
        setTimeout((function () {
            this.numberField.classList.add('hide');
        }).bind(this), this.interval * 0.8)
    },
    /* Начинает игру */
    gameInit: function () {
        let that = this;
        let times = that.quantity;
        /* Устанавливаем время, до окончания демонстрации, чтобы завершить игру */
        that.endTimer = setTimeout(function () {
            that.gameEnd();
        }, (times + 1) * that.interval + 3000);
        /* Выполняем показ чисел */
        /* Трехсекундная задержка на подготовку */
        setTimeout(function () {
            function performInterval() {
                if (times > 0) {
                    times--;
                    that.changeNumber();
                } else {
                    clearInterval(that.timer);
                }
            }

            /* Задаем интервал появления чисел */
            that.timer = setInterval(performInterval, that.interval);
            /* Показываем кнопку restart */
            that.restartButton.classList.remove('d-none');
        }, 3000);
        /* Делаем затемнение стартового сообщения */
        setTimeout(function () {
            hideElement(that.numberField, 200);
        }, 2800 + that.interval)
    },
    /* Завершение игры */
    gameEnd: function () {
        let that = this;
        that.numberField.classList.add('hide');
        setTimeout(function () {
            that.createAnswerInput();
        }, this.interval * 0.2);
    },
    /* Записываем результат в переданное место */
    sendResult: function (where, result) {
        let xhr = new XMLHttpRequest();
        let body = {
            result,
            interval: this.interval,
            quantity: this.quantity,
            capacity: this.capacity,
            theme: this.theme
        };
        if (this.homeworkId) {
            body.homeworkId = this.homeworkId;
        }

        xhr.open("POST", where, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function () {
            if (xhr.status !== 201 && xhr.status !== 200) {
                notify(true, 'Произошла ошибка при отправке результата', 'failure');
            }
        };
        xhr.onerror = function () {
            notify(true, 'Произошла ошибка при отправке результата', 'failure');
        };

        xhr.send(JSON.stringify(body));
    },
    /* Создаем поле для игры */
    createBoard: function () {
        let board = document.createElement('div');
        let heading = document.createElement('h2');
        let closeButton = document.createElement('button');
        let restartButton = document.createElement('button');
        let numberHolder = document.createElement('div');
        board.className = 'game-board';
        heading.innerHTML = 'Numbers!';
        heading.className = 'game__heading';
        restartButton.className = 'game__button game__restart-button d-none';
        restartButton.innerHTML = 'Заново';
        closeButton.className = 'game__button game__close-button';
        closeButton.innerHTML = 'Закончить';
        numberHolder.className = 'game__number';
        numberHolder.innerHTML = 'Вперед!';
        if (this.interval) {
            numberHolder.style.transitionDuration = `${this.interval * 0.2}`;
        }

        /*прикрепляем кнопки к игре*/
        this.restartButton = restartButton;
        this.closeButton = closeButton;

        /*И вешаем на них обработчики*/
        closeButton.addEventListener('click', event => {
            event.preventDefault();

            /* Показываем настрйки и убираем текущую игру */
            board.previousElementSibling.classList.remove('hide');
            board.parentElement.style.maxHeight = '';
            board.parentElement.removeChild(board);
            clearTimeout(this.endTimer);
            if (this.animAlien && this.animShadow) {
                this.animAlien.classList.remove('animation_fast');
                this.animShadow.classList.remove('animation_fast');
            }
        });

        restartButton.addEventListener('click', event => {
            event.preventDefault();

            clearInterval(this.timer);
            clearTimeout(this.endTimer);
            /* Прячем кнопку restart, чтобы ничего не сломали, пока не пройдут анимации */
            restartButton.classList.add('d-none');

            /* Прячем доску */
            board.classList.add('hide');
            setTimeout(() => {
                /* Если поле для чисел было скрыто, показываем его */
                this.numberField.classList.remove('hide');
                /* Убираем форму ответа, если дошли до конца и она создалась */
                if (this.answerForm) {
                    this.board.removeChild(this.answerForm);
                    this.answerForm = undefined;
                }
                /* обновляем состояние игры */
                this.index = 0;
                this.numberField.innerHTML = 'Вперед!';
                /* Показываем доску */
                board.classList.remove('hide');
                /* Начинаем сначала */
                this.gameInit();
            }, 1000)
        });

        board.appendChild(heading);
        board.appendChild(numberHolder);
        board.appendChild(restartButton);
        board.appendChild(closeButton);

        this.board = board;
    },

    createAnswerInput: function () {
        let answerForm = document.createElement('div');
        let answerField = document.createElement('input');
        let submitAnswer = document.createElement('button');
        answerForm.className = 'game__answer-form';
        answerField.className = 'game__answer-field input_light-theme';
        submitAnswer.className = 'game__answer-submit button_dark-theme';

        submitAnswer.innerHTML = 'Проверить';
        answerField.placeholder = 'Введите сумму чисел';
        answerForm.appendChild(answerField);
        answerForm.appendChild(submitAnswer);

        answerField.addEventListener('keypress', restrictKeys);
        submitAnswer.addEventListener('click', (function (event) {
            event.preventDefault();
            if (answerField.value === '') {
                answerField.placeholder = 'Введите ответ';
                answerField.style.backgroundColor = '#ffe814';
                return false;
            }
            if (Number(answerField.value) === this.answer) {
                answerField.style.backgroundColor = '#1fc113';
                answerField.value = 'Правильно!';
                this.sendResult(window.location.origin + (this.homeworkId ? '/homework-result' : '/game-result'), 'success')
            } else {
                answerField.style.backgroundColor = '#ff2b0a';
                answerField.value = 'Ошибка, попробуйте снова';
                this.sendResult(window.location.origin + (this.homeworkId ? '/homework-result' : '/game-result'), 'failure')
            }
            answerField.disabled = true;
            submitAnswer.disabled = true;
        }).bind(this));

        this.board.appendChild(answerForm);
        this.answerForm = answerForm;
    }
};

if (document.body.classList.contains('game-body')) {
    CreateGame.prototype.animAlien = document.querySelector('.settings__animated-image');
    CreateGame.prototype.animShadow = document.querySelector('.shadow');

    let startGame = document.querySelector('.settings__start-game');
    let settings = document.querySelector('.settings__main-window');
    let gameInterface = document.querySelector('.game-interface');
    let playground = document.querySelector('.playground');

    let incButtons = document.querySelectorAll('.button_inc');
    let decButtons = document.querySelectorAll('.button_dec');
    let fields = document.querySelectorAll('.settings__input');
    let themeCheckers = [...gameInterface.querySelectorAll('.settings__theme-option')];

    themeCheckers.forEach(checker => checker.addEventListener('change', function (event) {
        let neighbourCheckers = [...this.parentElement.getElementsByTagName('input')];
        let prevCheckers = neighbourCheckers.slice(0, neighbourCheckers.indexOf(this));

        prevCheckers.forEach(checker => {
            checker.checked = this.checked;
        })
    }));

    /*   Начало игры   */
    startGame.addEventListener('click', function (event) {
        event.preventDefault();

        let themeOptions = [...gameInterface.querySelectorAll('.settings__theme-option:checked')].map(({value}) => value.split('_'));
        let speed = gameInterface.querySelector('.settings__speed-value').value.split(' ')[0];
        let capacity = gameInterface.querySelector('.settings__capacity-value').value;
        let quantity = gameInterface.querySelector('.settings__quantity-value').value;
        if (!themeOptions.length) {
            notify(true, 'Пожалуйста, выберите темы', 'warning');

            return;
        }

        this.classList.add('btn-loading_light');
        this.disabled = true;

        let xhr = new XMLHttpRequest();
        xhr.open('POST', window.location.origin + '/generator', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            this.classList.remove('btn-loading_light');

            if (xhr.status === 200) {
                setTimeout(function () {
                    this.disabled = false;
                }.bind(this), 1000);
                let game = new CreateGame(speed, capacity, quantity, themeOptions, JSON.parse(xhr.responseText));
                /* Как только начнется демонстрация, показываем кнопку restart */
                setTimeout(function () {
                    game.restartButton.classList.remove('d-none');
                }, 3000);

                /* Убираем окно настроек */
                settings.classList.add('hide');

                /* Таймаут для того, чтобы прошла анимация скрывания настроек */
                setTimeout(function () {
                    gameInterface.style.maxHeight = '100vh';
                    /* Показываем доску */
                    gameInterface.appendChild(game.board);
                    /* Ускоряем пришельца */
                    if (game.animAlien && game.animShadow) {
                        game.animAlien.classList.add('animation_fast');
                        game.animShadow.classList.add('animation_fast');
                    }
                }, 1000);
                /* Начинаем показ */
                game.gameInit();
            } else {
                this.disabled = false;
                notify(true, `Что-то пошло не так: (Код ошибки - ${xhr.status})`, 'failure');
            }
        }.bind(this);

        xhr.onerror = function () {
            this.disabled = false;
            this.classList.remove('btn-loading_light');
            notify(true, `Что-то пошло не так: (Код ошибки - ${xhr.status})`, 'failure');
        }.bind(this);

        xhr.send(JSON.stringify({speed, capacity, quantity, themeOptions}));
    });

    /* Вешаем обработчики */
    for (let incButton of incButtons) {
        incButton.addEventListener('click', inputControl.bind(null, incButton, 'inc'));
    }

    for (let decButton of decButtons) {
        decButton.addEventListener('click', inputControl.bind(null, decButton, 'dec'));
    }

    let initialValue;
    for (let field of fields) {
        field.addEventListener('keypress', restrictKeys);
        field.addEventListener('focus', function () {
            initialValue = this.value;
            this.value = '';
        });
        field.addEventListener('blur', function () {
            if (this.value === '') {
                this.value = initialValue;

                return;
            }
            if (Number(this.value) < Number(this.min)) {
                this.value = this.min;
            }
            if (Number(this.value) > Number(this.max)) {
                this.value = this.max;
            }
            if (this.classList.contains('settings__speed-value')) {
                this.value = isNaN(Number(this.value)) ? this.min + ' сек' : (Math.round(Number(this.value) * 10) / 10) + ' сек';
            }
        });
    }
}

/* Создает набор из случайных чисел заданного разряда */
function createCollection(capacity, quantity) {
    let collection = [];
    while (quantity > 0) {
        collection.push(Math.floor(Math.random() * Math.pow(10, capacity)));
        quantity--;
    }

    return collection;
}

/* Скрываем обьект на заданное время */
function hideElement(obj, time) {
    if (obj && obj.nodeName) {
        obj.classList.add('hide');
        setTimeout(function () {
            obj.classList.remove('hide');
        }, time)
    }
}

/*   Запрет на ввод символов не являющихся цифрами   */
function restrictKeys(event) {
    if (event.key === '.' && this.classList.contains('settings__speed-value')) {
        return true;
    }
    if (!(event.which >= 48 && event.which <= 57)) {
        event.preventDefault();
    }
}

/* Увеличиваем значение на заданную величину */
function incValue(value, amount) {
    return `${Math.round((Number(value) + Number(amount)) * 10) / 10}`;
}

/*   Контроль полей ввода   */
function inputControl(button, role, event) {
    event.preventDefault();
    let controlledInput = role === 'inc' ? button.previousElementSibling : button.nextElementSibling;
    let step = role === 'inc' ? controlledInput.step : -controlledInput.step;
    let [number, rest] = controlledInput.value.split(' ');
    let newNumber = incValue(number, step);
    if (Number(newNumber) <= Number(controlledInput.max) && Number(newNumber) >= Number(controlledInput.min)) {
        controlledInput.value = rest ? newNumber + ` ${rest}` : newNumber;
    }
}

if (document.body.classList.contains('homework-body')) {
    let placeholder = document.querySelector('.loading-placeholder');
    let homeworkElement = document.querySelector('.homework');

    let xhr = new XMLHttpRequest();
    xhr.open('GET', `${window.location.origin}/homework`, true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.status === 200) {
            placeholder.parentElement.removeChild(placeholder);

            let homeworks = JSON.parse(xhr.responseText);
            let paginator = makePaginator(homeworks);
            homeworkElement.parentNode.appendChild(paginator);
            addHomeworkList(homeworks.slice(0, 4), homeworkElement);
            // Устанавливаем высоту, чтобы не скакала при переключении страниц
            let headerHeight = parseInt(getComputedStyle(homeworkElement.firstElementChild).height);
            let headerMargin = parseInt(getComputedStyle(homeworkElement.firstElementChild).marginBottom);
            let tasksHeight = parseInt(getComputedStyle(homeworkElement.children[1]).height) * 4;
            let tasksMargin = parseInt(getComputedStyle(homeworkElement.children[1]).marginBottom) * 4;
            homeworkElement.style.height = (headerHeight + tasksHeight + headerMargin + tasksMargin) + 'px';
            // Добавляем изменение размеров на ресайз окна
            window.addEventListener('resize', function () {
                let headerHeight = parseInt(getComputedStyle(homeworkElement.firstElementChild).height);
                let headerMargin = parseInt(getComputedStyle(homeworkElement.firstElementChild).marginBottom);
                let tasksHeight = parseInt(getComputedStyle(homeworkElement.children[1]).height) * 4;
                let tasksMargin = parseInt(getComputedStyle(homeworkElement.children[1]).marginBottom) * 4;

                homeworkElement.style.height = (headerHeight + tasksHeight + headerMargin + tasksMargin) + 'px';
            })
        } else if (xhr.status === 404) {
            let message = document.createElement('div');
            message.innerHTML = 'У вас нет невыполненного домашнего задания';
            message.style.textAlign = 'center';
            message.style.fontSize = '1.5em';
            message.style.color = '#43c40f';
            homeworkElement.replaceChild(message, placeholder);
        } else {
            notify(true, `Ошибка получения информации о группах (Код ошибки - ${xhr.status})`, 'failure');
        }
    };
    xhr.onerror = function () {
        notify(true, `Ошибка получения информации о группах (Код ошибки - ${xhr.status})`, 'failure');
    };
    xhr.send();

    function addHomeworkList(tasks, element) {
        let taskElements = tasks.map(createHomeworkTask);
        taskElements.forEach(task => element.appendChild(task));
    }

    function makePaginator(homeworks) {
        let limit = 4;
        let paginator = document.createElement('div');
        paginator.classList.add('paginator');
        let pageCount = Math.ceil(homeworks.length / 4);
        for (let i = 0; i < pageCount; i++) {
            let offset = i * limit;

            let pageRadio = document.createElement('input');
            pageRadio.setAttribute('type', 'radio');
            pageRadio.setAttribute('id', `page-${i + 1}`);
            pageRadio.setAttribute('name', 'pagination');
            pageRadio.classList.add('paginator__radio');
            if (i === 0) {
                pageRadio.setAttribute('checked', 'checked');
            }

            let pageLabel = document.createElement('label');
            pageLabel.setAttribute('for', `page-${i + 1}`);
            pageLabel.classList.add('paginator__label', 'input_light-theme');
            pageLabel.innerHTML = `${i + 1}`;

            pageLabel.addEventListener('click', function () {
                let listForPage = homeworks.slice(offset, offset + limit);
                [...homeworkElement.querySelectorAll('.homework__task')].forEach(function (element) {
                    element.parentNode.removeChild(element);
                });

                addHomeworkList(listForPage, homeworkElement);
            });

            paginator.appendChild(pageRadio);
            paginator.appendChild(pageLabel);
        }

        return paginator;
    }

    function createHomeworkTask(task) {
        CreateGame.prototype.animAlien = document.querySelector('.settings__animated-image');
        CreateGame.prototype.animShadow = document.querySelector('.shadow');
        let title = document.createElement('p');
        let startButton = document.createElement('button');
        let taskElement = document.createElement('div');
        title.classList.add('homework__title');
        startButton.classList.add('homework__start-button');
        startButton.classList.add('button_dark-theme');
        taskElement.classList.add('homework__task');
        title.innerHTML = `Скорость: ${task.speed}, Тема: ${task.theme}`;
        startButton.innerHTML = 'Выполнить';

        startButton.addEventListener('click', function (event) {
            event.preventDefault();

            this.disabled = true;
            setTimeout(function () {
                this.disabled = false;
            }.bind(this), 1000);

            let game = new CreateGame(task.speed, 0, task.collection.length, task.theme, task.collection, task.answer, task.id);

            setTimeout(function () {
                game.restartButton.classList.remove('d-none');
            }, 3000);

            let paginationWrapper = document.querySelector('.pagination-wrapper');
            /* Убираем окно настроек */
            paginationWrapper.classList.add('hide');

            /* Таймаут для того, чтобы прошла анимация скрывания настроек */
            setTimeout(function () {
                /* Показываем доску */
                paginationWrapper.parentElement.style.maxHeight = '100vh';
                paginationWrapper.parentElement.appendChild(game.board);
                /* Ускоряем пришельца */
                if (game.animAlien && game.animShadow) {
                    game.animAlien.classList.add('animation_fast');
                    game.animShadow.classList.add('animation_fast');
                }
            }, 1000);
            /* Начинаем показ */
            game.gameInit();

        });

        taskElement.appendChild(title);
        taskElement.appendChild(startButton);

        return taskElement;
    }
}
