'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var xhr = new XMLHttpRequest();
xhr.overrideMimeType('application/json');
xhr.open('GET', 'http://localhost:8080/testData/statsTable.json', true);
xhr.onload = function () {
    if (xhr.status === 200) {
        var tableData = JSON.parse(xhr.responseText).data;
        var personalStats = document.querySelector('.stats__personal');
        var statsTable = createPersonalTable(tableData);
        var statsTableHeadings = [].concat(_toConsumableArray(statsTable.querySelectorAll('.stats__heading')));
        var placeholder = document.querySelector('.loading-placeholder');
        statsTableHeadings.forEach(function (heading, i) {
            return heading.addEventListener('click', function (event) {
                event.preventDefault();
                /* Тут мы задаем направление сортировки */
                if (!this.direction) {
                    this.direction = 1;
                } else {
                    this.direction = -this.direction;
                }
                tableSort(statsTable, i, -this.direction);
            });
        });
        personalStats.replaceChild(statsTable, placeholder);
    }
};
xhr.send();

var listOfTypes = document.querySelector('.stats__global-type');
var currentTable = document.querySelectorAll('.loading-placeholder')[1];
var tables = void 0;
loadRatingTables();

listOfTypes.addEventListener('change', function () {
    console.log(currentTable);
    var newTable = tables[Number(this.value)];
    currentTable.parentElement.replaceChild(newTable, currentTable);
    currentTable = newTable;
});

function loadRatingTables() {
    var ratingPromise = makePromise('http://localhost:8080/testData/ratingTop.json');
    var capacityPromise = makePromise('http://localhost:8080/testData/capacityTop.json');
    var speedPromise = makePromise('http://localhost:8080/testData/speedTop.json');

    Promise.all([ratingPromise, capacityPromise, speedPromise]).then(function (resultArray) {
        resultArray = resultArray.map(function (tableObj) {
            return createGlobalTable(tableObj.type, tableObj.data);
        });
        var newTable = resultArray[Number(listOfTypes.value)];
        currentTable.parentElement.replaceChild(newTable, currentTable);
        currentTable = newTable;
        tables = resultArray;
    });
}

function makePromise(url) {
    return new Promise(function (resolve) {
        var xhr = new XMLHttpRequest();
        xhr.overrideMimeType('application/json');
        xhr.open('GET', url, true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                throw new Error();
            }
        };
        xhr.send();
    });
}

function createGlobalTable(tableType, tableData) {
    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');
    var table = document.createElement('table');
    table.className = 'stats__table table_light-theme';
    thead.innerHTML = '<tr class="stats__row"><th class="stats__data table_light-theme">№</th>\n' + '<th class="stats__data table_light-theme">Имя</th>\n' + ('<th class="stats__data table_light-theme">' + tableType + '</th>\n');
    tableData.forEach(function (line) {
        var row = document.createElement('tr');
        row.innerHTML = '<td class="stats__data table_light-theme">' + line.number + '</td>\n            <td class="stats__data table_light-theme">' + line.name + '</td>\n            <td class="stats__data table_light-theme">' + line.value + '</td>';
        tbody.appendChild(row);
    });
    table.appendChild(thead);
    table.appendChild(tbody);

    return table;
}

function createPersonalTable(tableData) {
    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');
    var table = document.createElement('table');
    table.className = 'stats__table table_light-theme';
    thead.innerHTML = '<tr class="stats__row"><th class="stats__heading table_light-theme">№</th>\n' + '<th class="stats__heading table_light-theme">Результат</th>\n' + '<th class="stats__heading table_light-theme">Тема</th>\n' + '<th class="stats__heading table_light-theme">Скорость</th>\n' + '<th class="stats__heading table_light-theme">Разрядность</th>\n' + '<th class="stats__heading table_light-theme">Количество</th>' + '<th class="stats__heading table_light-theme">Тип рейтинга</th>' + '</tr>';
    tableData.forEach(function (line, number) {
        var row = document.createElement('tr');
        row.innerHTML = '<td class="stats__data table_light-theme">' + (number + 1) + '</td>\n            <td class="stats__data table_light-theme ' + (line.success ? 'success' : 'failure') + '">' + (line.success ? 'Успех' : 'Неудача') + '</td>\n            <td class="stats__data table_light-theme">' + line.theme + '</td>\n            <td class="stats__data table_light-theme">' + (line.speed + 'сек') + '</td>\n            <td class="stats__data table_light-theme">' + line.capacity + '</td>\n            <td class="stats__data table_light-theme">' + line.quantity + '</td>\n            <td class="stats__data table_light-theme">' + line.rating + '</td>';
        tbody.appendChild(row);
    });
    table.appendChild(thead);
    table.appendChild(tbody);

    return table;
}

/**
 * Сортирует заданную таблицу по столбцу с заданным номером
 * @param {Object} table
 * @param {Number} column
 * @param {Number} direction - -1 по убыванию, 1 по возрастанию
 * @returns {Object} - измененная таблица
 */
function tableSort(table, column, direction) {
    var tbody = table.tBodies[0];
    var newTbody = document.createElement('tbody');
    var tableRows = [].concat(_toConsumableArray(tbody.rows));

    tableRows.sort(function (row1, row2) {
        var tableData1 = row1.cells[column];
        var tableData2 = row2.cells[column];

        if (getNumberOrString(tableData1.innerHTML) > getNumberOrString(tableData2.innerHTML)) {
            return direction;
        }
        if (getNumberOrString(tableData1.innerHTML) < getNumberOrString(tableData2.innerHTML)) {
            return -direction;
        }

        return 0;
    });
    tableRows.forEach(function (row) {
        return newTbody.appendChild(row);
    });
    table.replaceChild(newTbody, tbody);

    return table;
}

/**
 * Если строка приводится к числу или начинается с числа возвращает это число, иначе саму строку
 * @param numberOrString
 * @return {*}
 */
function getNumberOrString(numberOrString) {
    if (!isNaN(Number(numberOrString))) {
        return Number(numberOrString);
    }
    if (!isNaN(parseFloat(numberOrString))) {
        return parseFloat(numberOrString);
    }

    return numberOrString;
}
//# sourceMappingURL=statsControl.js.map