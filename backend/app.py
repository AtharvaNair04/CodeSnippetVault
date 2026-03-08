from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import os
import time

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = psycopg2.connect(
        host=os.environ.get("DB_HOST"),
        database=os.environ.get("POSTGRES_DB"),
        user=os.environ.get("POSTGRES_USER"),
        password=os.environ.get("POSTGRES_PASSWORD"),
    )
    return conn


def init_db():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS snippets (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            language TEXT NOT NULL,
            code TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    conn.commit()
    cur.close()
    conn.close()


@app.route("/snippets", methods=["GET"])
def get_snippets():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, title, language, code, created_at FROM snippets ORDER BY id DESC;")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    snippets = []
    for row in rows:
        snippets.append({
            "id": row[0],
            "title": row[1],
            "language": row[2],
            "code": row[3],
            "created_at": str(row[4])
        })

    return jsonify(snippets)

print("Backend Version 2")
@app.route("/snippets", methods=["POST"])
def add_snippet():
    data = request.json

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO snippets (title, language, code)
        VALUES (%s, %s, %s)
    """, (data["title"], data["language"], data["code"]))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Snippet added"}), 201


@app.route("/snippets/<int:id>", methods=["DELETE"])
def delete_snippet(id):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("DELETE FROM snippets WHERE id = %s", (id,))
    conn.commit()

    cur.close()
    conn.close()

    return jsonify({"message": "Snippet deleted"})


if __name__ == "__main__":
    while True:
        try:
            init_db()
            print("Database ready!")
            break
        except Exception as e:
            print("Waiting for database...")
            time.sleep(2)

    app.run(host="0.0.0.0", port=5000)