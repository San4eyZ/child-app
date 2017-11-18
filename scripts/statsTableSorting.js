let statsTable = document.querySelector('.stats__table');
let statsTableHeadings = [...statsTable.querySelectorAll('thead th')];

statsTableHeadings.forEach((heading, i) => heading.addEventListener('click', function (event) {
    event.preventDefault();
    /* Тут мы задаем направление сортировки */
    if (!this.direction) {
        this.direction = -1;
    } else {
        this.direction = -this.direction;
    }
    tableSort(statsTable, i, -this.direction);
}));

/**
 * Сортирует заданную таблицу по столбцу с заданным номером
 * @param {Object} table
 * @param {Number} column
 * @param {Number} direction - -1 по убыванию, 1 по возрастанию
 * @returns {Object} - измененная таблица
 */
function tableSort(table, column, direction) {
    let tbody = table.tBodies[0];
    let newTbody = document.createElement('tbody');
    let tableRows = [...tbody.rows];

    tableRows.sort(function (row1, row2) {
        let tableData1 = row1.cells[column];
        let tableData2 = row2.cells[column];

        if (getNumberOrString(tableData1.innerHTML) > getNumberOrString(tableData2.innerHTML)) {
            return direction;
        }
        if (getNumberOrString(tableData1.innerHTML) < getNumberOrString(tableData2.innerHTML)) {
            return -direction;
        }

        return 0;
    });
    tableRows.forEach(row => newTbody.appendChild(row));
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
