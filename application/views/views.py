from flask import render_template, request
from json import dumps, loads

from application import app
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
    return render_template('login.html')


@app.route('/reset.html', methods=['GET', 'POST'])
def reset():
    return render_template('reset.html')


@app.route('/gameResult', methods=['POST'])
def game_result():
    data = request
    return


@app.route('/generator', methods=['POST'])
def gen():
    form_data = loads(request.data.decode())
    theme_options, speed, capacity, quantity = form_data['themeOptions'], \
                                               float(form_data['speed']), \
                                               int(form_data['capacity']), \
                                               int(form_data['quantity'])
    list_of_numbers = generate(theme_options, speed, capacity, quantity)
    return dumps(list_of_numbers)
