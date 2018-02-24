'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*  Создание игры  */
function CreateGame(interval, capacity, quantity, theme, collection, answer, homeworkId) {
    this.interval = Number(interval) * 1000;
    this.quantity = Number(quantity);
    this.capacity = Number(capacity);
    this.theme = theme;
    this.collection = collection || createCollection(capacity, quantity);
    this.index = 0;
    this.answer = answer || this.collection.reduce(function (n, sum) {
        return n + sum;
    }, 0);
    this.homeworkId = homeworkId;
    this.createBoard();
    this.numberField = this.board.querySelector('.game__number');
}

CreateGame.prototype = {
    /* Меняет текущий индекс и накапливает сумму */
    changeNumber: function changeNumber() {
        var number = this.collection[this.index];
        this.numberField.innerHTML = String(number);
        this.numberField.classList.remove('hide');
        this.index++;
        setTimeout(function () {
            this.numberField.classList.add('hide');
        }.bind(this), this.interval * 0.8);
    },
    /* Начинает игру */
    gameInit: function gameInit() {
        var that = this;
        var times = that.quantity;
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
        }, 2800 + that.interval);
    },
    /* Завершение игры */
    gameEnd: function gameEnd() {
        var that = this;
        that.numberField.classList.add('hide');
        setTimeout(function () {
            that.createAnswerInput();
        }, this.interval * 0.2);
    },
    /* Записываем результат в переданное место */
    sendResult: function sendResult(where, result) {
        var xhr = new XMLHttpRequest();
        var body = {
            result: result,
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
    createBoard: function createBoard() {
        var board = document.createElement('div');
        var heading = document.createElement('h2');
        var closeButton = document.createElement('button');
        var restartButton = document.createElement('button');
        var numberHolder = document.createElement('div');
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
            numberHolder.style.transitionDuration = '' + this.interval * 0.2;
        }

        /*прикрепляем кнопки к игре*/
        this.restartButton = restartButton;
        this.closeButton = closeButton;

        /*И вешаем на них обработчики*/
        closeButton.addEventListener('click', function (event) {
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
        }.bind(this));

        restartButton.addEventListener('click', function (event) {
            event.preventDefault();
            var that = this;
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
                that.numberField.innerHTML = 'Вперед!';
                /* Показываем доску */
                board.classList.remove('hide');
                /* Начинаем сначала */
                that.gameInit();
            }, 1000);
        }.bind(this));

        board.appendChild(heading);
        board.appendChild(numberHolder);
        board.appendChild(restartButton);
        board.appendChild(closeButton);

        this.board = board;
    },

    createAnswerInput: function createAnswerInput() {
        var answerForm = document.createElement('div');
        var answerField = document.createElement('input');
        var submitAnswer = document.createElement('button');
        answerForm.className = 'game__answer-form';
        answerField.className = 'game__answer-field input_light-theme';
        submitAnswer.className = 'game__answer-submit button_dark-theme';

        submitAnswer.innerHTML = 'Проверить';
        answerField.placeholder = 'Введите сумму чисел';
        answerForm.appendChild(answerField);
        answerForm.appendChild(submitAnswer);

        answerField.addEventListener('keypress', restrictKeys);
        submitAnswer.addEventListener('click', function (event) {
            event.preventDefault();
            if (answerField.value === '') {
                answerField.placeholder = 'Введите ответ';
                answerField.style.backgroundColor = '#ffe814';
                return false;
            }
            if (Number(answerField.value) === this.answer) {
                answerField.style.backgroundColor = '#1fc113';
                answerField.value = 'Правильно!';
                this.sendResult(window.location.origin + (this.homeworkId ? '/homeworkResult' : '/gameResult'), 'success');
            } else {
                answerField.style.backgroundColor = '#ff2b0a';
                answerField.value = 'Ошибка, попробуйте снова';
                this.sendResult(window.location.origin + (this.homeworkId ? '/homeworkResult' : '/gameResult'), 'failure');
            }
            answerField.disabled = true;
            submitAnswer.disabled = true;
        }.bind(this));

        this.board.appendChild(answerForm);
        this.answerForm = answerForm;
    }
};

