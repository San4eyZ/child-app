if (document.body.classList.contains('groups-body')) {
    let loadingPlaceholder = document.createElement('div');
    loadingPlaceholder.className = 'loading-placeholder';

    let groupsListForRed;
    let createButton = document.querySelector('.groups__create-btn');
    let placeForData = document.querySelector('.action-place');
    let groupsListElement = document.querySelector('.groups__list');
// TODO Изменить запрос
    let promiseGroupList = getGroupsData(`${window.location.origin}/groups`);
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
                xhr.open('GET', `${window.location.origin}/stats-table?id=${radio.dataset.id}`, true);
                xhr.setRequestHeader('Content-Type', 'application/json');

                xhr.onload = function () {
                    if (xhr.status === 200) {
                        let table = createPersonalTable(JSON.parse(xhr.responseText));
                        table.style.animationName = 'fade';
                        table.style.animationDuration = '1s';
                        placeForData.replaceChild(table, placeForData.firstElementChild);
                    } else {
                        notify(true, `Ошибка получения информации об ученике (${xhr.status})`, 'failure');
                    }
                };
                xhr.onerror = function () {
                    notify(true, `Ошибка получения информации об ученике (${xhr.status})`, 'failure');
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

            let checkedStudent = groupsListElement.querySelector('.student__radio:checked');
            if (checkedStudent) {
                checkedStudent.checked = false;
            }

            let nameChanger = document.createElement('input');
            nameChanger.placeholder = 'Название группы...';
            nameChanger.classList.add('input_light-theme', 'groups-change-interface__name-changer');

            let changeButton = document.createElement('button');
            changeButton.innerHTML = 'Создать';
            changeButton.classList.add('button_dark-theme', 'groups-change-interface__btn');

            changeButton.addEventListener('click', function (evt) {
                evt.preventDefault();
                if (nameChanger.value) {
                    let currentFreeStudents = groupsListForRed[groupsListForRed.length - 1].students.slice();

                    let xhr = new XMLHttpRequest();
                    xhr.open('POST', `${window.location.origin}/groups`, true);
                    xhr.setRequestHeader('Content-Type', 'application/json');

                    xhr.onload = function () {
                        if (xhr.status === 200) {
                            location.reload(true);
                        } else {
                            notify(true, `Произошла ошибка при создании (${xhr.status})`, 'failure');
                            groupsListForRed[groupsListForRed.length - 1].students = currentFreeStudents;
                        }
                    };

                    xhr.onerror = function () {
                        notify(true, `Произошла ошибка при создании (${xhr.status})`, 'failure');
                        groupsListForRed[groupsListForRed.length - 1].students = currentFreeStudents;
                    };


                    let allStudents = [...list.children];
                    let newGroup = {
                        name: nameChanger.value,
                        students: allStudents.filter(opt => opt.selected).map(({studentObj}) => studentObj)
                    };
                    let freeGroup = {
                        name: 'Не распределенные',
                        free: true,
                        students: allStudents.filter(opt => !opt.selected).map(({studentObj}) => studentObj)
                    };
                    let newGroupList = groupsListForRed.slice();
                    newGroupList.pop();
                    // TODO Придумать что-нибудь с id или оставить так как есть
                    if (newGroupList.length) {
                        newGroup.id = newGroupList[newGroupList.length - 1].id + 1;
                    } else {
                        newGroup.id = 1
                    }
                    newGroupList.push(newGroup, freeGroup);
                    xhr.send(JSON.stringify(newGroupList));
                } else {
                    notify(true, 'Пожалуйста введите имя шруппы', 'warning');
                }
            });

            let list = makeListForSelect(true);
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
                 <button class="button_light-theme groups__red-btn">Редактировать</button>
                 <button class="button_light-theme groups__homework-btn">Задать задание</button>`;

            let freeStudents = groupsListForRed[groupsListForRed.length - 1];

            let deleteButton = group.querySelector('.groups__delete-btn');
            let redButton = group.querySelector('.groups__red-btn');
            let homeworkButton = group.querySelector('.groups__homework-btn');

            homeworkButton.addEventListener('click', function (event) {
                event.preventDefault();

                let checkedStudent = groupsListElement.querySelector('.student__radio:checked');
                if (checkedStudent) {
                    checkedStudent.checked = false;
                }

                let title = document.createElement('span');
                title.classList.add('settings__label');
                title.innerHTML = 'Выберите учеников:';

                let list = makeListForSelect(false, groupObj);
                list.classList.add('groups-change-interface__list');

                let options = document.createElement('section');
                options.classList.add('settings__main-window');
                options.innerHTML = optionsForHomeworkTemplate;

                let setButton = document.createElement('button');
                setButton.innerHTML = 'Задать';
                setButton.classList.add('button_dark-theme', 'groups-change-interface__btn');

                let holder = document.createElement('div');
                holder.classList.add('groups-change-interface');
                holder.appendChild(title);
                holder.appendChild(list);
                holder.appendChild(options);
                holder.appendChild(setButton);
                Object.assign(holder.style, {
                    animationName: 'fade',
                    animationDuration: '1s'
                });

                let incButtons = holder.querySelectorAll('.button_inc');
                let decButtons = holder.querySelectorAll('.button_dec');
                let fields = holder.querySelectorAll('.settings__input');
                let themeCheckers = [...holder.querySelectorAll('.settings__theme-option')];

                themeCheckers.forEach(checker => checker.addEventListener('change', function (event) {
                    let neighbourCheckers = [...this.parentElement.getElementsByTagName('input')];
                    let prevCheckers = neighbourCheckers.slice(0, neighbourCheckers.indexOf(this));

                    prevCheckers.forEach(checker => {
                        checker.checked = this.checked;
                    })
                }));

                for (let incButton of incButtons) {
                    incButton.addEventListener('click', inputControl.bind(null, incButton, 'inc'));
                }

                for (let decButton of decButtons) {
                    decButton.addEventListener('click', inputControl.bind(null, decButton, 'dec'));
                }

                let initialValue;
                for (let field of fields) {
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
                            this.value = isNaN(Number(this.value)) ? this.min + ' сек' : (Math.round(Number(this.value) * 10) / 10) + ' сек';
                        }
                    });
                }

                setButton.addEventListener('click', function (event) {
                    event.preventDefault();
                    event.preventDefault();
                    event.preventDefault();

                    let homeworkObj = {
                        selectedStudents: [...list.querySelectorAll('option:checked')].map(({value}) => value),
                        themeOption: [...options.querySelectorAll('.settings__theme-option:checked')].map(({value}) => value.split('_')),
                        speed: options.querySelector('.settings__speed-value').value.split(' ')[0],
                        capacity: options.querySelector('.settings__capacity-value').value,
                        quantity: options.querySelector('.settings__quantity-value').value
                    };

                    if (!homeworkObj.selectedStudents.length) {
                        notify(true, 'Пожалуйста выберите учеников', 'warning');

                        return;
                    }

                    if (!homeworkObj.themeOption.length) {
                        notify(true, 'Пожалуйста выберите тему', 'warning');

                        return;
                    }

                    let xhr = new XMLHttpRequest();

                    xhr.open('POST', `${window.location.origin}/homework`, true);
                    xhr.setRequestHeader('Content-Type', 'application/json');

                    xhr.onload = function () {
                        if (xhr.status === 200) {
                            notify(true, 'Задание задано', 'success');
                        } else {
                            notify(true, `Что-то пошло не так. Код ошибки: (${xhr.status})`, 'failure');
                        }
                    };
                    xhr.onerror = function () {
                        notify(true, `Что-то пошло не так. Код ошибки: (${xhr.status})`, 'failure');
                    };

                    xhr.send(JSON.stringify(homeworkObj));
                });

                placeForData.replaceChild(holder, placeForData.firstElementChild);
            });
            // Удаление группы
            deleteButton.addEventListener('click', function (event) {
                event.preventDefault();
                notify('true', 'Вы действительно хотите удалить группу?', 'confirm', function () {
                    let xhr = new XMLHttpRequest();
                    xhr.overrideMimeType('application/json');
                    xhr.open('DELETE', `${window.location.origin}/groups`, true);
                    xhr.onload = function () {
                        if (xhr.status === 200) {
                            location.reload(true);
                        } else {
                            notify(true, `Произошла ошибка при удалении (${xhr.status})`, 'failure');
                            freeStudents.students = currentFreeStudents;
                        }
                    };
                    xhr.onerror = function () {
                        notify(true, `Произошла ошибка при удалении (${xhr.status})`, 'failure');
                        freeStudents.students = currentFreeStudents;
                    };
                    // Спасаем текущее состояние
                    let currentFreeStudents = freeStudents.students.slice();
                    // Создаем новую группу для отправки
                    let newGroupList = groupsListForRed.filter(obj => obj !== groupObj);
                    // Освобождаем учеников из удаленной группы
                    freeStudents.students.push(...groupObj.students);
                    // Отправляем данные о новой группе на сервер
                    xhr.send(JSON.stringify(newGroupList));
                });
            });

            redButton.addEventListener('click', function (event) {
                event.preventDefault();

                let checkedStudent = groupsListElement.querySelector('.student__radio:checked');
                if (checkedStudent) {
                    checkedStudent.checked = false;
                }

                let nameChanger = document.createElement('input');
                nameChanger.value = this.parentElement.groupObj.name;
                nameChanger.classList.add('input_light-theme', 'groups-change-interface__name-changer');

                let changeButton = document.createElement('button');
                changeButton.classList.add('button_dark-theme', 'groups-change-interface__btn');

                let list = makeListForSelect(true, groupObj);
                list.classList.add('groups-change-interface__list');

                changeButton.innerHTML = 'Изменить группу';
                changeButton.addEventListener('click', function (event) {
                    event.preventDefault();
                    let enteredName = this.parentElement.firstElementChild.value;
                    if (enteredName) {
                        let currentStudents = groupObj.students.slice();
                        let currentFreeStudents = freeStudents.students.slice();

                        let xhr = new XMLHttpRequest();
                        xhr.overrideMimeType('application/json');
                        xhr.open('PATCH', `${window.location.origin}/groups`, true);
                        xhr.onload = function () {
                            if (xhr.status === 200) {
                                location.reload(true);
                            } else {
                                notify(true, `Произошла ошибка при редактировании (${xhr.status})`, 'failure');
                                groupObj.students = currentStudents;
                                freeStudents.students = currentFreeStudents;
                            }
                        };

                        xhr.onerror = function () {
                            notify(true, `Произошла ошибка при редактировании (${xhr.status})`, 'failure');
                            groupObj.students = currentStudents;
                            freeStudents.students = currentFreeStudents;
                        };

                        let allStudents = [...list.children];
                        let selectedStudents = allStudents.filter(opt => opt.selected).map(({studentObj}) => studentObj);
                        let unseectedStudents = allStudents.filter(opt => !opt.selected).map(({studentObj}) => studentObj);

                        groupObj.students = selectedStudents;
                        freeStudents.students = unseectedStudents;
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
        studentRadioContainer.innerHTML = `<input type="radio" name="student" id="student-${studentObj.id}" class="student__radio" data-id="${studentObj.id}">`;
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

    function makeListForSelect(isWithFree, group = null) {
        if (!isWithFree && !group) {
            throw new Error(`Список не может быть пустым: свободные - ${isWithFree}, группа - ${group}`);
        }
        let list = document.createElement('select');
        list.multiple = true;
        let freeStudents = groupsListForRed[groupsListForRed.length - 1].students;
        if (group) {
            let og = document.createElement('optgroup');
            og.label = group.name;
            group.students.forEach(student => makeOptions(student, og, true));
            list.appendChild(og);
        }
        if (isWithFree) {
            let freeOg = document.createElement('optgroup');
            freeOg.label = groupsListForRed[groupsListForRed.length - 1].name;
            freeStudents.forEach(student => makeOptions(student, freeOg));
            list.appendChild(freeOg);
        }

        function makeOptions(student, optgroup, isSelected = false) {
            let option = document.createElement('option');
            option.innerHTML = student.name;
            option.studentObj = student;
            option.value = student.id;
            option.selected = isSelected ? true : '';
            optgroup.appendChild(option);
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

function calculateHeight(element) {
    return [...element.children].reduce((init, cur) => {
        let computedStyle = window.getComputedStyle(cur);
        return init + parseInt(computedStyle.height) +
            parseInt(computedStyle.marginTop) +
            parseInt(computedStyle.marginBottom) +
            parseInt(computedStyle.borderTopWidth) +
            parseInt(computedStyle.borderBottomWidth) +
            parseInt(computedStyle.paddingBottom) +
            parseInt(computedStyle.paddingTop);
    }, 0);
}

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
    return `${Math.round((Number(value) + Number(amount)) * 10) / 10}`;
}

/*   Контроль полей ввода   */
function inputControl(button, role, event) {
    event.preventDefault();
    let controlledInput = role === 'inc' ? button.previousElementSibling : button.nextElementSibling;
    let step = role === 'inc' ? controlledInput.step : -controlledInput.step;
    let [number, rest] = controlledInput.value.split(' ');
    let newNumber = incValue(number, step);
    if (Number(newNumber) <= Number(controlledInput.max) && Number(newNumber) >= Number(controlledInput.min)) {
        controlledInput.value = rest ? newNumber + ` ${rest}` : newNumber;
    }
}

let optionsForHomeworkTemplate = '<div class="settings__theme settings__item">\n' +
    '                        <span class="settings__label col-12">\n' +
    '                            Выберите тему:\n' +
    '                        </span>\n' +
    '                        <div class="settings__theme-holder">\n' +
    '                            <span class="settings__theme-name">Просто</span>\n' +
    '                            <div class="settings__theme-placeholder"></div>\n' +
    '                            <input type="checkbox" name="theme" id="theme0_1" class="settings__theme-option" value="0_1">\n' +
    '                            <label for="theme0_1" class="settings__theme-label">2</label>\n' +
    '                            <input type="checkbox" name="theme" id="theme0_2" class="settings__theme-option" value="0_2">\n' +
    '                            <label for="theme0_2" class="settings__theme-label">3</label>\n' +
    '                            <input type="checkbox" name="theme" id="theme0_3" class="settings__theme-option" value="0_3">\n' +
    '                            <label for="theme0_3" class="settings__theme-label">4</label>\n' +
    '                            <input type="checkbox" name="theme" id="theme0_4" class="settings__theme-option" value="0_4">\n' +
    '                            <label for="theme0_4" class="settings__theme-label">5</label>\n' +
    '                            <input type="checkbox" name="theme" id="theme0_5" class="settings__theme-option" value="0_5">\n' +
    '                            <label for="theme0_5" class="settings__theme-label">6</label>\n' +
    '                            <input type="checkbox" name="theme" id="theme0_6" class="settings__theme-option" value="0_6">\n' +
    '                            <label for="theme0_6" class="settings__theme-label">7</label>\n' +
    '                            <input type="checkbox" name="theme" id="theme0_7" class="settings__theme-option" value="0_7">\n' +
    '                            <label for="theme0_7" class="settings__theme-label">8</label>\n' +
    '                            <input type="checkbox" name="theme" id="theme0_8" class="settings__theme-option" value="0_8">\n' +
    '                            <label for="theme0_8" class="settings__theme-label">9</label>\n' +
    '                        </div>\n' +
    '                        <div class="settings__theme-holder">\n' +
    '                            <span class="settings__theme-name">Друг</span>\n' +
    '                            <input type="checkbox" name="theme" id="theme1_3" class="settings__theme-option" value="1_3">\n' +
    '                            <label for="theme1_3" class="settings__theme-label">4</label>\n' +
    '                            <input type="checkbox" name="theme" id="theme1_2" class="settings__theme-option" value="1_2">\n' +
    '                            <label for="theme1_2" class="settings__theme-label">3</label>\n' +
    '                            <input type="checkbox" name="theme" id="theme1_1" class="settings__theme-option" value="1_1">\n' +
    '                            <label for="theme1_1" class="settings__theme-label">2</label>\n' +
    '                            <input type="checkbox" name="theme" id="theme1_0" class="settings__theme-option" value="1_0">\n' +
    '                            <label for="theme1_0" class="settings__theme-label">1</label>\n' +
    '                        </div>\n' +
    '                        <div class="settings__theme-holder">\n' +
    '                            <span class="settings__theme-name">Брат</span>\n' +
    '                            <input type="checkbox" name="theme" id="theme2_8" class="settings__theme-option" value="2_8">\n' +
    '                            <label for="theme2_8" class="settings__theme-label">9</label>\n' +
    '                            <input type="checkbox" name="theme" id="theme2_7" class="settings__theme-option" value="2_7">\n' +
    '                            <label for="theme2_7" class="settings__theme-label">8</label>\n' +
    '                            <input type="checkbox" name="theme" id="theme2_6" class="settings__theme-option" value="2_6">\n' +
    '                            <label for="theme2_6" class="settings__theme-label">7</label>\n' +
    '                            <input type="checkbox" name="theme" id="theme2_5" class="settings__theme-option" value="2_5">\n' +
    '                            <label for="theme2_5" class="settings__theme-label">6</label>\n' +
    '                            <input type="checkbox" name="theme" id="theme2_4" class="settings__theme-option" value="2_4">\n' +
    '                            <label for="theme2_4" class="settings__theme-label">5</label>\n' +
    '                            <input type="checkbox" name="theme" id="theme2_3" class="settings__theme-option" value="2_3">\n' +
    '                            <label for="theme2_3" class="settings__theme-label">4</label>\n' +
    '                            <input type="checkbox" name="theme" id="theme2_2" class="settings__theme-option" value="2_2">\n' +
    '                            <label for="theme2_2" class="settings__theme-label">3</label>\n' +
    '                            <input type="checkbox" name="theme" id="theme2_1" class="settings__theme-option" value="2_1">\n' +
    '                            <label for="theme2_1" class="settings__theme-label">2</label>\n' +
    '                            <input type="checkbox" name="theme" id="theme2_0" class="settings__theme-option" value="2_0">\n' +
    '                            <label for="theme2_0" class="settings__theme-label">1</label>\n' +
    '                        </div>\n' +
    '                        <div class="settings__theme-holder">\n' +
    '                            <span class="settings__theme-name">Друг+Брат</span>\n' +
    '                            <div class="settings__theme-placeholder"></div>\n' +
    '                            <input type="checkbox" name="theme" id="theme3_5" class="settings__theme-option" value="3_5">\n' +
    '                            <label for="theme3_5" class="settings__theme-label">6</label>\n' +
    '                            <input type="checkbox" name="theme" id="theme3_6" class="settings__theme-option" value="3_6">\n' +
    '                            <label for="theme3_6" class="settings__theme-label">7</label>\n' +
    '                            <input type="checkbox" name="theme" id="theme3_7" class="settings__theme-option" value="3_7">\n' +
    '                            <label for="theme3_7" class="settings__theme-label">8</label>\n' +
    '                            <input type="checkbox" name="theme" id="theme3_8" class="settings__theme-option" value="3_8">\n' +
    '                            <label for="theme3_8" class="settings__theme-label">9</label>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <div class="settings__speed settings__item">\n' +
    '                        <span class="settings__label">\n' +
    '                            Настройте скорость смены чисел:\n' +
    '                        </span>\n' +
    '                        <div class="settings__buttons-wrapper">\n' +
    '                            <button class="settings__dec-speed button_dec button_dark-theme">-</button>\n' +
    '                            <input type="text" class="settings__speed-value input_light-theme settings__input"\n' +
    '                                   title="Настройте скорость смены чисел" value="0.5 сек" step="0.1" max="10" min="0.5">\n' +
    '                            <button class="settings__inc-speed button_inc button_dark-theme">+</button>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <div class="settings__capacity settings__item">\n' +
    '                        <span class="settings__label">\n' +
    '                            Настройте разрядность чисел:\n' +
    '                        </span>\n' +
    '                        <div class="settings__buttons-wrapper">\n' +
    '                            <button class="settings__dec-capacity button_dec button_dark-theme">-</button>\n' +
    '                            <input type="text" class="settings__capacity-value input_light-theme settings__input"\n' +
    '                                   title="Настройте разрядность чисел" value="2" step="1" min="1" max="5">\n' +
    '                            <button class="settings__inc-capacity button_inc button_dark-theme">+</button>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <div class="settings__quantity settings__item">\n' +
    '                        <span class="settings__label">\n' +
    '                            Настройте количество чисел:\n' +
    '                        </span>\n' +
    '                        <div class="settings__buttons-wrapper">\n' +
    '                            <button class="settings__dec-quantity button_dec button_dark-theme">-</button>\n' +
    '                            <input type="text" class="settings__quantity-value input_light-theme settings__input"\n' +
    '                                   title="Настройте количество чисел" step="1" value="3" min="1" max="1000">\n' +
    '                            <button class="settings__inc-quantity button_inc button_dark-theme">+</button>\n' +
    '                        </div>\n' +
    '                    </div>\n';