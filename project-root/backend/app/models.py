from . import mysql

def create_user(username, email, password, role='student'):
    cur = mysql.connection.cursor()
    try:
        cur.execute(
            "INSERT INTO users (username, email, password, role) VALUES (%s, %s, %s, %s)",
            (username, email, password, role)
        )
        mysql.connection.commit()
        return True
    except Exception as e:
        print(f"Error creating user: {e}")
        mysql.connection.rollback()
        return False
    finally:
        cur.close()