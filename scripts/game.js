/*  Создание игры  */
function CreateGame(interval, capacity, quantity, themeNumber) {
    this.interval = Number(interval) * 1000;
    this.quantity = Number(quantity);
    this.capacity = Number(capacity);
    this.themeNumber = Number(themeNumber);
    this.collection = createCollection(capacity, quantity);
    this.number = Math.floor(Math.random() * Math.pow(10, capacity));
    this.sum = this.number;
    this.board = createBoard();
    this.numberField = this.board.querySelector('.game__number');
    this.changeNumber = function () {
        if (this.collection.length) {
            let rand = Math.floor(Math.random() * this.collection.length);
            this.sum += this.number;
            this.number = this.collection[rand];
            this.collection.splice(rand, 1);
        } else {
            this.number = -1;
        }
    }
}

function createCollection(capacity, quantity) {
    let collection = [];
    while (quantity - 1) {
        collection.push(Math.floor(Math.random() * Math.pow(10, capacity)));
        quantity--;
    }

    return collection;
}

function createBoard() {
    let board = document.createElement('div');
    let heading = document.createElement('h2');
    let closeButton = document.createElement('button');
    let restartButton = document.createElement('button');
    let fullscreenOn = document.createElement('button');
    let fullscreenOff = document.createElement('button');
    let numberHolder = document.createElement('div');
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

let startGame = document.querySelector('.settings__start-game');
let settings = document.querySelector('.settings__main-window');
let gameInterface = document.querySelector('.game-interface');

let incButtons = document.querySelectorAll('.button_inc');
let decButtons = document.querySelectorAll('.button_dec');
let fields = document.querySelectorAll('.settings__input');

let incValue = function (value, amount) {
    return `${Math.round((Number(value) + Number(amount)) * 10) / 10}`;
};

/*   Контроль полей ввода   */
let inputControl = function (button, role, event) {
    event.preventDefault();
    let controlledInput = role === 'inc' ? button.previousElementSibling : button.nextElementSibling;
    let step = role === 'inc' ? controlledInput.step : -controlledInput.step;
    let [number, rest] = controlledInput.value.split(' ');
    let newNumber = incValue(number, step);
    if (Number(newNumber) <= Number(controlledInput.max) && Number(newNumber) >= Number(controlledInput.min)) {
        controlledInput.value = rest ? newNumber + ` ${rest}` : newNumber;
    }
};

/*   Запрет на ввод символов не являющихся цифрами   */
let restrictKeys = function (event) {
    if (!(event.which >= 48 && event.which <= 57 || event.which === '8' || event.which === '46')) {
        event.preventDefault();
    }
};

/*   Начало игры   */
startGame.addEventListener('click', function (event) {
    event.preventDefault();

    let alien = document.querySelector('.settings__animated-image');
    let shadow = document.querySelector('.shadow');
    let themeOption = document.querySelector('.settings__theme-option:checked').value;
    let speed = document.querySelector('.settings__speed-value').value.split(' ')[0];
    let capacity = document.querySelector('.settings__capacity-value').value;
    let quantity = document.querySelector('.settings__quantity-value').value;
    let game = new CreateGame(speed, capacity, quantity, themeOption);

    settings.classList.add('hide');
    setTimeout(function () {
        /*Таймаут для того, чтобы прошла анимация*/
        gameInterface.appendChild(game.board);
    }, 1000);

    alien.classList.add('animation_fast');
    shadow.classList.add('animation_fast');
    setTimeout(function () {
        /*Аналогичный таймаут*/
        for (let i = 0; i < game.quantity; i++) {
            (function (index) {
                setTimeout(function () {
                    game.numberField.innerHTML = game.number;
                    game.changeNumber();
                }, game.interval * index)
            })(i);
        }
    }, 1000)
});

for (let incButton of incButtons) {
    incButton.addEventListener('click', inputControl.bind(null, incButton, 'inc'));
}

for (let decButton of decButtons) {
    decButton.addEventListener('click', inputControl.bind(null, decButton, 'dec'));
}

for (let field of fields) {
    field.addEventListener('keypress', restrictKeys);
}