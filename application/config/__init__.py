import py

from application.config.utils import parse_yml_conf

YML_CONFIG_FILE = py.path.local(__file__).dirpath('../..').join('config.yml')

yml_conf = parse_yml_conf(YML_CONFIG_FILE)
MYSQL_HOST = str(yml_conf['db_settings']['host'])
MYSQL_USER = yml_conf['db_settings']['user']
MYSQL_PASSWORD = yml_conf['db_settings']['password']
DB_NAME = yml_conf['db_settings']['db_name']

DB_CREATE_COMMAND = '{} --user=%s --password=%s --execute="CREATE DATABASE %s;"' \
                    % (MYSQL_USER, MYSQL_PASSWORD, DB_NAME)
