import os
import sqlite3
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Origins allowed to call this API. Override on the server with
# ALLOWED_ORIGINS="https://a.example,https://b.example" if the domain changes.
DEFAULT_ORIGINS = [
    "https://karthikshetty.co.in",
    "https://www.karthikshetty.co.in",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]
ALLOWED_ORIGINS = [
    o.strip() for o in os.environ.get("ALLOWED_ORIGINS", ",".join(DEFAULT_ORIGINS)).split(",") if o.strip()
]
CORS(app, origins=ALLOWED_ORIGINS)

# Absolute so the DB is found no matter what CWD the service starts in.
DB = os.environ.get("CONTACTS_DB", os.path.join(os.path.dirname(os.path.abspath(__file__)), "contacts.db"))


def get_db():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS contacts (
                id       INTEGER PRIMARY KEY AUTOINCREMENT,
                name     TEXT    NOT NULL,
                email    TEXT    NOT NULL,
                message  TEXT    NOT NULL,
                received_at TEXT NOT NULL
            )
        """)
        conn.commit()


@app.route("/api/contact", methods=["POST"])
def contact():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    name    = (data.get("name")    or "").strip()
    email   = (data.get("email")   or "").strip()
    message = (data.get("message") or "").strip()

    if not name or not email or not message:
        return jsonify({"error": "name, email, and message are required"}), 422

    received_at = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")

    with get_db() as conn:
        cursor = conn.execute(
            "INSERT INTO contacts (name, email, message, received_at) VALUES (?, ?, ?, ?)",
            (name, email, message, received_at),
        )
        conn.commit()
        new_id = cursor.lastrowid

    print(f"\n[NEW] Contact [{new_id}] - {name} <{email}>  @ {received_at}")
    print(f"    {message[:120]}{'...' if len(message) > 120 else ''}\n")

    return jsonify({"success": True, "id": new_id, "received_at": received_at}), 201


@app.route("/api/contacts", methods=["GET"])
def list_contacts():
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM contacts ORDER BY id DESC").fetchall()
    return jsonify([dict(r) for r in rows])


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


# Run at import time so the table exists under gunicorn too, not just `python app.py`.
init_db()


if __name__ == "__main__":
    print("Flask backend running -> http://localhost:8000")
    app.run(host="0.0.0.0", port=8000, debug=True)
