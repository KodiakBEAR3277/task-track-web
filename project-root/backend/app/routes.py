from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
import logging
# Fix import
from . import mysql  # Use relative import
from functools import wraps

api = Blueprint('api', __name__)
logging.basicConfig(level=logging.DEBUG)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            token = token.split(' ')[1]  # Remove 'Bearer ' prefix
            data = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=["HS256"])
            
            # Add user data to request
            request.user = {
                'id': data['user_id'],
                'email': data['email'],
                'role': data['role']
            }
            return f(*args, **kwargs)
        except Exception as e:
            logging.error(f"[AUTH] Token validation error: {e}")
            return jsonify({'error': 'Token is invalid'}), 401
    return decorated

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
        data = request.get_json()
        logging.debug(f"Signup data: {data}")

        if not data or not all(k in data for k in ['username', 'email', 'password']):
            return jsonify({'error': 'Missing required fields'}), 400

        cur = mysql.connection.cursor()
        try:
            cur.execute("SELECT * FROM users WHERE email = %s", (data['email'],))
            if cur.fetchone():
                return jsonify({'error': 'Email already exists'}), 400

            hashed_password = generate_password_hash(data['password'])
            cur.execute(
                "INSERT INTO users (username, email, password, role) VALUES (%s, %s, %s, %s)",
                (data['username'], data['email'], hashed_password, 'student')
            )
            mysql.connection.commit()
            return jsonify({'message': 'User created successfully'}), 201
        finally:
            cur.close()
    except Exception as e:
        logging.error(f"Signup error: {str(e)}")
        return jsonify({'error': f'Database error: {str(e)}'}), 500

