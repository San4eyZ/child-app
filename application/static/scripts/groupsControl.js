if (document.body.classList.contains('groups-body')) {
    let loadingPlaceholder = document.createElement('div');
    loadingPlaceholder.className = 'loading-placeholder';

    let groupsListForRed;
    let createButton = document.querySelector('.groups__create-btn');
    let placeForData = document.querySelector('.action-place');
    let groupsListElement = document.querySelector('.groups__list');

    let promiseGroupList = getGroupsData(`${window.location.origin}/child-app/testData/groupList.json`);
    promiseGroupList.then(groupList => {
        groupsListForRed = groupList;
        groupsListElement.removeChild(groupsListElement.firstElementChild);
        groupList.forEach(group => groupsListElement.insertBefore(createGroup(group), groupsListElement.lastElementChild));

        let groups = document.querySelectorAll('.group-holder');
        let studentRadios = document.querySelectorAll('.student__radio');

        [...studentRadios].forEach(radio => radio.addEventListener('change', function () {
            if (this.checked) {
                placeForData.replaceChild(loadingPlaceholder, placeForData.firstElementChild);

                let xhr = new XMLHttpRequest();
                xhr.open('GET', `${window.location.origin}/statsTable`, true);
                xhr.setRequestHeader('Content-Type', 'application/json');

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
            let showGroup = group.querySelector('.group__checkbox');
            let height = calculateHeight(groupList);

            showGroup.addEventListener('change', function () {
                if (this.checked) {
                    groupList.style.maxHeight = String(height) + 'px';
                }
                else {
                    groupList.style.maxHeight = '0';
                }
            })
        });

        createButton.disabled = '';

        createButton.addEventListener('click', function (event) {
            event.preventDefault();

            let nameChanger = document.createElement('input');
            nameChanger.placeholder = 'Название группы...';
            nameChanger.classList.add('input_light-theme', 'groups-change-interface__name-changer');

            let changeButton = document.createElement('button');
            changeButton.innerHTML = 'Создать';
            changeButton.classList.add('button_dark-theme', 'groups-change-interface__btn');

            changeButton.addEventListener('click', function (evt) {
                evt.preventDefault();
                if (nameChanger.value) {
                    let xhr = new XMLHttpRequest();
                    xhr.open('POST', `${window.location.origin}/child-app/forTeacher/groups.html`, true);
                    xhr.setRequestHeader('Content-Type', 'application/json');

                    xhr.onload = function () {
                        if (xhr.status === 200) {
                            location.reload(true);
                        } else {
                            notify(true, `Произошла ошибка при создании`, 'failure')
                        }
                    };

                    let allStudents = [...list.children];
                    let newGroup = {
                        name: nameChanger.value,
                        students: allStudents.filter(opt => opt.selected).map(({studentObj}) => studentObj)
                    };
                    let freeGroup = {
                        name: 'Не распределено',
                        free: true,
                        students: allStudents.filter(opt => !opt.selected).map(({studentObj}) => studentObj)
                    };
                    groupsListForRed.pop();
                    // TODO Придумать что-нибудь с id или оставить так как есть
                    newGroup.id = groupsListForRed[groupsListForRed.length - 1].id + 1;
                    groupsListForRed.push(newGroup, freeGroup);
                    xhr.send(JSON.stringify(groupsListForRed));
                } else {
                    notify(true, 'Пожалуйста введите имя шруппы', 'warning');
                }
            });

            let list = makeListForSelect();
            list.classList.add('groups-change-interface__list');

            let holder = createGroupChangingInterface(nameChanger, list, changeButton);

            placeForData.replaceChild(holder, placeForData.firstElementChild);
        })
    }).catch(err => {
        notify(true, `Что-то пошло не так: ${err.message}`, 'failure');
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
        group.id = groupObj.id;
        group.groupObj = groupObj;
        group.classList.add('group');
        if (!groupObj.free) {
            group.innerHTML =
                `<button class="button_light-theme groups__delete-btn">Удалить</button>
                 <button class="button_light-theme groups__red-btn">Редактировать</button>`;

            let freeStudents = groupsListForRed[groupsListForRed.length - 1];

            let deleteButton = group.querySelector('.groups__delete-btn');
            let redButton = group.querySelector('.groups__red-btn');

            // Удаление группы
            deleteButton.addEventListener('click', function (event) {
                event.preventDefault();
                let toDelete = confirm('Вы действительно хотите удалить группу?');
                if (toDelete) {
                    let xhr = new XMLHttpRequest();
                    xhr.overrideMimeType('application/json');
                    xhr.open('POST', `${window.location.origin}/child-app/forTeacher/groups.html`, true);
                    xhr.onload = function() {
                        if (xhr.status === 200) {
                            location.reload(true);
                        } else {
                            notify(true, `Произошла ошибка при удалении`, 'failure')
                        }
                    };
                    // Находим индекс удаляемой группы
                    let indexToDelete = groupsListForRed.indexOf(groupObj);
                    // Вырезаем удаляемую группу
                    let groupToDelete = groupsListForRed.splice(indexToDelete, 1)[0];
                    // Освобождаем учеников из удаленной группы
                    freeStudents.students.push(...groupToDelete.students);
                    // Отправляем данные о новой группе на сервер
                    xhr.send(JSON.stringify(groupsListForRed));
                }
            });

            redButton.addEventListener('click', function (event) {
                event.preventDefault();

                let nameChanger = document.createElement('input');
                nameChanger.value = this.parentElement.groupObj.name;
                nameChanger.classList.add('input_light-theme', 'groups-change-interface__name-changer');

                let changeButton = document.createElement('button');
                changeButton.classList.add('button_dark-theme', 'groups-change-interface__btn');

                let list = makeListForSelect(this.parentElement.groupObj);
                list.classList.add('groups-change-interface__list');

                changeButton.innerHTML = 'Изменить группу';
                changeButton.addEventListener('click', function (event) {
                    event.preventDefault();
                    let enteredName = this.parentElement.firstElementChild.value;
                    if (enteredName) {
                        let xhr = new XMLHttpRequest();
                        xhr.overrideMimeType('application/json');
                        xhr.open('POST', `${window.location.origin}/child-app/forTeacher/groups.html`, true);
                        xhr.onload = function () {
                            if (xhr.status === 200) {
                                location.reload(true);
                            } else {
                                notify(true, `Произошла ошибка при редактировании`, 'failure')
                            }
                        };

                        let allStudents = [...list.children];
                        let selectedStudents = allStudents.filter(opt => opt.selected).map(({studentObj}) => studentObj);
                        let unseectedStudents = allStudents.filter(opt => !opt.selected).map(({studentObj}) => studentObj);

                        groupObj.students = selectedStudents;
                        groupsListForRed[groupsListForRed.length -1].students = unseectedStudents;
                        groupObj.name = enteredName;
                        xhr.send(JSON.stringify(groupsListForRed));
                    } else {
                        notify(true, 'Пожалуйста введите имя группы', 'warning');
                    }


                });

                let holder = createGroupChangingInterface(nameChanger, list, changeButton);

                placeForData.replaceChild(holder, placeForData.firstElementChild);
            })
        }
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

    function makeListForSelect(group = null) {
        let list = document.createElement('select');
        list.multiple = true;
        let freeStudents = groupsListForRed[groupsListForRed.length - 1].students;
        if (group) {
            group.students.forEach(student => makeOptions(student, true));
        }
        freeStudents.forEach(student => makeOptions(student));
        function makeOptions(student, isSelected=false) {
            let option = document.createElement('option');
            option.innerHTML = student.name;
            option.studentObj = student;
            option.value = student.id;
            option.selected = isSelected ? true : '';
            list.appendChild(option);
        }

        return list;
    }

    function createGroupChangingInterface(nameChanger, list, button) {
        let holder = document.createElement('div');
        holder.classList.add('groups-change-interface');
        holder.appendChild(nameChanger);
        holder.appendChild(list);
        holder.appendChild(button);
        Object.assign(holder.style, {
            animationName: 'fade',
            animationDuration: '1s'
        });

        return holder;
    }

}

let bgColors = {
    success: '#6eff95',
    failure: '#ff0000',
    warning: '#fcff5a'
};
let colors = {
    success: '#00a919',
    failure: '#850000',
    warning: '#de8004'
};
let currentZindex = 20;

/**
 * Выводит уведомление, позиционированное сверху экрана и фиксированное при необходимости, в указанный элемент
 * @param {Boolean} isFixed
 * @param {String} message
 * @param {String} type
 * @param {HTMLElement} element
 */
function notify(isFixed, message, type, element = document.body) {
    if (type !== 'success' && type !== 'failure' && type !== 'warning') {
        throw new TypeError('Неверное имя типа. Принимаются только "success", "warning" или "failure"');
    }
    let messageWindow = document.createElement('div');
    messageWindow.title = 'Скрыть';
    messageWindow.innerHTML = message;

    let notifyStyles = {
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

    let delayedRemoval = setTimeout(function () {
        element.removeChild(messageWindow);
    }, 5000);

    messageWindow.addEventListener('click', function () {
        element.removeChild(messageWindow);
        clearTimeout(delayedRemoval);
    });

    element.insertBefore(messageWindow, element.firstElementChild);
}