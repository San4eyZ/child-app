import trafaret as t

from netaddr import IPAddress


def ipaddr(version):
    @t.Call
    def _ipaddr(value):
        try:
            if value:
                return IPAddress(value, version)
        except Exception as e:
            return t.DataError(e, value=value)
    return _ipaddr

db_settings = t.Dict({
    t.Key('host', optional=False): ipaddr(4),
    t.Key('user', optional=False): t.String,
    t.Key('password', optional=False): t.String,
    t.Key('db_name', optional=False): t.String,
})

config_trafaret = t.Dict({
    t.Key('db_settings', optional=False): db_settings
})