if (document.body.classList.contains('game-body')) {
    (function () {
        CreateGame.prototype.animAlien = document.querySelector('.settings__animated-image');
        CreateGame.prototype.animShadow = document.querySelector('.shadow');

        var startGame = document.querySelector('.settings__start-game');
        var settings = document.querySelector('.settings__main-window');
        var gameInterface = document.querySelector('.game-interface');
        var playground = document.querySelector('.playground');

        var incButtons = document.querySelectorAll('.button_inc');
        var decButtons = document.querySelectorAll('.button_dec');
        var fields = document.querySelectorAll('.settings__input');
        var themeCheckers = [].concat(_toConsumableArray(gameInterface.querySelectorAll('.settings__theme-option')));

        themeCheckers.forEach(function (checker) {
            return checker.addEventListener('change', function (event) {
                var _this = this;

                var neighbourCheckers = [].concat(_toConsumableArray(this.parentElement.getElementsByTagName('input')));
                var prevCheckers = neighbourCheckers.slice(0, neighbourCheckers.indexOf(this));

                prevCheckers.forEach(function (checker) {
                    checker.checked = _this.checked;
                });
            });
        });

        /*   Начало игры   */
        startGame.addEventListener('click', function (event) {
            event.preventDefault();

            var themeOptions = [].concat(_toConsumableArray(gameInterface.querySelectorAll('.settings__theme-option:checked'))).map(function (_ref) {
                var value = _ref.value;
                return value.split('_');
            });
            var speed = gameInterface.querySelector('.settings__speed-value').value.split(' ')[0];
            var capacity = gameInterface.querySelector('.settings__capacity-value').value;
            var quantity = gameInterface.querySelector('.settings__quantity-value').value;
            if (!themeOptions.length) {
                notify(true, 'Пожайлуйста, выберите темы', 'warning');

                return;
            }

            this.classList.add('btn-loading');
            this.disabled = true;

            var xhr = new XMLHttpRequest();
            xhr.open('POST', window.location.origin + '/generator', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function () {
                if (xhr.status === 200) {
                    setTimeout(function () {
                        this.disabled = false;
                    }.bind(this), 1000);
                    var game = new CreateGame(speed, capacity, quantity, themeOptions, JSON.parse(xhr.responseText));
                    /* Как только начнется демонстрация, показываем кнопку restart */
                    setTimeout(function () {
                        game.restartButton.classList.remove('d-none');
                    }, 3000);

                    /* Убираем окно настроек */
                    settings.classList.add('hide');

                    /* Таймаут для того, чтобы прошла анимация скрывания настроек */
                    setTimeout(function () {
                        gameInterface.style.maxHeight = '85vh';
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
                    this.classList.remove('btn-loading');
                    notify(true, '\u0427\u0442\u043E-\u0442\u043E \u043F\u043E\u0448\u043B\u043E \u043D\u0435 \u0442\u0430\u043A: (' + xhr.status + ')', 'failure');
                }
            }.bind(this);

            xhr.onerror = function () {
                this.disabled = false;
                this.classList.remove('btn-loading');
                notify(true, '\u0427\u0442\u043E-\u0442\u043E \u043F\u043E\u0448\u043B\u043E \u043D\u0435 \u0442\u0430\u043A: (' + xhr.status + ')', 'failure');
            }.bind(this);

            xhr.send(JSON.stringify({ speed: speed, capacity: capacity, quantity: quantity, themeOptions: themeOptions }));
        });

        /* Вешаем обработчики */
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = incButtons[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var incButton = _step.value;

                incButton.addEventListener('click', inputControl.bind(null, incButton, 'inc'));
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
            for (var _iterator2 = decButtons[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var decButton = _step2.value;

                decButton.addEventListener('click', inputControl.bind(null, decButton, 'dec'));
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

        var initialValue = void 0;
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = fields[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var field = _step3.value;

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
                        this.value = isNaN(Number(this.value)) ? this.min + ' сек' : Math.round(Number(this.value) * 10) / 10 + ' сек';
                    }
                });
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }
    })();
}

/* Создает набор из случайных чисел заданного разряда */
function createCollection(capacity, quantity) {
    var collection = [];
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
        }, time);
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
    return '' + Math.round((Number(value) + Number(amount)) * 10) / 10;
}

/*   Контроль полей ввода   */
function inputControl(button, role, event) {
    event.preventDefault();
    var controlledInput = role === 'inc' ? button.previousElementSibling : button.nextElementSibling;
    var step = role === 'inc' ? controlledInput.step : -controlledInput.step;

    var _controlledInput$valu = controlledInput.value.split(' '),
        _controlledInput$valu2 = _slicedToArray(_controlledInput$valu, 2),
        number = _controlledInput$valu2[0],
        rest = _controlledInput$valu2[1];

    var newNumber = incValue(number, step);
    if (Number(newNumber) <= Number(controlledInput.max) && Number(newNumber) >= Number(controlledInput.min)) {
        controlledInput.value = rest ? newNumber + (' ' + rest) : newNumber;
    }
}

if (document.body.classList.contains('homework-body')) {
    var addHomeworkList = function addHomeworkList(tasks, element) {
        var taskElements = tasks.map(createHomeworkTask);
        taskElements.forEach(function (task) {
            return element.appendChild(task);
        });
    };

    var createHomeworkTask = function createHomeworkTask(task) {
        CreateGame.prototype.animAlien = document.querySelector('.settings__animated-image');
        CreateGame.prototype.animShadow = document.querySelector('.shadow');
        var title = document.createElement('p');
        var startButton = document.createElement('button');
        var taskElement = document.createElement('div');
        title.classList.add('homework__title');
        startButton.classList.add('homework__start-button');
        startButton.classList.add('button_dark-theme');
        taskElement.classList.add('homework__task');
        title.innerHTML = '\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C: ' + task.speed + ', \u0422\u0435\u043C\u0430: ' + task.theme;
        startButton.innerHTML = 'Выполнить';

        startButton.addEventListener('click', function (event) {
            event.preventDefault();

            this.disabled = true;
            setTimeout(function () {
                this.disabled = false;
            }.bind(this), 1000);

            var game = new CreateGame(task.speed, 0, task.collection.length, task.theme, task.collection, task.answer, task.id);

            setTimeout(function () {
                game.restartButton.classList.remove('d-none');
            }, 3000);

            /* Убираем окно настроек */
            homeworkElement.classList.add('hide');

            /* Таймаут для того, чтобы прошла анимация скрывания настроек */
            setTimeout(function () {
                /* Показываем доску */
                homeworkElement.parentElement.style.maxHeight = '85vh';
                homeworkElement.parentElement.appendChild(game.board);
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
    };

    var placeholder = document.querySelector('.loading-placeholder');
    var homeworkElement = document.querySelector('.homework');
    var homeworkWindow = document.querySelector('.homework-main');

    var xhr = new XMLHttpRequest();
    xhr.open('GET', window.location.origin + '/homework', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.status === 200) {
            placeholder.parentElement.removeChild(placeholder);
            addHomeworkList(JSON.parse(xhr.responseText).data, homeworkElement);
        } else if (xhr.status === 404) {
            var message = document.createElement('div');
            message.innerHTML = 'У вас нет невыполненного домашнего задания';
            message.style.textAlign = 'center';
            message.style.fontSize = '1.5em';
            message.style.color = '#43c40f';
            homeworkElement.replaceChild(message, placeholder);
        } else {
            notify(true, '\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438 \u043E \u0433\u0440\u0443\u043F\u043F\u0430\u0445 (' + xhr.status + ')', 'failure');
        }
    };
    xhr.onerror = function () {
        notify(true, '\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438 \u043E \u0433\u0440\u0443\u043F\u043F\u0430\u0445 (' + xhr.status + ')', 'failure');
    };
    xhr.send();
}

var bgColors = {
    success: '#6eff95',
    failure: '#ff0000',
    warning: '#fcff5a'
};
var colors = {
    success: '#00a919',
    failure: '#850000',
    warning: '#de8004'
};
var currentZindex = 20;

/**
 * Выводит уведомление, позиционированное сверху экрана и фиксированное при необходимости, в указанный элемент
 * @param {Boolean} isFixed
 * @param {String} message
 * @param {String} type
 * @param {HTMLElement} element
 */
function notify(isFixed, message, type) {
    var element = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : document.body;

    if (type !== 'success' && type !== 'failure' && type !== 'warning') {
        throw new TypeError('Неверное имя типа. Принимаются только "success", "warning" или "failure"');
    }
    var messageWindow = document.createElement('div');
    messageWindow.title = 'Скрыть';
    messageWindow.innerHTML = message;

    var notifyStyles = {
        left: '0',
        right: '0',
        top: '0',
        padding: '10px',
        textAlign: 'center',
        border: '2px solid',
        zIndex: String(currentZindex),
        backgroundColor: bgColors[type],
        color: colors[type],
        cursor: 'pointer',
        position: isFixed ? 'fixed' : 'absolute'
    };
    currentZindex++;

    Object.assign(messageWindow.style, notifyStyles);

    var delayedRemoval = setTimeout(function () {
        element.removeChild(messageWindow);
    }, 5000);

    messageWindow.addEventListener('click', function () {
        element.removeChild(messageWindow);
        clearTimeout(delayedRemoval);
    });

    element.insertBefore(messageWindow, element.firstElementChild);
}
//# sourceMappingURL=game.js.map