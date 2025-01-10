from flask import Flask
from flask_mysqldb import MySQL
from flask_cors import CORS
import logging

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
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
    logger.debug(f"App config: {app.config}")
    
    CORS(app)
    mysql.init_app(app)
    
    from .routes import api
    app.register_blueprint(api, url_prefix='/api')
    
    logger.debug("API routes registered")
    # Debug route registration
    routes = [str(rule) for rule in app.url_map.iter_rules()]
    logger.debug(f"Available routes:")
    for route in routes:
        logger.debug(f"  {route}")

    return app