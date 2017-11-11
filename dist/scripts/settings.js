'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/*  Создание игры  */
function CreateGame(interval, capacity, quantity, themeNumber) {
    this.interval = Number(interval) * 1000;
    this.quantity = Number(quantity);
    this.capacity = Number(capacity);
    this.themeNumber = Number(themeNumber);
    this.collection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    this.number = this.collection[Math.floor(Math.random() * this.collection.length)];
    this.sum = this.number;
    this.board = createBoard();
    this.numberField = this.board.querySelector('.game__number');
    this.changeNumber = function () {
        if (this.collection.length) {
            var rand = Math.floor(Math.random() * this.collection.length);
            this.sum += this.number;
            this.number = this.collection[rand];
            this.collection.splice(rand, 1);
        } else {
            this.number = -1;
        }
    };
}

function createBoard() {
    var board = document.createElement('div');
    var heading = document.createElement('h2');
    var closeButton = document.createElement('button');
    var restartButton = document.createElement('button');
    var fullscreenOn = document.createElement('button');
    var fullscreenOff = document.createElement('button');
    var numberHolder = document.createElement('div');
    board.className = 'game-board';
    heading.innerHTML = 'Вперед!';
    heading.className = 'game__heading';
    restartButton.className = 'game__button game__restart-button';
    restartButton.innerHTML = 'Заново';
    closeButton.className = 'game__button game__close-button';
    closeButton.innerHTML = 'Закончить';
    fullscreenOn.className = 'game__button game__fullscreen-on d-none d-md-block';
    fullscreenOff.className = 'game__button game__fullscreen-off';
    numberHolder.className = 'game__number';
    numberHolder.innerHTML = '1234567';
    board.appendChild(heading);
    board.appendChild(numberHolder);
    board.appendChild(restartButton);
    board.appendChild(closeButton);
    board.appendChild(fullscreenOn);

    return board;
}

var startGame = document.querySelector('.settings__start-game');
var settings = document.querySelector('.settings__main-window');
var gameInterface = document.querySelector('.game-interface');

var incButtons = document.querySelectorAll('.button_inc');
var decButtons = document.querySelectorAll('.button_dec');
var fields = document.querySelectorAll('.settings__input');

var incValue = function incValue(value, amount) {
    return '' + Math.round((Number(value) + Number(amount)) * 10) / 10;
};

/*   Контроль полей ввода   */
var inputControl = function inputControl(button, role, event) {
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
};

/*   Запрет на ввод символов не являющихся цифрами   */
var restrictKeys = function restrictKeys(event) {
    if (!(event.which >= 48 && event.which <= 57 || event.which === '8' || event.which === '46')) {
        event.preventDefault();
    }
};

/*   Начало игры   */
startGame.addEventListener('click', function (event) {
    event.preventDefault();

    var themeOption = document.querySelector('.settings__theme-option:checked').value;
    var speed = document.querySelector('.settings__speed-value').value.split(' ')[0];
    var capacity = document.querySelector('.settings__capacity-value').value;
    var quantity = document.querySelector('.settings__quantity-value').value;
    var game = new CreateGame(speed, capacity, quantity, themeOption);

    settings.classList.add('hide');
    setTimeout(function () {
        /*Таймаут для того, чтобы прошла анимация*/
        gameInterface.appendChild(game.board);
    }, 1000);

    setTimeout(function () {
        /*Аналогичный таймаут*/
        for (var i = 0; i < game.quantity; i++) {
            (function (index) {
                setTimeout(function () {
                    game.numberField.innerHTML = game.number;
                    game.changeNumber();
                }, game.interval * index);
            })(i);
        }
    }, 1000);
});

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

var _iteratorNormalCompletion3 = true;
var _didIteratorError3 = false;
var _iteratorError3 = undefined;

try {
    for (var _iterator3 = fields[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var field = _step3.value;

        field.addEventListener('keypress', restrictKeys);
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
//# sourceMappingURL=game.js.map