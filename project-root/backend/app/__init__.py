from flask import Flask
from flask_mysqldb import MySQL
from flask_cors import CORS
from dotenv import load_dotenv
import os

mysql = MySQL()

def create_app():
    load_dotenv()
    app = Flask(__name__)
    
    # MySQL Configuration
    app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
    app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
    app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
    app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

    CORS(app)
    mysql.init_app(app)

    # Register blueprints
    from .routes import api
    app.register_blueprint(api, url_prefix='/api')

    return app
