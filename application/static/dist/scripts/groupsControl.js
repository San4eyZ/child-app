'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

if (document.body.classList.contains('groups-body')) {
    var getGroupsData = function getGroupsData(url) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.overrideMimeType('application/json');
            xhr.open('GET', url, true);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText).groups);
                } else {
                    reject(new Error('\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438 \u043E \u0433\u0440\u0443\u043F\u043F\u0430\u0445 (' + xhr.status + ')'));
                }
            };
            xhr.onerror = function () {
                reject(new Error('\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438 \u043E \u0433\u0440\u0443\u043F\u043F\u0430\u0445 (' + xhr.status + ')'));
            };
            xhr.send();
        });
    };

    var createGroup = function createGroup(groupObj) {
        var groupHolder = document.createElement('div');
        groupHolder.classList.add('group-holder');
        var group = document.createElement('div');
        group.id = groupObj.id;
        group.groupObj = groupObj;
        group.classList.add('group');
        if (!groupObj.free) {
            group.innerHTML = '<button class="button_light-theme groups__delete-btn">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>\n                 <button class="button_light-theme groups__red-btn">\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C</button>';

            var freeStudents = groupsListForRed[groupsListForRed.length - 1];

            var deleteButton = group.querySelector('.groups__delete-btn');
            var redButton = group.querySelector('.groups__red-btn');

            // Удаление группы
            deleteButton.addEventListener('click', function (event) {
                event.preventDefault();
                var toDelete = confirm('Вы действительно хотите удалить группу?');
                if (toDelete) {
                    var _freeStudents$student;

                    var xhr = new XMLHttpRequest();
                    xhr.overrideMimeType('application/json');
                    xhr.open('POST', window.location.origin + '/child-app/forTeacher/groups.html', true);
                    xhr.onload = function () {
                        if (xhr.status === 200) {
                            location.reload(true);
                        } else {
                            notify(true, '\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0438', 'failure');
                        }
                    };
                    // Находим индекс удаляемой группы
                    var indexToDelete = groupsListForRed.indexOf(groupObj);
                    // Вырезаем удаляемую группу
                    var groupToDelete = groupsListForRed.splice(indexToDelete, 1)[0];
                    // Освобождаем учеников из удаленной группы
                    (_freeStudents$student = freeStudents.students).push.apply(_freeStudents$student, _toConsumableArray(groupToDelete.students));
                    // Отправляем данные о новой группе на сервер
                    xhr.send(JSON.stringify(groupsListForRed));
                }
            });

            redButton.addEventListener('click', function (event) {
                event.preventDefault();

                var nameChanger = document.createElement('input');
                nameChanger.value = this.parentElement.groupObj.name;
                nameChanger.classList.add('input_light-theme', 'groups-change-interface__name-changer');

                var changeButton = document.createElement('button');
                changeButton.classList.add('button_dark-theme', 'groups-change-interface__btn');

                var list = makeListForSelect(this.parentElement.groupObj);
                list.classList.add('groups-change-interface__list');

                changeButton.innerHTML = 'Изменить группу';
                changeButton.addEventListener('click', function (event) {
                    event.preventDefault();
                    var enteredName = this.parentElement.firstElementChild.value;
                    if (enteredName) {
                        var xhr = new XMLHttpRequest();
                        xhr.overrideMimeType('application/json');
                        xhr.open('POST', window.location.origin + '/child-app/forTeacher/groups.html', true);
                        xhr.onload = function () {
                            if (xhr.status === 200) {
                                location.reload(true);
                            } else {
                                notify(true, '\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0438', 'failure');
                            }
                        };

                        var allStudents = [].concat(_toConsumableArray(list.children));
                        var selectedStudents = allStudents.filter(function (opt) {
                            return opt.selected;
                        }).map(function (_ref3) {
                            var studentObj = _ref3.studentObj;
                            return studentObj;
                        });
                        var unseectedStudents = allStudents.filter(function (opt) {
                            return !opt.selected;
                        }).map(function (_ref4) {
                            var studentObj = _ref4.studentObj;
                            return studentObj;
                        });

                        groupObj.students = selectedStudents;
                        groupsListForRed[groupsListForRed.length - 1].students = unseectedStudents;
                        groupObj.name = enteredName;
                        xhr.send(JSON.stringify(groupsListForRed));
                    } else {
                        notify(true, 'Пожалуйста введите имя группы', 'warning');
                    }
                });

                var holder = createGroupChangingInterface(nameChanger, list, changeButton);

                placeForData.replaceChild(holder, placeForData.firstElementChild);
            });
        }
        groupHolder.innerHTML = '<input class="group__checkbox" type="checkbox" name="group" id="group-' + groupObj.id + '">\n             <label class="group__name" for="group-' + groupObj.id + '">' + groupObj.name + '</label>';
        groupObj.students.forEach(function (student) {
            return createStudent(student).forEach(function (el) {
                return group.appendChild(el);
            });
        });
        groupHolder.appendChild(group);

        return groupHolder;
    };

    var createStudent = function createStudent(studentObj) {
        var studentRadioContainer = document.createElement('div');
        var studentLabelContainer = document.createElement('div');
        studentRadioContainer.innerHTML = '<input type="radio" name="student" id="student-' + studentObj.id + '" class="student__radio">';
        studentLabelContainer.innerHTML = '<label for="student-' + studentObj.id + '" class="group__student">' + studentObj.name + '</label>';

        return [studentRadioContainer.firstElementChild, studentLabelContainer.firstElementChild];
    };

    var createPersonalTable = function createPersonalTable(tableData) {
        var thead = document.createElement('thead');
        var tbody = document.createElement('tbody');
        var table = document.createElement('table');
        table.className = 'stats__table table_light-theme';
        thead.innerHTML = '<tr class="stats__row"><th class="stats__data table_light-theme font-weight-bold">№</th>\n' + '<th class="stats__data table_light-theme font-weight-bold">Результат</th>\n' + '<th class="stats__data table_light-theme font-weight-bold">Тема</th>\n' + '<th class="stats__data table_light-theme font-weight-bold">Скорость</th>\n' + '<th class="stats__data table_light-theme font-weight-bold">Разрядность</th>\n' + '<th class="stats__data table_light-theme font-weight-bold">Количество</th>' + '<th class="stats__data table_light-theme font-weight-bold">Тип рейтинга</th>' + '</tr>';
        tableData.forEach(function (line, number) {
            var row = document.createElement('tr');
            row.innerHTML = '<td class="stats__data table_light-theme">' + (number + 1) + '</td>\n            <td class="stats__data table_light-theme ' + (line.success ? 'success' : 'failure') + '">' + (line.success ? 'Успех' : 'Неудача') + '</td>\n            <td class="stats__data table_light-theme">' + line.theme + '</td>\n            <td class="stats__data table_light-theme">' + (line.speed + 'сек') + '</td>\n            <td class="stats__data table_light-theme">' + line.capacity + '</td>\n            <td class="stats__data table_light-theme">' + line.quantity + '</td>\n            <td class="stats__data table_light-theme">' + line.rating + '</td>';
            tbody.appendChild(row);
        });
        table.appendChild(thead);
        table.appendChild(tbody);
        return table;
    };

    var makeListForSelect = function makeListForSelect() {
        var group = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        var list = document.createElement('select');
        list.multiple = true;
        var freeStudents = groupsListForRed[groupsListForRed.length - 1].students;
        if (group) {
            group.students.forEach(function (student) {
                return makeOptions(student, true);
            });
        }
        freeStudents.forEach(function (student) {
            return makeOptions(student);
        });
        function makeOptions(student) {
            var isSelected = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var option = document.createElement('option');
            option.innerHTML = student.name;
            option.studentObj = student;
            option.value = student.id;
            option.selected = isSelected ? true : '';
            list.appendChild(option);
        }

        return list;
    };

    var createGroupChangingInterface = function createGroupChangingInterface(nameChanger, list, button) {
        var holder = document.createElement('div');
        holder.classList.add('groups-change-interface');
        holder.appendChild(nameChanger);
        holder.appendChild(list);
        holder.appendChild(button);
        Object.assign(holder.style, {
            animationName: 'fade',
            animationDuration: '1s'
        });

        return holder;
    };

    var loadingPlaceholder = document.createElement('div');
    loadingPlaceholder.className = 'loading-placeholder';

    var groupsListForRed = void 0;
    var createButton = document.querySelector('.groups__create-btn');
    var placeForData = document.querySelector('.action-place');
    var groupsListElement = document.querySelector('.groups__list');

    var promiseGroupList = getGroupsData(window.location.origin + '/child-app/testData/groupList.json');
    promiseGroupList.then(function (groupList) {
        groupsListForRed = groupList;
        groupsListElement.removeChild(groupsListElement.firstElementChild);
        groupList.forEach(function (group) {
            return groupsListElement.insertBefore(createGroup(group), groupsListElement.lastElementChild);
        });

        var groups = document.querySelectorAll('.group-holder');
        var studentRadios = document.querySelectorAll('.student__radio');

        [].concat(_toConsumableArray(studentRadios)).forEach(function (radio) {
            return radio.addEventListener('change', function () {
                if (this.checked) {
                    placeForData.replaceChild(loadingPlaceholder, placeForData.firstElementChild);

                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', window.location.origin + '/statsTable', true);
                    xhr.setRequestHeader('Content-Type', 'application/json');

                    xhr.onload = function () {
                        if (xhr.status === 200) {
                            var table = createPersonalTable(JSON.parse(xhr.responseText).data);
                            table.style.animationName = 'fade';
                            table.style.animationDuration = '1s';
                            placeForData.replaceChild(table, placeForData.firstElementChild);
                        } else {
                            throw new Error('\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438 \u043E \u0433\u0440\u0443\u043F\u043F\u0430\u0445 (' + xhr.status + ')');
                        }
                    };
                    xhr.onerror = function () {
                        throw new Error('\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438 \u043E \u0433\u0440\u0443\u043F\u043F\u0430\u0445 (' + xhr.status + ')');
                    };

                    xhr.send();
                }
            });
        });
        [].concat(_toConsumableArray(groups)).forEach(function (group) {
            var groupList = group.querySelector('.group');
            var showGroup = group.querySelector('.group__checkbox');
            var height = calculateHeight(groupList);

            showGroup.addEventListener('change', function () {
                if (this.checked) {
                    groupList.style.maxHeight = String(height) + 'px';
                } else {
                    groupList.style.maxHeight = '0';
                }
            });
        });

        createButton.disabled = '';

        createButton.addEventListener('click', function (event) {
            event.preventDefault();

            var nameChanger = document.createElement('input');
            nameChanger.placeholder = 'Название группы...';
            nameChanger.classList.add('input_light-theme', 'groups-change-interface__name-changer');

            var changeButton = document.createElement('button');
            changeButton.innerHTML = 'Создать';
            changeButton.classList.add('button_dark-theme', 'groups-change-interface__btn');

            changeButton.addEventListener('click', function (evt) {
                evt.preventDefault();
                if (nameChanger.value) {
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', window.location.origin + '/child-app/forTeacher/groups.html', true);
                    xhr.setRequestHeader('Content-Type', 'application/json');

                    xhr.onload = function () {
                        if (xhr.status === 200) {
                            location.reload(true);
                        } else {
                            notify(true, '\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u0438', 'failure');
                        }
                    };

                    var allStudents = [].concat(_toConsumableArray(list.children));
                    var newGroup = {
                        name: nameChanger.value,
                        students: allStudents.filter(function (opt) {
                            return opt.selected;
                        }).map(function (_ref) {
                            var studentObj = _ref.studentObj;
                            return studentObj;
                        })
                    };
                    var freeGroup = {
                        name: 'Не распределено',
                        free: true,
                        students: allStudents.filter(function (opt) {
                            return !opt.selected;
                        }).map(function (_ref2) {
                            var studentObj = _ref2.studentObj;
                            return studentObj;
                        })
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

            var list = makeListForSelect();
            list.classList.add('groups-change-interface__list');

            var holder = createGroupChangingInterface(nameChanger, list, changeButton);

            placeForData.replaceChild(holder, placeForData.firstElementChild);
        });
    }).catch(function (err) {
        notify(true, '\u0427\u0442\u043E-\u0442\u043E \u043F\u043E\u0448\u043B\u043E \u043D\u0435 \u0442\u0430\u043A: ' + err.message, 'failure');
    });
}

var bgColors = {
    success: '#6eff95',
    failure: '#ff0000',
    warning: '#fcff5a'
};
var colors = {
    success: '#00a919',
    failure: '#850000',
    warning: '#de8004'
};
var currentZindex = 20;

/**
 * Выводит уведомление, позиционированное сверху экрана и фиксированное при необходимости, в указанный элемент
 * @param {Boolean} isFixed
 * @param {String} message
 * @param {String} type
 * @param {HTMLElement} element
 */
function notify(isFixed, message, type) {
    var element = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : document.body;

    if (type !== 'success' && type !== 'failure' && type !== 'warning') {
        throw new TypeError('Неверное имя типа. Принимаются только "success", "warning" или "failure"');
    }
    var messageWindow = document.createElement('div');
    messageWindow.title = 'Скрыть';
    messageWindow.innerHTML = message;

    var notifyStyles = {
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

    var delayedRemoval = setTimeout(function () {
        element.removeChild(messageWindow);
    }, 5000);

    messageWindow.addEventListener('click', function () {
        element.removeChild(messageWindow);
        clearTimeout(delayedRemoval);
    });

    element.insertBefore(messageWindow, element.firstElementChild);
}
//# sourceMappingURL=groupsControl.js.map