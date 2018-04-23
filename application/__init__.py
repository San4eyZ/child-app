from flask import Flask
from _mysql_exceptions import OperationalError

from application.db_worker import DBHandler
from application import config
from application.utils import Storage


def create_db_handler():
    return DBHandler(config.MYSQL_HOST, config.MYSQL_USER,
                     config.MYSQL_PASSWORD, config.DB_NAME)
try:
    db_handler = create_db_handler()
except OperationalError:
    from platform import system
    if system() == 'Linux':
        from time import sleep
        from shlex import split
        from subprocess import Popen, PIPE
        mysql_path = Popen(split('which mysql'), stdout=PIPE)\
            .stdout\
            .read()\
            .decode()\
            .strip()
        Popen(split(config.DB_CREATE_COMMAND.format(mysql_path)))
        sleep(1)
        db_handler = create_db_handler()
    else:
        exit('Please, create database specified in config file.')

app = Flask(__name__)
storage = Storage()

from application.views import views
from application.views import teacher_views
from application.views import user_views