@api.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        logging.debug(f"[LOGIN] Request data: {data}")

        cur = mysql.connection.cursor()
        try:
            cur.execute("SELECT * FROM users WHERE email = %s", (data['email'],))
            user = cur.fetchone()
            logging.debug(f"[LOGIN] Found user: {user}")

            if user and check_password_hash(user[3], data['password']):
                token = jwt.encode({
                    'user_id': user[0],
                    'username': user[1],
                    'email': user[2],
                    'role': user[4],
                    'exp': datetime.utcnow() + timedelta(hours=24)
                }, current_app.config['JWT_SECRET_KEY'])
                
                logging.debug("[LOGIN] Authentication successful - token generated")
                return jsonify({
                    'token': token,
                    'user': {
                        'id': user[0],
                        'username': user[1],
                        'email': user[2],
                        'role': user[4]
                    }
                })
            else:
                logging.debug("[LOGIN] User not found or password verification failed")

            return jsonify({'error': 'Invalid credentials'}), 401
        finally:
            cur.close()
    except Exception as e:
        logging.error(f"[LOGIN] Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@api.route('/protected', methods=['GET'])
@token_required
def protected():
    logging.debug("[PROTECTED] Route accessed")
    return jsonify({
        'message': 'Access granted to protected route',
        'status': 'success',
        'data': {
            'timestamp': datetime.utcnow().isoformat(),
            'endpoint': 'protected'
        }
    })

@api.route('/dashboard', methods=['GET'])
@token_required
def dashboard():
    logging.debug("[DASHBOARD] Route accessed")
    return jsonify({
        'message': 'Dashboard data retrieved',
        'status': 'success',
        'data': {
            'timestamp': datetime.utcnow().isoformat(),
            'endpoint': 'dashboard',
            'stats': {
                'total_tasks': 0,
                'completed_tasks': 0,
                'pending_tasks': 0
            }
        }
    })

@api.route('/profile', methods=['GET'])
@token_required
def profile():
    logging.debug("[PROFILE] Route accessed")
    return jsonify({
        'message': 'Profile data retrieved',
        'status': 'success',
        'data': {
            'timestamp': datetime.utcnow().isoformat(),
            'endpoint': 'profile',
            'user_info': {
                'email': 'test@test.com',
                'role': 'student'
            }
        }
    })

@api.route('/admin', methods=['GET'])
@token_required
def admin():
    logging.debug("[ADMIN] Route accessed")
    return jsonify({
        'message': 'Admin dashboard accessed',
        'status': 'success',
        'data': {
            'timestamp': datetime.utcnow().isoformat(),
            'endpoint': 'admin',
            'stats': {
                'total_users': 0,
                'active_users': 0
            }
        }
    })

@api.route('/student', methods=['GET'])
@token_required
def student_dashboard():
    logging.debug("[STUDENT] Route accessed")
    return jsonify({
        'message': 'Student dashboard accessed',
        'status': 'success',
        'data': {
            'timestamp': datetime.utcnow().isoformat(),
            'endpoint': 'student',
            'tasks': []
        }
    })

@api.route('/tasks', methods=['GET', 'POST'])
@token_required
def handle_tasks():
    if request.method == 'GET':
        cur = mysql.connection.cursor()
        try:
            cur.execute("""
                SELECT id, title, description, status, priority, 
                       due_date, created_at, updated_at 
                FROM tasks 
                WHERE user_id = %s 
                ORDER BY created_at DESC""", (request.user['id'],))
            tasks = cur.fetchall()
            formatted_tasks = [{
                'id': task[0],
                'title': task[1],
                'description': task[2],
                'status': task[3],
                'priority': task[4],
                'due_date': task[5].isoformat() if task[5] else None,
                'created_at': task[6].isoformat(),
                'updated_at': task[7].isoformat()
            } for task in tasks]
            
            return jsonify({
                'status': 'success',
                'data': {
                    'tasks': formatted_tasks,
                    'count': len(formatted_tasks)
                }
            })
        finally:
            cur.close()

@api.route('/tasks/<int:task_id>', methods=['GET', 'PUT', 'DELETE'])
@token_required
def handle_task(task_id):
    if request.method == 'GET':
        cur = mysql.connection.cursor()
        try:
            cur.execute("""
                SELECT id, title, description, status, priority, 
                       due_date, created_at, updated_at 
                FROM tasks 
                WHERE id = %s AND user_id = %s""", 
                (task_id, request.user['id']))
            task = cur.fetchone()
            if not task:
                return jsonify({'error': 'Task not found'}), 404
                
            return jsonify({
                'status': 'success',
                'data': {
                    'id': task[0],
                    'title': task[1],
                    'description': task[2],
                    'status': task[3],
                    'priority': task[4],
                    'due_date': task[5].isoformat() if task[5] else None,
                    'created_at': task[6].isoformat(),
                    'updated_at': task[7].isoformat()
                }
            })
        except Exception as e:
            logging.error(f"[TASK-GET] Error: {str(e)}")
            return jsonify({'error': str(e)}), 500
        finally:
            cur.close()
            
    elif request.method == 'PUT':
        data = request.get_json()
        cur = mysql.connection.cursor()
        try:
            cur.execute("""
                UPDATE tasks 
                SET title = %s, description = %s, status = %s, 
                    priority = %s, due_date = %s 
                WHERE id = %s""",
                (data['title'], data['description'], data['status'],
                 data.get('priority', 'medium'), data['due_date'], task_id))
            mysql.connection.commit()
            return jsonify({'message': 'Task updated successfully'})
        except Exception as e:
            mysql.connection.rollback()
            logging.error(f"[TASK-UPDATE] Error: {str(e)}")
            return jsonify({'error': str(e)}), 500
        finally:
            cur.close()
            
    elif request.method == 'DELETE':
        cur = mysql.connection.cursor()
        try:
            cur.execute("DELETE FROM tasks WHERE id = %s", (task_id,))
            mysql.connection.commit()
            return jsonify({'message': 'Task deleted successfully'})
        except Exception as e:
            mysql.connection.rollback()
            logging.error(f"[TASK-DELETE] Error: {str(e)}")
            return jsonify({'error': str(e)}), 500
        finally:
            cur.close()

@api.route('/tasks/<int:task_id>', methods=['GET'])
@token_required
def get_task(task_id):
    cur = mysql.connection.cursor()
    try:
        cur.execute("""
            SELECT id, title, description, status, priority, 
                   due_date, created_at, updated_at 
            FROM tasks 
            WHERE id = %s""", (task_id,))
        task = cur.fetchone()
        
        logging.debug(f"[TASK-GET] Task found: {task}")
        
        if not task:
            return jsonify({'error': 'Task not found'}), 404
            
        return jsonify({
            'status': 'success',
            'data': {
                'id': task[0],
                'title': task[1],
                'description': task[2],
                'status': task[3],
                'priority': task[4],
                'due_date': task[5].isoformat() if task[5] else None,
                'created_at': task[6].isoformat() if task[6] else None,
                'updated_at': task[7].isoformat() if task[7] else None
            }
        })
    except Exception as e:
        logging.error(f"[TASK-GET] Error: {str(e)}")
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()

@api.route('/tasks/filter', methods=['GET'])
@token_required
def filter_tasks():
    status = request.args.get('status')
    priority = request.args.get('priority')
    search = request.args.get('search')
    
    cur = mysql.connection.cursor()
    try:
        query = """
            SELECT id, title, description, status, priority,
                   due_date, created_at, updated_at
            FROM tasks
            WHERE 1=1
        """
        params = []
        
        if status:
            query += " AND status = %s"
            params.append(status)
        if priority:
            query += " AND priority = %s"
            params.append(priority)
        if search:
            query += " AND (title LIKE %s OR description LIKE %s)"
            params.extend([f"%{search}%", f"%{search}%"])
            
        query += " ORDER BY created_at DESC"
        
        logging.debug(f"[TASK-FILTER] Query: {query}, Params: {params}")
        cur.execute(query, tuple(params))
        tasks = cur.fetchall()
        
        formatted_tasks = [{
            'id': task[0],
            'title': task[1],
            'description': task[2],
            'status': task[3],
            'priority': task[4],
            'due_date': task[5].isoformat() if task[5] else None,
            'created_at': task[6].isoformat() if task[6] else None,
            'updated_at': task[7].isoformat() if task[7] else None
        } for task in tasks]
        
        return jsonify({
            'status': 'success',
            'data': formatted_tasks,
            'count': len(formatted_tasks)
        })
    except Exception as e:
        logging.error(f"[TASK-FILTER] Error: {str(e)}")
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()

@api.route('/tasks/<int:task_id>/status', methods=['PUT'])
@token_required
def update_task_status(task_id):
    logging.debug(f"[STATUS-UPDATE] Updating task {task_id}")
    data = request.get_json()
    new_status = data.get('status')
    
    if not new_status or new_status not in ['pending', 'in_progress', 'completed']:
        return jsonify({'error': 'Invalid status'}), 400
        
    cur = mysql.connection.cursor()
    try:
        # Debug task existence
        cur.execute("SELECT id, status FROM tasks WHERE id = %s", (task_id,))
        task = cur.fetchone()
        logging.debug(f"[STATUS-UPDATE] Found task: {task}")
        
        if not task:
            return jsonify({'error': 'Task not found'}), 404
            
        # Update task status
        cur.execute("""
            UPDATE tasks 
            SET status = %s,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = %s""", 
            (new_status, task_id))
        
        rows_affected = cur.rowcount
        logging.debug(f"[STATUS-UPDATE] Rows affected: {rows_affected}")
        
        if rows_affected > 0:
            mysql.connection.commit()
            return jsonify({
                'message': 'Status updated successfully',
                'task_id': task_id,
                'status': new_status,
                'previous_status': task[1]
            })
        else:
            mysql.connection.rollback()
            return jsonify({'error': 'Failed to update task status'}), 500
            
    except Exception as e:
        mysql.connection.rollback()
        logging.error(f"[STATUS-UPDATE] Error: {str(e)}")
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()

@api.route('/tasks/<int:task_id>/priority', methods=['PUT'])
@token_required
def update_task_priority(task_id):
    logging.debug(f"[PRIORITY-UPDATE] Updating task {task_id}")
    data = request.get_json()
    new_priority = data.get('priority')
    
    if not new_priority or new_priority not in ['low', 'medium', 'high']:
        return jsonify({'error': 'Invalid priority'}), 400
        
    cur = mysql.connection.cursor()
    try:
        cur.execute("SELECT id, priority FROM tasks WHERE id = %s", (task_id,))
        task = cur.fetchone()
        logging.debug(f"[PRIORITY-UPDATE] Found task: {task}")
        
        if not task:
            return jsonify({'error': 'Task not found'}), 404
            
        cur.execute("""
            UPDATE tasks 
            SET priority = %s,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = %s""", 
            (new_priority, task_id))
        
        mysql.connection.commit()
        return jsonify({
            'message': 'Priority updated successfully',
            'task_id': task_id,
            'priority': new_priority
        })
    except Exception as e:
        mysql.connection.rollback()
        logging.error(f"[PRIORITY-UPDATE] Error: {str(e)}")
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()

@api.route('/tasks/search', methods=['GET'])
@token_required
def search_tasks():
    query = request.args.get('q', '')
    due_date = request.args.get('due_date')
    sort_by = request.args.get('sort', 'created_at')
    order = request.args.get('order', 'desc')
    
    cur = mysql.connection.cursor()
    try:
        sql = """
            SELECT id, title, description, status, priority, 
                   due_date, created_at, updated_at 
            FROM tasks 
            WHERE (title LIKE %s OR description LIKE %s)
        """
        params = [f"%{query}%", f"%{query}%"]
        
        if due_date:
            sql += " AND DATE(due_date) = DATE(%s)"
            params.append(due_date)
            
        sql += f" ORDER BY {sort_by} {order}"
        
        cur.execute(sql, tuple(params))
        tasks = cur.fetchall()
        
        return jsonify({
            'status': 'success',
            'data': {
                'tasks': [{
                    'id': task[0],
                    'title': task[1],
                    'description': task[2],
                    'status': task[3],
                    'priority': task[4],
                    'due_date': task[5].isoformat() if task[5] else None,
                    'created_at': task[6].isoformat(),
                    'updated_at': task[7].isoformat()
                } for task in tasks],
                'count': len(tasks)
            }
        })
    except Exception as e:
        logging.error(f"[TASK-SEARCH] Error: {str(e)}")
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()