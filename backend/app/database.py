import sqlite3#sqlite

def get_db():
    conn = sqlite3.connect("maintenance.db")
    return conn
