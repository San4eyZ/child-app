'use strict';

if (document.body.classList.contains('groups-body')) {
    var getGroupsData = function getGroupsData(url) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.overrideMimeType('application/json');
            xhr.open('GET', url, true);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                }
                if (String(xhr.status).match(/^4/)) {
                    reject(new Error('\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438 \u043E \u0433\u0440\u0443\u043F\u043F\u0430\u0445 (' + xhr.status + ')'));
                }
            };
            xhr.onerror = function () {
                reject(new Error('\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438 \u043E \u0433\u0440\u0443\u043F\u043F\u0430\u0445 (' + xhr.status + ')'));
            };
            xhr.send();
        });
    };

    var promiseGroupList = getGroupsData(window.location.origin + '/testData/groupList.json');
    promiseGroupList.then(function (obj) {
        return console.log(obj);
    }).catch(function (err) {
        return notify(true, '\u0427\u0442\u043E-\u0442\u043E \u043F\u043E\u0448\u043B\u043E \u043D\u0435 \u0442\u0430\u043A: ' + err.message, 'failure');
    });
}
//# sourceMappingURL=groupsControl.js.map