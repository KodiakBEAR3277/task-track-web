from flask import Flask
from flask_mysqldb import MySQL
from flask_cors import CORS
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

mysql = MySQL()

def create_app():
    app = Flask(__name__)
    
    # Load config with debug logs
    app.config.update(
        MYSQL_HOST='localhost',
        MYSQL_USER='root',
        MYSQL_PASSWORD='',
        MYSQL_DB='task-tracker-db',  # Updated database name
        JWT_SECRET_KEY='dev-key'
    )
    logger.debug(f"MySQL Config: {app.config['MYSQL_HOST']}, {app.config['MYSQL_DB']}")
    
    CORS(app)
    
    try:
        mysql.init_app(app)
        # Test connection
        with app.app_context():
            cur = mysql.connection.cursor()
            cur.execute('SELECT 1')
            cur.close()
        logger.debug("MySQL connection successful")
    except Exception as e:
        logger.error(f"MySQL connection failed: {str(e)}")
        raise

    from app.routes import api
    app.register_blueprint(api, url_prefix='/api')
    
    logger.debug("Routes registered:", app.url_map)

    return app