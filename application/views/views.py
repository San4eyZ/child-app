from flask import render_template

from application import app


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
