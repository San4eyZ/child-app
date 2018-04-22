'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

if (document.body.classList.contains('stats-body')) {
    var loadRatingTables = function loadRatingTables() {
        var ratingPromise = makePromiseToGetData(window.location.origin + '/rating-top');
        var capacityPromise = makePromiseToGetData(window.location.origin + '/capacity-top');
        var speedPromise = makePromiseToGetData(window.location.origin + '/speed-top');

        Promise.all([ratingPromise, capacityPromise, speedPromise]).then(function (resultArray) {
            resultArray = resultArray.map(function (tableObj) {
                return createGlobalTable(tableObj.type, tableObj.data);
            });
            var newTable = resultArray[Number(listOfTypes.value)];
            currentTable.parentElement.replaceChild(newTable, currentTable);
            currentTable = newTable;
            tables = resultArray;
        }).catch(function (error) {
            return notify(true, error.message, 'failure');
        });
    };

    var makePromiseToGetData = function makePromiseToGetData(url) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.overrideMimeType('application/json');
            xhr.open('GET', url, true);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(new Error('\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435 \u0440\u0435\u0439\u0442\u0438\u043D\u0433\u0430 (' + xhr.status + ')'));
                }
            };
            xhr.onerror = function () {
                reject(new Error('\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435 \u0440\u0435\u0439\u0442\u0438\u043D\u0433\u0430 (' + xhr.status + ')'));
            };
            xhr.send();
        });
    };

    var createGlobalTable = function createGlobalTable(tableType, tableData) {
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
    };

    var createPersonalTable = function createPersonalTable(tableData) {
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
    };

    /**
     * Сортирует заданную таблицу по столбцу с заданным номером
     * @param {Object} table
     * @param {Number} column
     * @param {Number} direction - -1 по убыванию, 1 по возрастанию
     * @returns {Object} - измененная таблица
     */


    var tableSort = function tableSort(table, column, direction) {
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
    };

    /**
     * Если строка приводится к числу или начинается с числа возвращает это число, иначе саму строку
     * @param numberOrString
     * @return {*}
     */


    var getNumberOrString = function getNumberOrString(numberOrString) {
        if (!isNaN(Number(numberOrString))) {
            return Number(numberOrString);
        }
        if (!isNaN(parseFloat(numberOrString))) {
            return parseFloat(numberOrString);
        }

        return numberOrString;
    };

    var xhr = new XMLHttpRequest();
    xhr.open('GET', window.location.origin + '/stats-table', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
        if (xhr.status === 200) {
            var tableData = JSON.parse(xhr.responseText);
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
        } else {
            throw new Error('\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0438 (' + xhr.status + ')');
        }
    };
    xhr.onerror = function () {
        throw new Error('\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0438 (' + xhr.status + ')');
    };

    xhr.send();

    var listOfTypes = document.querySelector('.stats__global-type');
    var currentTable = document.querySelectorAll('.loading-placeholder')[1];
    var tables = void 0;

    loadRatingTables();

    listOfTypes.addEventListener('change', function () {
        var newTable = tables[Number(this.value)];
        currentTable.parentElement.replaceChild(newTable, currentTable);
        currentTable = newTable;
    });
}
