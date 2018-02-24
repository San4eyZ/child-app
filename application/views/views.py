from flask import render_template, request, jsonify

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


@app.route('/generator', methods=['POST'])
def gen():
    form_data = request.data
    themes, levels, capacity, quantity = form_data['themes'], \
                                         form_data['levels'], \
                                         form_data['capacity'], \
                                         form_data['quantity']
    return jsonify(generate(themes, levels, capacity, quantity))
