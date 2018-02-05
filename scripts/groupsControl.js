if (document.body.classList.contains('groups-body')) {
    let loadingPlaceholder = document.createElement('div');
    loadingPlaceholder.innerHTML = '<div class="loading-placeholder"></div>';
    loadingPlaceholder = loadingPlaceholder.firstElementChild;

    let groupsListElement = document.querySelector('.groups__list');

    let promiseGroupList = getGroupsData(`${window.location.origin}/testData/groupList.json`);
    promiseGroupList.then(groupList => {
        groupsListElement.removeChild(groupsListElement.firstElementChild);
        groupList.forEach(group => groupsListElement.appendChild(createGroup(group)));

        let groups = document.querySelectorAll('.group-holder');
        let studentRadios = document.querySelectorAll('.student__radio');
        let placeForData = document.querySelector('.action-place');

        [...studentRadios].forEach(radio => radio.addEventListener('change', function () {
            if (this.checked) {
                placeForData.replaceChild(loadingPlaceholder, placeForData.firstElementChild);
                let xhr = new XMLHttpRequest();
                xhr.overrideMimeType('application/json');
                xhr.open('GET', `${window.location.origin}/testData/statsTable.json`, true);
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        let table = createPersonalTable(JSON.parse(xhr.responseText).data);
                        table.style.animationName = 'fade';
                        table.style.animationDuration = '1s';
                        placeForData.replaceChild(table, placeForData.firstElementChild);
                    } else {
                        throw new Error(`Ошибка получения информации о группах (${xhr.status})`);
                    }
                };
                xhr.onerror = function () {
                    throw new Error(`Ошибка получения информации о группах (${xhr.status})`);
                };
                xhr.send();
            }
        }));
        [...groups].forEach(group => {
            let groupList = group.querySelector('.group');
            let students = groupList.querySelectorAll('.group__student');
            let showGroup = group.querySelector('.group__checkbox');
            let height = [...students].reduce((init, cur) => {
                let computedStyle = window.getComputedStyle(cur);
                return init + parseInt(computedStyle.height) +
                    parseInt(computedStyle.marginTop) +
                    parseInt(computedStyle.marginBottom) +
                    parseInt(computedStyle.borderTopWidth) +
                    parseInt(computedStyle.borderBottomWidth);
            }, 0);
            showGroup.addEventListener('change', function () {
                if (this.checked) {
                    groupList.style.maxHeight = String(height) + 'px';
                }
                else {
                    groupList.style.maxHeight = '0';
                }
            })
        });
    });

    function getGroupsData(url) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.overrideMimeType('application/json');
            xhr.open('GET', url, true);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText).groups);
                }
                else {
                    reject(new Error(`Ошибка получения информации о группах (${xhr.status})`));
                }
            };
            xhr.onerror = function () {
                reject(new Error(`Ошибка получения информации о группах (${xhr.status})`));
            };
            xhr.send();
        })
    }

    function createGroup(groupObj) {
        let groupHolder = document.createElement('div');
        groupHolder.classList.add('group-holder');
        let group = document.createElement('div');
        group.classList.add('group');
        groupHolder.innerHTML =
            `<input class="group__checkbox" type="checkbox" name="group" id="group-${groupObj.id}">
             <label class="group__name" for="group-${groupObj.id}">${groupObj.name}</label>`;
        groupObj.students.forEach(student => createStudent(student).forEach(el => group.appendChild(el)));
        groupHolder.appendChild(group);

        return groupHolder;
    }
    
    function createStudent(studentObj) {
        let studentRadioContainer = document.createElement('div');
        let studentLabelContainer = document.createElement('div');
        studentRadioContainer.innerHTML = `<input type="radio" name="student" id="student-${studentObj.id}" class="student__radio">`;
        studentLabelContainer.innerHTML = `<label for="student-${studentObj.id}" class="group__student">${studentObj.name}</label>`;

        return [studentRadioContainer.firstElementChild, studentLabelContainer.firstElementChild];
    }
    
    function createPersonalTable(tableData) {
        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');
        let table = document.createElement('table');
        table.className = 'stats__table table_light-theme';
        thead.innerHTML = '<tr class="stats__row"><th class="stats__data table_light-theme font-weight-bold">№</th>\n' +
            '<th class="stats__data table_light-theme font-weight-bold">Результат</th>\n' +
            '<th class="stats__data table_light-theme font-weight-bold">Тема</th>\n' +
            '<th class="stats__data table_light-theme font-weight-bold">Скорость</th>\n' +
            '<th class="stats__data table_light-theme font-weight-bold">Разрядность</th>\n' +
            '<th class="stats__data table_light-theme font-weight-bold">Количество</th>' +
            '<th class="stats__data table_light-theme font-weight-bold">Тип рейтинга</th>' +
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
}