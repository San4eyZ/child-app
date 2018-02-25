if (document.body.classList.contains('stats-body')) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `${window.location.origin}/child-app/testData/statsTable.json`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onload = function () {
        if (xhr.status === 200) {
            let tableData = JSON.parse(xhr.responseText).data;
            let personalStats = document.querySelector('.stats__personal');
            let statsTable = createPersonalTable(tableData);
            let statsTableHeadings = [...statsTable.querySelectorAll('.stats__heading')];
            let placeholder = document.querySelector('.loading-placeholder');

            statsTableHeadings.forEach((heading, i) => heading.addEventListener('click', function (event) {
                event.preventDefault();
                /* Тут мы задаем направление сортировки */
                if (!this.direction) {
                    this.direction = 1;
                } else {
                    this.direction = -this.direction;
                }
                tableSort(statsTable, i, -this.direction);
            }));
            personalStats.replaceChild(statsTable, placeholder);
        } else {
            throw new Error(`Ошибка при загрузке статистики (${xhr.status})`);
        }
    };
    xhr.onerror = function () {
        throw new Error(`Ошибка при загрузке статистики (${xhr.status})`);
    };

    xhr.send();

    let listOfTypes = document.querySelector('.stats__global-type');
    let currentTable = document.querySelectorAll('.loading-placeholder')[1];
    let tables;

    loadRatingTables();

    listOfTypes.addEventListener('change', function () {
        let newTable = tables[Number(this.value)];
        currentTable.parentElement.replaceChild(newTable, currentTable);
        currentTable = newTable;
    });

    function loadRatingTables() {
        let ratingPromise = makePromiseToGetData(`${window.location.origin}/child-app/testData/ratingTop.json`);
        let capacityPromise = makePromiseToGetData(`${window.location.origin}/child-app/testData/capacityTop.json`);
        let speedPromise = makePromiseToGetData(`${window.location.origin}/child-app/testData/speedTop.json`);

        Promise.all([ratingPromise, capacityPromise, speedPromise]).then(
            function (resultArray) {
                resultArray = resultArray.map(tableObj => createGlobalTable(tableObj.type, tableObj.data));
                let newTable = resultArray[Number(listOfTypes.value)];
                currentTable.parentElement.replaceChild(newTable, currentTable);
                currentTable = newTable;
                tables = resultArray;
            }
        ).catch(error => notify(true, error.message, 'failure'));
    }

    function makePromiseToGetData(url) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.overrideMimeType('application/json');
            xhr.open('GET', url, true);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(new Error(`Произошла ошибка при загрузке рейтинга (${xhr.status})`));
                }
            };
            xhr.onerror = function () {
                reject(new Error(`Произошла ошибка при загрузке рейтинга (${xhr.status})`));
            };
            xhr.send();
        })
    }

    function createGlobalTable(tableType, tableData) {
        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');
        let table = document.createElement('table');
        table.className = 'stats__table table_light-theme';
        thead.innerHTML = '<tr class="stats__row"><th class="stats__data table_light-theme">№</th>\n' +
            '<th class="stats__data table_light-theme">Имя</th>\n' +
            `<th class="stats__data table_light-theme">${tableType}</th>\n`;
        tableData.forEach(line => {
            let row = document.createElement('tr');
            row.innerHTML = `<td class="stats__data table_light-theme">${line.number}</td>
            <td class="stats__data table_light-theme">${line.name}</td>
            <td class="stats__data table_light-theme">${line.value}</td>`;
            tbody.appendChild(row);
        });
        table.appendChild(thead);
        table.appendChild(tbody);

        return table;
    }

    function createPersonalTable(tableData) {
        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');
        let table = document.createElement('table');
        table.className = 'stats__table table_light-theme';
        thead.innerHTML = '<tr class="stats__row"><th class="stats__heading table_light-theme">№</th>\n' +
            '<th class="stats__heading table_light-theme">Результат</th>\n' +
            '<th class="stats__heading table_light-theme">Тема</th>\n' +
            '<th class="stats__heading table_light-theme">Скорость</th>\n' +
            '<th class="stats__heading table_light-theme">Разрядность</th>\n' +
            '<th class="stats__heading table_light-theme">Количество</th>' +
            '<th class="stats__heading table_light-theme">Тип рейтинга</th>' +
            '</tr>';
        tableData.forEach((line, number) => {
            let row = document.createElement('tr');
            row.innerHTML = `<td class="stats__data table_light-theme">${number + 1}</td>
            <td class="stats__data table_light-theme ${line.success ? 'success' : 'failure'}">${line.success ? 'Успех' : 'Неудача'}</td>
            <td class="stats__data table_light-theme">${line.theme}</td>
            <td class="stats__data table_light-theme">${line.speed + 'сек'}</td>
            <td class="stats__data table_light-theme">${line.capacity}</td>
            <td class="stats__data table_light-theme">${line.quantity}</td>
            <td class="stats__data table_light-theme">${line.rating}</td>`;
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
}
