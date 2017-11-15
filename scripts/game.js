/*  Создание игры  */
function CreateGame(interval, capacity, quantity, themeNumber) {
    this.interval = Number(interval) * 1000;
    this.quantity = Number(quantity);
    this.capacity = Number(capacity);
    this.themeNumber = Number(themeNumber);
    this.collection = createCollection(capacity, quantity);
    this.index = 0;
    this.answer = 0;
    this.createBoard();
    this.numberField = this.board.querySelector('.game__number');
}

CreateGame.prototype = {
    /* Меняет текущий индекс и накапливает сумму */
    changeNumber: function () {
        let number = this.collection[this.index];
        this.numberField.innerHTML = String(number);
        this.numberField.classList.remove('hide');
        this.answer += number;
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

        let body = 'answer=' + `${result};${this.interval};${this.quantity};${this.capacity};${this.themeNumber}`;

        xhr.open("POST", where, true);
        xhr.setRequestHeader('Content-Type', 'text-plain');

        xhr.send(body);
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
            numberHolder.style.transitionDuration = this.interval * 0.2;
        }

        /*прикрепляем кнопки к игре*/
        this.restartButton = restartButton;
        this.closeButton = closeButton;

        /*И вешаем на них обработчики*/
        closeButton.addEventListener('click', (function (event) {
            event.preventDefault();

            /* Показываем настрйки и убираем текущую игру */
            settings.classList.remove('hide');
            gameInterface.removeChild(board);
            clearTimeout(this.endTimer);
            this.animAlien.classList.remove('animation_fast');
            this.animShadow.classList.remove('animation_fast');
        }).bind(this));

        restartButton.addEventListener('click', (function (event) {
            event.preventDefault();
            let that = this;
            clearInterval(that.timer);
            clearTimeout(that.endTimer);
            /* Прячем кнопку restart, чтобы ничего не сломали, пока не пройдут анимации */
            restartButton.classList.add('d-none');

            /* Прячем доску */
            board.classList.add('hide');
            setTimeout(function () {
                /* Если поле для чисел было скрыто, показываем его */
                that.numberField.classList.remove('hide');
                /* Убираем форму ответа, если дошли до конца и она создалась */
                if (that.answerForm) {
                    that.board.removeChild(that.answerForm);
                    that.answerForm = undefined;
                }
                /* обновляем состояние игры */
                that.index = 0;
                that.answer = 0;
                that.numberField.innerHTML = 'Вперед!';
                /* Показываем доску */
                board.classList.remove('hide');
                /* Начинаем сначала */
                that.gameInit();
            }, 1000)
        }).bind(this));

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
                this.sendResult('https://your.site', 'success')
            } else {
                answerField.style.backgroundColor = '#ff2b0a';
                answerField.value = 'Ошибка, попробуйте снова';
                this.sendResult('https://your.site', 'failure')
            }
            answerField.disabled = true;
            submitAnswer.disabled = true;
        }).bind(this));

        this.board.appendChild(answerForm);
        this.answerForm = answerForm;
    },

    animAlien: document.querySelector('.settings__animated-image'),
    animShadow: document.querySelector('.shadow')
};

let startGame = document.querySelector('.settings__start-game');
let settings = document.querySelector('.settings__main-window');
let gameInterface = document.querySelector('.game-interface');
let playground = document.querySelector('.playground');

let incButtons = document.querySelectorAll('.button_inc');
let decButtons = document.querySelectorAll('.button_dec');
let fields = document.querySelectorAll('.settings__input');
let fullscreenOn = document.querySelector('.game__fullscreen-on');
let fullscreenOff = document.querySelector('.game__fullscreen-off');

fullscreenOn.addEventListener('click', function (event) {
    event.preventDefault();
    playground.classList.add('game-window_fullscreen');
    this.classList.remove('d-md-block');
    fullscreenOff.classList.remove('d-none');
});

fullscreenOff.addEventListener('click', function (event) {
    event.preventDefault();
    playground.classList.remove('game-window_fullscreen');
    this.classList.add('d-none');
    fullscreenOn.classList.add('d-md-block');
});

/*   Начало игры   */
startGame.addEventListener('click', function (event) {
    event.preventDefault();

    let themeOption = document.querySelector('.settings__theme-option:checked').value;
    let speed = document.querySelector('.settings__speed-value').value.split(' ')[0];
    let capacity = document.querySelector('.settings__capacity-value').value;
    let quantity = document.querySelector('.settings__quantity-value').value;
    let game = new CreateGame(speed, capacity, quantity, themeOption);
    /* Как только начнется демонстрация, показываем кнопку restart */
    setTimeout(function () {
        game.restartButton.classList.remove('d-none');
    }, 3000);

    /* Убираем окно настроек */
    settings.classList.add('hide');

    /* Таймаут для того, чтобы прошла анимация скрывания настроек */
    setTimeout(function () {
        /* Показываем доску */
        gameInterface.appendChild(game.board);
        /* Ускоряем пришельца */
        game.animAlien.classList.add('animation_fast');
        game.animShadow.classList.add('animation_fast');
    }, 1000);
    /* Начинаем показ */
    game.gameInit();
});

/* Вешаем обработчики */
for (let incButton of incButtons) {
    incButton.addEventListener('click', inputControl.bind(null, incButton, 'inc'));
}

for (let decButton of decButtons) {
    decButton.addEventListener('click', inputControl.bind(null, decButton, 'dec'));
}

for (let field of fields) {
    field.addEventListener('keypress', restrictKeys);
    field.addEventListener('focus', function () {
        this.value = '';
    });
    field.addEventListener('blur', function () {
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
