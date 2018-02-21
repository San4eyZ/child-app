from flask import render_template

from application import app

TEACHER_PATH = '/forTeacher/%s'


@app.route(TEACHER_PATH % 'index.html', methods=['GET', 'POST'])
def teacher_index():
    return render_template(TEACHER_PATH % 'index.html')


@app.route(TEACHER_PATH % 'groups.html')
def groups():
    return render_template(TEACHER_PATH % 'groups.html')


@app.route(TEACHER_PATH % 'game.html')
def teacher_game():
    return render_template(TEACHER_PATH % 'game.html')


@app.route(TEACHER_PATH % 'settings.html', methods=['GET', 'POST'])
def teacher_settings():
    return render_template(TEACHER_PATH % 'settings.html')
