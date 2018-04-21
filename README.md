# Web application
Web application that will help children and others improve their numeracy skills.
## Installation.
You will need python >= 3.5 and pip preinstalled.
Run `pip install -r requirements.txt`

## Using.
Type `python launch.py`.
In your browser open `127.0.0.1:5000`

## Setting up database.
Open `config.yml` with any text editor and fill in parameters:
- `host` - db host. Supposed `127.0.0.1`
- `user` - user, which will be authenticated in db. Supposed `root`
- `password` - password, you typed in when installing mysqlserver(if Linux)
- `db_name` - name of database, you have created.
