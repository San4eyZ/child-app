'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
            group.innerHTML = '<button class="button_light-theme groups__delete-btn">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>\n                 <button class="button_light-theme groups__red-btn">\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C</button>\n                 <button class="button_light-theme groups__homework-btn">\u0417\u0430\u0434\u0430\u0442\u044C \u0437\u0430\u0434\u0430\u043D\u0438\u0435</button>';

            var freeStudents = groupsListForRed[groupsListForRed.length - 1];

            var deleteButton = group.querySelector('.groups__delete-btn');
            var redButton = group.querySelector('.groups__red-btn');
            var homeworkButton = group.querySelector('.groups__homework-btn');

            homeworkButton.addEventListener('click', function (event) {
                event.preventDefault();

                var checkedStudent = groupsListElement.querySelector('.student__radio:checked');
                if (checkedStudent) {
                    checkedStudent.checked = false;
                }

                var title = document.createElement('span');
                title.classList.add('settings__label');
                title.innerHTML = 'Выберите учеников:';

                var list = makeListForSelect(false, groupObj);
                list.classList.add('groups-change-interface__list');

                var options = document.createElement('section');
                options.classList.add('settings__main-window');
                options.innerHTML = optionsForHomeworkTemplate;

                var setButton = document.createElement('button');
                setButton.innerHTML = 'Задать';
                setButton.classList.add('button_dark-theme', 'groups-change-interface__btn');

                var holder = document.createElement('div');
                holder.classList.add('groups-change-interface');
                holder.appendChild(title);
                holder.appendChild(list);
                holder.appendChild(options);
                holder.appendChild(setButton);
                Object.assign(holder.style, {
                    animationName: 'fade',
                    animationDuration: '1s'
                });

                var incButtons = holder.querySelectorAll('.button_inc');
                var decButtons = holder.querySelectorAll('.button_dec');
                var fields = holder.querySelectorAll('.settings__input');
                var themeCheckers = [].concat(_toConsumableArray(holder.querySelectorAll('.settings__theme-option')));

                themeCheckers.forEach(function (checker) {
                    return checker.addEventListener('change', function (event) {
                        var _this = this;

                        var neighbourCheckers = [].concat(_toConsumableArray(this.parentElement.getElementsByTagName('input')));
                        var prevCheckers = neighbourCheckers.slice(0, neighbourCheckers.indexOf(this));

                        prevCheckers.forEach(function (checker) {
                            checker.checked = _this.checked;
                        });
                    });
                });

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = incButtons[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var incButton = _step.value;

                        incButton.addEventListener('click', inputControl.bind(null, incButton, 'inc'));
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = decButtons[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var decButton = _step2.value;

                        decButton.addEventListener('click', inputControl.bind(null, decButton, 'dec'));
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                var initialValue = void 0;
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = fields[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var field = _step3.value;

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
                                this.value = isNaN(Number(this.value)) ? this.min + ' сек' : Math.round(Number(this.value) * 10) / 10 + ' сек';
                            }
                        });
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }

                setButton.addEventListener('click', function (event) {
                    event.preventDefault();
                    event.preventDefault();
                    event.preventDefault();

                    var homeworkObj = {
                        selectedStudents: [].concat(_toConsumableArray(list.querySelectorAll('option:checked'))).map(function (_ref3) {
                            var value = _ref3.value;
                            return value;
                        }),
                        themeOption: [].concat(_toConsumableArray(options.querySelectorAll('.settings__theme-option:checked'))).map(function (_ref4) {
                            var value = _ref4.value;
                            return value.split('_');
                        }),
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

                    var xhr = new XMLHttpRequest();

                    xhr.open('POST', window.location.origin + '/homework', true);
                    xhr.setRequestHeader('Content-Type', 'application/json');

                    xhr.onload = function () {
                        if (xhr.status === 200) {
                            notify(true, 'Задание задано', 'success');
                        } else {
                            notify(true, '\u0427\u0442\u043E-\u0442\u043E \u043F\u043E\u0448\u043B\u043E \u043D\u0435 \u0442\u0430\u043A. \u041A\u043E\u0434 \u043E\u0448\u0438\u0431\u043A\u0438: (' + xhr.status + ')', 'failure');
                        }
                    };
                    xhr.onerror = function () {
                        notify(true, '\u0427\u0442\u043E-\u0442\u043E \u043F\u043E\u0448\u043B\u043E \u043D\u0435 \u0442\u0430\u043A. \u041A\u043E\u0434 \u043E\u0448\u0438\u0431\u043A\u0438: (' + xhr.status + ')', 'failure');
                    };

                    xhr.send(JSON.stringify(homeworkObj));
                });

                placeForData.replaceChild(holder, placeForData.firstElementChild);
            });
            // Удаление группы
            deleteButton.addEventListener('click', function (event) {
                event.preventDefault();
                notify('true', 'Вы действительно хотите удалить группу?', 'confirm', function () {
                    var _freeStudents$student;

                    var xhr = new XMLHttpRequest();
                    xhr.overrideMimeType('application/json');
                    xhr.open('DELETE', window.location.origin + '/groups', true);
                    xhr.onload = function () {
                        if (xhr.status === 200) {
                            location.reload(true);
                        } else {
                            notify(true, '\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0438 (' + xhr.status + ')', 'failure');
                            freeStudents.students = currentFreeStudents;
                        }
                    };
                    xhr.onerror = function () {
                        notify(true, '\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0438 (' + xhr.status + ')', 'failure');
                        freeStudents.students = currentFreeStudents;
                    };
                    // Спасаем текущее состояние
                    var currentFreeStudents = freeStudents.students.slice();
                    // Создаем новую группу для отправки
                    var newGroupList = groupsListForRed.filter(function (obj) {
                        return obj !== groupObj;
                    });
                    // Освобождаем учеников из удаленной группы
                    (_freeStudents$student = freeStudents.students).push.apply(_freeStudents$student, _toConsumableArray(groupObj.students));
                    // Отправляем данные о новой группе на сервер
                    xhr.send(JSON.stringify(newGroupList));
                });
            });

            redButton.addEventListener('click', function (event) {
                event.preventDefault();

                var checkedStudent = groupsListElement.querySelector('.student__radio:checked');
                if (checkedStudent) {
                    checkedStudent.checked = false;
                }

                var nameChanger = document.createElement('input');
                nameChanger.value = this.parentElement.groupObj.name;
                nameChanger.classList.add('input_light-theme', 'groups-change-interface__name-changer');

                var changeButton = document.createElement('button');
                changeButton.classList.add('button_dark-theme', 'groups-change-interface__btn');

                var list = makeListForSelect(true, groupObj);
                list.classList.add('groups-change-interface__list');

                changeButton.innerHTML = 'Изменить группу';
                changeButton.addEventListener('click', function (event) {
                    event.preventDefault();
                    var enteredName = this.parentElement.firstElementChild.value;
                    if (enteredName) {
                        var currentStudents = groupObj.students.slice();
                        var _currentFreeStudents2 = freeStudents.students.slice();

                        var xhr = new XMLHttpRequest();
                        xhr.overrideMimeType('application/json');
                        xhr.open('PATCH', window.location.origin + '/groups', true);
                        xhr.onload = function () {
                            if (xhr.status === 200) {
                                location.reload(true);
                            } else {
                                notify(true, '\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0438 (' + xhr.status + ')', 'failure');
                                groupObj.students = currentStudents;
                                freeStudents.students = _currentFreeStudents2;
                            }
                        };

                        xhr.onerror = function () {
                            notify(true, '\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0438 (' + xhr.status + ')', 'failure');
                            groupObj.students = currentStudents;
                            freeStudents.students = _currentFreeStudents2;
                        };

                        var allStudents = [].concat(_toConsumableArray(list.children));
                        var selectedStudents = allStudents.filter(function (opt) {
                            return opt.selected;
                        }).map(function (_ref5) {
                            var studentObj = _ref5.studentObj;
                            return studentObj;
                        });
                        var unseectedStudents = allStudents.filter(function (opt) {
                            return !opt.selected;
                        }).map(function (_ref6) {
                            var studentObj = _ref6.studentObj;
                            return studentObj;
                        });

                        groupObj.students = selectedStudents;
                        freeStudents.students = unseectedStudents;
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
        studentRadioContainer.innerHTML = '<input type="radio" name="student" id="student-' + studentObj.id + '" class="student__radio" data-id="' + studentObj.id + '">';
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

    var makeListForSelect = function makeListForSelect(isWithFree) {
        var group = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        if (!isWithFree && !group) {
            throw new Error('\u0421\u043F\u0438\u0441\u043E\u043A \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u043F\u0443\u0441\u0442\u044B\u043C: \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u044B\u0435 - ' + isWithFree + ', \u0433\u0440\u0443\u043F\u043F\u0430 - ' + group);
        }
        var list = document.createElement('select');
        list.multiple = true;
        var freeStudents = groupsListForRed[groupsListForRed.length - 1].students;
        if (group) {
            var og = document.createElement('optgroup');
            og.label = group.name;
            group.students.forEach(function (student) {
                return makeOptions(student, og, true);
            });
            list.appendChild(og);
        }
        if (isWithFree) {
            var freeOg = document.createElement('optgroup');
            freeOg.label = groupsListForRed[groupsListForRed.length - 1].name;
            freeStudents.forEach(function (student) {
                return makeOptions(student, freeOg);
            });
            list.appendChild(freeOg);
        }

        function makeOptions(student, optgroup) {
            var isSelected = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            var option = document.createElement('option');
            option.innerHTML = student.name;
            option.studentObj = student;
            option.value = student.id;
            option.selected = isSelected ? true : '';
            optgroup.appendChild(option);
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
    // TODO Изменить запрос
    var promiseGroupList = getGroupsData(window.location.origin + '/groups');
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
                    xhr.open('GET', window.location.origin + '/stats-table?id=' + radio.dataset.id, true);
                    xhr.setRequestHeader('Content-Type', 'application/json');

                    xhr.onload = function () {
                        if (xhr.status === 200) {
                            var table = createPersonalTable(JSON.parse(xhr.responseText));
                            table.style.animationName = 'fade';
                            table.style.animationDuration = '1s';
                            placeForData.replaceChild(table, placeForData.firstElementChild);
                        } else {
                            notify(true, '\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438 \u043E\u0431 \u0443\u0447\u0435\u043D\u0438\u043A\u0435 (' + xhr.status + ')', 'failure');
                        }
                    };
                    xhr.onerror = function () {
                        notify(true, '\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438 \u043E\u0431 \u0443\u0447\u0435\u043D\u0438\u043A\u0435 (' + xhr.status + ')', 'failure');
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

            var checkedStudent = groupsListElement.querySelector('.student__radio:checked');
            if (checkedStudent) {
                checkedStudent.checked = false;
            }

            var nameChanger = document.createElement('input');
            nameChanger.placeholder = 'Название группы...';
            nameChanger.classList.add('input_light-theme', 'groups-change-interface__name-changer');

            var changeButton = document.createElement('button');
            changeButton.innerHTML = 'Создать';
            changeButton.classList.add('button_dark-theme', 'groups-change-interface__btn');

            changeButton.addEventListener('click', function (evt) {
                evt.preventDefault();
                if (nameChanger.value) {
                    var _currentFreeStudents = groupsListForRed[groupsListForRed.length - 1].students.slice();

                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', window.location.origin + '/groups', true);
                    xhr.setRequestHeader('Content-Type', 'application/json');

                    xhr.onload = function () {
                        if (xhr.status === 200) {
                            location.reload(true);
                        } else {
                            notify(true, '\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u0438 (' + xhr.status + ')', 'failure');
                            groupsListForRed[groupsListForRed.length - 1].students = _currentFreeStudents;
                        }
                    };

                    xhr.onerror = function () {
                        notify(true, '\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u0438 (' + xhr.status + ')', 'failure');
                        groupsListForRed[groupsListForRed.length - 1].students = _currentFreeStudents;
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
                        name: 'Не распределенные',
                        free: true,
                        students: allStudents.filter(function (opt) {
                            return !opt.selected;
                        }).map(function (_ref2) {
                            var studentObj = _ref2.studentObj;
                            return studentObj;
                        })
                    };
                    var newGroupList = groupsListForRed.slice();
                    newGroupList.pop();
                    // TODO Придумать что-нибудь с id или оставить так как есть
                    if (newGroupList.length) {
                        newGroup.id = newGroupList[newGroupList.length - 1].id + 1;
                    } else {
                        newGroup.id = 1;
                    }
                    newGroupList.push(newGroup, freeGroup);
                    xhr.send(JSON.stringify(newGroupList));
                } else {
                    notify(true, 'Пожалуйста введите имя шруппы', 'warning');
                }
            });

            var list = makeListForSelect(true);
            list.classList.add('groups-change-interface__list');

            var holder = createGroupChangingInterface(nameChanger, list, changeButton);

            placeForData.replaceChild(holder, placeForData.firstElementChild);
        });
    }).catch(function (err) {
        notify(true, '\u0427\u0442\u043E-\u0442\u043E \u043F\u043E\u0448\u043B\u043E \u043D\u0435 \u0442\u0430\u043A: ' + err.message, 'failure');
    });
}

function calculateHeight(element) {
    return [].concat(_toConsumableArray(element.children)).reduce(function (init, cur) {
        var computedStyle = window.getComputedStyle(cur);
        return init + parseInt(computedStyle.height) + parseInt(computedStyle.marginTop) + parseInt(computedStyle.marginBottom) + parseInt(computedStyle.borderTopWidth) + parseInt(computedStyle.borderBottomWidth) + parseInt(computedStyle.paddingBottom) + parseInt(computedStyle.paddingTop);
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
    return '' + Math.round((Number(value) + Number(amount)) * 10) / 10;
}

/*   Контроль полей ввода   */
function inputControl(button, role, event) {
    event.preventDefault();
    var controlledInput = role === 'inc' ? button.previousElementSibling : button.nextElementSibling;
    var step = role === 'inc' ? controlledInput.step : -controlledInput.step;

    var _controlledInput$valu = controlledInput.value.split(' '),
        _controlledInput$valu2 = _slicedToArray(_controlledInput$valu, 2),
        number = _controlledInput$valu2[0],
        rest = _controlledInput$valu2[1];

    var newNumber = incValue(number, step);
    if (Number(newNumber) <= Number(controlledInput.max) && Number(newNumber) >= Number(controlledInput.min)) {
        controlledInput.value = rest ? newNumber + (' ' + rest) : newNumber;
    }
}

var optionsForHomeworkTemplate = '<div class="settings__theme settings__item">\n' + '                        <span class="settings__label col-12">\n' + '                            Выберите тему:\n' + '                        </span>\n' + '                        <div class="settings__theme-holder">\n' + '                            <span class="settings__theme-name">Просто</span>\n' + '                            <div class="settings__theme-placeholder"></div>\n' + '                            <input type="checkbox" name="theme" id="theme0_1" class="settings__theme-option" value="0_1">\n' + '                            <label for="theme0_1" class="settings__theme-label">2</label>\n' + '                            <input type="checkbox" name="theme" id="theme0_2" class="settings__theme-option" value="0_2">\n' + '                            <label for="theme0_2" class="settings__theme-label">3</label>\n' + '                            <input type="checkbox" name="theme" id="theme0_3" class="settings__theme-option" value="0_3">\n' + '                            <label for="theme0_3" class="settings__theme-label">4</label>\n' + '                            <input type="checkbox" name="theme" id="theme0_4" class="settings__theme-option" value="0_4">\n' + '                            <label for="theme0_4" class="settings__theme-label">5</label>\n' + '                            <input type="checkbox" name="theme" id="theme0_5" class="settings__theme-option" value="0_5">\n' + '                            <label for="theme0_5" class="settings__theme-label">6</label>\n' + '                            <input type="checkbox" name="theme" id="theme0_6" class="settings__theme-option" value="0_6">\n' + '                            <label for="theme0_6" class="settings__theme-label">7</label>\n' + '                            <input type="checkbox" name="theme" id="theme0_7" class="settings__theme-option" value="0_7">\n' + '                            <label for="theme0_7" class="settings__theme-label">8</label>\n' + '                            <input type="checkbox" name="theme" id="theme0_8" class="settings__theme-option" value="0_8">\n' + '                            <label for="theme0_8" class="settings__theme-label">9</label>\n' + '                        </div>\n' + '                        <div class="settings__theme-holder">\n' + '                            <span class="settings__theme-name">Друг</span>\n' + '                            <input type="checkbox" name="theme" id="theme1_3" class="settings__theme-option" value="1_3">\n' + '                            <label for="theme1_3" class="settings__theme-label">4</label>\n' + '                            <input type="checkbox" name="theme" id="theme1_2" class="settings__theme-option" value="1_2">\n' + '                            <label for="theme1_2" class="settings__theme-label">3</label>\n' + '                            <input type="checkbox" name="theme" id="theme1_1" class="settings__theme-option" value="1_1">\n' + '                            <label for="theme1_1" class="settings__theme-label">2</label>\n' + '                            <input type="checkbox" name="theme" id="theme1_0" class="settings__theme-option" value="1_0">\n' + '                            <label for="theme1_0" class="settings__theme-label">1</label>\n' + '                        </div>\n' + '                        <div class="settings__theme-holder">\n' + '                            <span class="settings__theme-name">Брат</span>\n' + '                            <input type="checkbox" name="theme" id="theme2_8" class="settings__theme-option" value="2_8">\n' + '                            <label for="theme2_8" class="settings__theme-label">9</label>\n' + '                            <input type="checkbox" name="theme" id="theme2_7" class="settings__theme-option" value="2_7">\n' + '                            <label for="theme2_7" class="settings__theme-label">8</label>\n' + '                            <input type="checkbox" name="theme" id="theme2_6" class="settings__theme-option" value="2_6">\n' + '                            <label for="theme2_6" class="settings__theme-label">7</label>\n' + '                            <input type="checkbox" name="theme" id="theme2_5" class="settings__theme-option" value="2_5">\n' + '                            <label for="theme2_5" class="settings__theme-label">6</label>\n' + '                            <input type="checkbox" name="theme" id="theme2_4" class="settings__theme-option" value="2_4">\n' + '                            <label for="theme2_4" class="settings__theme-label">5</label>\n' + '                            <input type="checkbox" name="theme" id="theme2_3" class="settings__theme-option" value="2_3">\n' + '                            <label for="theme2_3" class="settings__theme-label">4</label>\n' + '                            <input type="checkbox" name="theme" id="theme2_2" class="settings__theme-option" value="2_2">\n' + '                            <label for="theme2_2" class="settings__theme-label">3</label>\n' + '                            <input type="checkbox" name="theme" id="theme2_1" class="settings__theme-option" value="2_1">\n' + '                            <label for="theme2_1" class="settings__theme-label">2</label>\n' + '                            <input type="checkbox" name="theme" id="theme2_0" class="settings__theme-option" value="2_0">\n' + '                            <label for="theme2_0" class="settings__theme-label">1</label>\n' + '                        </div>\n' + '                        <div class="settings__theme-holder">\n' + '                            <span class="settings__theme-name">Друг+Брат</span>\n' + '                            <div class="settings__theme-placeholder"></div>\n' + '                            <input type="checkbox" name="theme" id="theme3_5" class="settings__theme-option" value="3_5">\n' + '                            <label for="theme3_5" class="settings__theme-label">6</label>\n' + '                            <input type="checkbox" name="theme" id="theme3_6" class="settings__theme-option" value="3_6">\n' + '                            <label for="theme3_6" class="settings__theme-label">7</label>\n' + '                            <input type="checkbox" name="theme" id="theme3_7" class="settings__theme-option" value="3_7">\n' + '                            <label for="theme3_7" class="settings__theme-label">8</label>\n' + '                            <input type="checkbox" name="theme" id="theme3_8" class="settings__theme-option" value="3_8">\n' + '                            <label for="theme3_8" class="settings__theme-label">9</label>\n' + '                        </div>\n' + '                    </div>\n' + '                    <div class="settings__speed settings__item">\n' + '                        <span class="settings__label">\n' + '                            Настройте скорость смены чисел:\n' + '                        </span>\n' + '                        <div class="settings__buttons-wrapper">\n' + '                            <button class="settings__dec-speed button_dec button_dark-theme">-</button>\n' + '                            <input type="text" class="settings__speed-value input_light-theme settings__input"\n' + '                                   title="Настройте скорость смены чисел" value="0.5 сек" step="0.1" max="10" min="0.5">\n' + '                            <button class="settings__inc-speed button_inc button_dark-theme">+</button>\n' + '                        </div>\n' + '                    </div>\n' + '                    <div class="settings__capacity settings__item">\n' + '                        <span class="settings__label">\n' + '                            Настройте разрядность чисел:\n' + '                        </span>\n' + '                        <div class="settings__buttons-wrapper">\n' + '                            <button class="settings__dec-capacity button_dec button_dark-theme">-</button>\n' + '                            <input type="text" class="settings__capacity-value input_light-theme settings__input"\n' + '                                   title="Настройте разрядность чисел" value="2" step="1" min="1" max="5">\n' + '                            <button class="settings__inc-capacity button_inc button_dark-theme">+</button>\n' + '                        </div>\n' + '                    </div>\n' + '                    <div class="settings__quantity settings__item">\n' + '                        <span class="settings__label">\n' + '                            Настройте количество чисел:\n' + '                        </span>\n' + '                        <div class="settings__buttons-wrapper">\n' + '                            <button class="settings__dec-quantity button_dec button_dark-theme">-</button>\n' + '                            <input type="text" class="settings__quantity-value input_light-theme settings__input"\n' + '                                   title="Настройте количество чисел" step="1" value="3" min="1" max="1000">\n' + '                            <button class="settings__inc-quantity button_inc button_dark-theme">+</button>\n' + '                        </div>\n' + '                    </div>\n';
