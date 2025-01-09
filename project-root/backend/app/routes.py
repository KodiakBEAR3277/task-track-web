from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from . import mysql

api = Blueprint('api', __name__)

@api.route('/login', methods=['POST'])
def login():
    data = request.json
    cur = mysql.connection.cursor()
    
    cur.execute("SELECT * FROM users WHERE email = %s", (data['email'],))
    user = cur.fetchone()
    cur.close()
    
    if user and check_password_hash(user[3], data['password']):
        token = jwt.encode({
            'user_id': user[0],
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, api.config['JWT_SECRET_KEY'])
        
        return jsonify({
            'token': token,
            'user_id': user[0],
            'username': user[1]
        })
    
    return jsonify({'message': 'Invalid credentials'}), 401

@api.route('/signup', methods=['POST'])
def signup():
    data = request.json
    hashed_password = generate_password_hash(data['password'])
    
    if create_user(data['username'], data['email'], hashed_password):
        return jsonify({'message': 'User created successfully'}), 201
    return jsonify({'message': 'Error creating user'}), 400