'use strict';

var openButtons = document.querySelectorAll('.main-settings__section-opener');

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
    for (var _iterator = openButtons[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var button = _step.value;

        button.addEventListener('click', function (event) {
            event.preventDefault();
            var section = this.nextElementSibling;
            if (!section.style.display) {
                section.style.display = 'flex';
            } else {
                section.style.display = '';
            }
        });
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
//# sourceMappingURL=settingsControl.js.map