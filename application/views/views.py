from flask import render_template, request, make_response
from hashlib import sha256
from json import dumps, loads
from uuid import uuid4

from application import app, db_handler, storage
from application.number_generator import generate


@app.route('/', methods=['GET', 'POST'])
@app.route('/index.html', methods=['GET', 'POST'])
def index():
    return render_template('index.html')


@app.route('/game.html', methods=['GET', 'POST'])
def game():
    return render_template('game.html')


@app.route('/login.html', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        password_hash = sha256(request.form['pass'].encode()).hexdigest()
        if db_handler.student_exist(request.form['login'], password_hash):
            resp = make_response(render_template('index.html'))
            current_token = uuid4()
            student_id = db_handler.get_student_id(request.form['login']) # Should return id based on login
            storage.set_student_id(current_token, student_id)
            resp.set_cookie('auth_token', current_token)
            return resp
    return render_template('login.html')


@app.route('/reg.html', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        password_hash = sha256(request.form['pass'].encode()).hexdigest()
        db_handler.register_student(request.form['login'], password_hash,
                                    (None, None, None, None, None))
        return  # Жду заглушку
    return render_template('reg.html')


@app.route('/reset.html', methods=['GET', 'POST'])
def reset():
    return render_template('reset.html')


@app.route('/homework', methods=['GET', 'POST'])
def homework():
    if request.method == 'GET':
        id_ = storage.get_student_id(request.cookies.get('auth_token'))
        res = db_handler.fetch_recent_history(id_)
        if res:
            return dumps(res)
        else:
            return '', 404
    else:
        data = loads(request.data.decode())
        

@app.route('/game-result', methods=['POST'])
def game_result():
    form_data = loads(request.data.decode())
    if form_data['result'] == 'success':
        db_handler.update_rating_of_student(
            storage.get_student_id(request.cookies['auth_token']),
            storage.set_student_rating_delta(request.cookies['auth_token'])
        )
    return


@app.route('/homework-result', methods=['POST'])
def homework_result():
    form_data = loads(request.data.decode())
    if form_data['result'] == 'success':
        db_handler.update_rating_of_student(
            storage.get_student_id(request.cookies['auth_token']),
            storage.set_student_rating_delta(request.cookies['auth_token'])
        )
    return


@app.route('/generator', methods=['POST'])
def gen():
    form_data = loads(request.data.decode())
    theme_options, speed, capacity, quantity = form_data['themeOptions'], \
                                               float(form_data['speed']), \
                                               int(form_data['capacity']), \
                                               int(form_data['quantity'])
    list_of_numbers, rating = generate(theme_options, speed, capacity, quantity)
    if 'auth_token' in request.cookies:
        storage.set_student_rating_delta(request.cookies['auth_token'], rating)
    return dumps(list_of_numbers)
