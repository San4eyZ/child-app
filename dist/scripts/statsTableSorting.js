'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var statsTable = document.querySelector('.stats__table');
var statsTableHeadings = [].concat(_toConsumableArray(statsTable.querySelectorAll('thead th')));

statsTableHeadings.forEach(function (heading, i) {
    return heading.addEventListener('click', function (event) {
        event.preventDefault();
        /* Тут мы задаем направление сортировки */
        if (!this.direction) {
            this.direction = -1;
        } else {
            this.direction = -this.direction;
        }
        tableSort(statsTable, i, -this.direction);
    });
});

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
//# sourceMappingURL=statsTableSorting.js.map