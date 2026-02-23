from flask import Flask, request , jsonify
from flask_cors import CORS
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

def getdbconnect():
    conn = psycopg2.connect(
        host=os.environ.get("DB_HOST"),
        database=os.environ.get("DB_NAME"),
        user=os.environ.get("DB_USER"),
        password=os.environ.get("DB_PASSWORD")
    )
    return conn

@app.route("/snippets",methods=["GET"])
def get_snippets():
    conn=getdbconnect()
    cur=conn.cursor()
    cur.execute("SELECT id, title,language,code,created_at FROM snippets ORDER BY id DESC;")
    rows=cur.fetchall()
    cur.close()
    conn.close()

    snippets=[]
    for row in rows:
        snippets.append({
            "id" : row[0],
            "title" : row[1],
            "language" :row[2],
            "code":row[3],
            "created_at":row[4]
        })
    return jsonify(snippets)

@app.route("/snippets",methods=["POST"])
def add_snippet():
    data = request.json
    conn = getdbconnect()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO snippets(title,language,code) VALUES (%s,%s,%s);",
        (data["title"],data["language"],data["code"])
    )
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message" : "Snippet added successfully"}),201
@app.route("/snippets/<int:id>",methods=["DELETE"])
def deletesnipp():
    conn= getdbconnect()
    cur= conn.cursor()
    cur.execute("DELETE FORM snippets WHERE id = %s",(id,))
    conn.commit()
    cur.close()
    conn.close()
    return ({"message":"Snippet deleted"})

if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000)

