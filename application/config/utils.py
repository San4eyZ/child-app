import trafaret_config

from application.config.validator import config_trafaret


def parse_yml_conf(conf_name, trafaret=config_trafaret):
    try:
        return trafaret_config.read_and_validate(str(conf_name), trafaret)
    except trafaret_config.ConfigError as e:
        exit('\n' + '\n'.join(str(e) for e in e.errors))
