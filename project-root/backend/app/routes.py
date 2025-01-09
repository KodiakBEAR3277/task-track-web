from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
import logging
# Update import to use relative path
from app import mysql  # This imports mysql from the same directory's __init__.py

api = Blueprint('api', __name__)
logging.basicConfig(level=logging.DEBUG)

@api.route('/test-db', methods=['GET'])
def test_db():
    try:
        cur = mysql.connection.cursor()
        cur.execute('SELECT 1')
        result = cur.fetchone()
        cur.close()
        return jsonify({
            'status': 'success',
            'message': 'Database connection successful',
            'result': result
        })
    except Exception as e:
        logging.error(f"Database connection error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@api.route('/signup', methods=['POST'])
def signup():
    try:
        # Log incoming request
        data = request.get_json()
        logging.debug(f"[Signup] Raw request data: {request.data}")
        logging.debug(f"[Signup] Parsed JSON data: {data}")

        if not data or not all(k in data for k in ['email', 'password']):
            logging.error("[Signup] Missing required fields")
            return jsonify({'error': 'Missing required fields'}), 400

        cur = mysql.connection.cursor()
        try:
            # Debug database operations
            logging.debug("[Signup] Checking for existing email")
            cur.execute("SELECT * FROM users WHERE email = %s", (data['email'],))
            if cur.fetchone():
                logging.debug("[Signup] Email already exists")
                return jsonify({'error': 'Email already exists'}), 400

            # Debug user creation
            logging.debug("[Signup] Creating new user")
            hashed_password = generate_password_hash(data['password'])
            insert_query = "INSERT INTO users (email, password, role) VALUES (%s, %s, %s)"
            values = (data['email'], hashed_password, 'student')
            logging.debug(f"[Signup] Executing query: {insert_query} with values: {values}")
            
            cur.execute(insert_query, values)
            mysql.connection.commit()
            logging.debug("[Signup] User created successfully")
            
            return jsonify({'message': 'User created successfully'}), 201

        except Exception as db_error:
            mysql.connection.rollback()
            logging.error(f"[Signup] Database error: {str(db_error)}")
            return jsonify({'error': f'Database error: {str(db_error)}'}), 500
        finally:
            cur.close()
            
    except Exception as e:
        logging.error(f"[Signup] General error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@api.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or not all(k in data for k in ['email', 'password']):
            return jsonify({'error': 'Missing email or password'}), 400

        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM users WHERE email = %s", (data['email'],))
        user = cur.fetchone()
        cur.close()

        if user and check_password_hash(user[2], data['password']):
            token = jwt.encode({
                'user_id': user[0],
                'email': user[1],
                'role': user[3],
                'exp': datetime.utcnow() + timedelta(hours=24)
            }, current_app.config['JWT_SECRET_KEY'])

            return jsonify({
                'token': token,
                'user': {
                    'id': user[0],
                    'email': user[1],
                    'role': user[3]
                }
            })
        
        return jsonify({'error': 'Invalid credentials'}), 401
        
    except Exception as e:
        logging.error(f"Login error: {str(e)}")
        return jsonify({'error': str(e)}), 500