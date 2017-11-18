let openButtons = document.querySelectorAll('.main-settings__section-opener');

for (let button of openButtons) {
    button.addEventListener('click', function (event) {
        event.preventDefault();
        let section = this.nextElementSibling;
        if (!section.style.display) {
            section.style.display = 'flex';
        } else {
            section.style.display = '';
        }
    })
}