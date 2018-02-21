from flask import render_template

from application import app

USER_PATH = '/forUser/%s'


@app.route(USER_PATH % 'index.html', methods=['GET', 'POST'])
def user_index():
    return render_template(USER_PATH % 'index.html')


@app.route(USER_PATH % 'homework.html')
def homework():
    return render_template(USER_PATH % 'homework.html')


@app.route(USER_PATH % 'game.html')
def user_game():
    return render_template(USER_PATH % 'game.html')


@app.route(USER_PATH % 'settings.html', methods=['GET', 'POST'])
def user_settings():
    return render_template(USER_PATH % 'settings.html')


@app.route(USER_PATH % 'stats.html')
def stats():
    return render_template(USER_PATH % 'stats.html')
