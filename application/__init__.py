from flask import Flask

app = Flask(__name__)

from application.views import views
from application.views import teacher_views
from application.views import user_views
