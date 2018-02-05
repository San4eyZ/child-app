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
        group.classList.add('group');
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

    var loadingPlaceholder = document.createElement('div');
    loadingPlaceholder.innerHTML = '<div class="loading-placeholder"></div>';
    loadingPlaceholder = loadingPlaceholder.firstElementChild;

    var groupsListElement = document.querySelector('.groups__list');

    var promiseGroupList = getGroupsData(window.location.origin + '/testData/groupList.json');
    promiseGroupList.then(function (groupList) {
        groupsListElement.removeChild(groupsListElement.firstElementChild);
        groupList.forEach(function (group) {
            return groupsListElement.appendChild(createGroup(group));
        });

        var groups = document.querySelectorAll('.group-holder');
        var studentRadios = document.querySelectorAll('.student__radio');
        var placeForData = document.querySelector('.action-place');

        [].concat(_toConsumableArray(studentRadios)).forEach(function (radio) {
            return radio.addEventListener('change', function () {
                if (this.checked) {
                    placeForData.replaceChild(loadingPlaceholder, placeForData.firstElementChild);
                    var xhr = new XMLHttpRequest();
                    xhr.overrideMimeType('application/json');
                    xhr.open('GET', window.location.origin + '/testData/statsTable.json', true);
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
            var students = groupList.querySelectorAll('.group__student');
            var showGroup = group.querySelector('.group__checkbox');
            var height = [].concat(_toConsumableArray(students)).reduce(function (init, cur) {
                var computedStyle = window.getComputedStyle(cur);
                return init + parseInt(computedStyle.height) + parseInt(computedStyle.marginTop) + parseInt(computedStyle.marginBottom) + parseInt(computedStyle.borderTopWidth) + parseInt(computedStyle.borderBottomWidth);
            }, 0);
            showGroup.addEventListener('change', function () {
                if (this.checked) {
                    groupList.style.maxHeight = String(height) + 'px';
                } else {
                    groupList.style.maxHeight = '0';
                }
            });
        });
    });
}
//# sourceMappingURL=groupsControl.js.map