"""Username/password login for the expense tracker.

Two accounts, Karthik and Mom, sharing one set of expenses. Who is logged in
decides which Person an unattributed expense is filed under, so "spent 60 on
milk" records Mom when Mom typed it.

Login returns a signed bearer token rather than setting a cookie: the page is
served from karthikshetty.co.in and the API lives on api.karthikshetty.co.in,
and a bearer header avoids cross-site cookie and CSRF handling entirely.
"""

import os
import sqlite3

from flask import Blueprint, g, jsonify, request
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
from werkzeug.security import check_password_hash, generate_password_hash

auth_bp = Blueprint("auth", __name__)

HERE = os.path.dirname(os.path.abspath(__file__))
DB = os.environ.get("EXPENSES_DB", os.path.join(HERE, "expenses.db"))

# Thirty days: this is a phone shortcut, not a bank.
TOKEN_MAX_AGE = 60 * 60 * 24 * 30

# username -> (Person the expenses are filed under, display name, env var holding the password)
USERS = {
    "karthik": ("Me", "Karthik", "KARTHIK_PASSWORD"),
    "kala": ("Mom", "Kalavathi NS", "MOM_PASSWORD"),
}


def _conn():
    c = sqlite3.connect(DB)
    c.row_factory = sqlite3.Row
    return c


def init_users():
    """Create the table and sync passwords from the environment.

    The .env file is the single source of truth: change a password there,
    restart, and it takes effect. Without that the only way to rotate one would
    be hand-editing hashes in SQLite.
    """
    with _conn() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                username      TEXT PRIMARY KEY,
                password_hash TEXT NOT NULL,
                person        TEXT NOT NULL,
                display       TEXT NOT NULL
            )
        """)
        for username, (person, display, env_var) in USERS.items():
            password = os.environ.get(env_var)
            if not password:
                # No password configured: leave any existing row alone rather
                # than resetting it, and do not invent one.
                continue
            conn.execute(
                """INSERT INTO users (username, password_hash, person, display)
                   VALUES (?, ?, ?, ?)
                   ON CONFLICT(username) DO UPDATE SET
                     password_hash = excluded.password_hash,
                     person        = excluded.person,
                     display       = excluded.display""",
                (username, generate_password_hash(password), person, display),
            )
        conn.commit()


def _serializer():
    secret = os.environ.get("SECRET_KEY")
    if not secret:
        raise RuntimeError("SECRET_KEY is not configured on the server")
    return URLSafeTimedSerializer(secret, salt="expense-login")


def issue_token(username):
    return _serializer().dumps({"u": username})


def user_from_token(token):
    """Return the user row for a valid token, or None."""
    try:
        data = _serializer().loads(token, max_age=TOKEN_MAX_AGE)
    except (BadSignature, SignatureExpired):
        return None

    with _conn() as conn:
        row = conn.execute(
            "SELECT username, person, display FROM users WHERE username = ?",
            (data.get("u"),),
        ).fetchone()
    return dict(row) if row else None


def require_login():
    """Blueprint before_request guard. Returns a response to short-circuit, or None.

    Fails closed: with no SECRET_KEY configured nothing is served, rather than
    falling back to unauthenticated access.
    """
    if request.method == "OPTIONS":
        return None  # let the CORS preflight through untouched

    header = request.headers.get("Authorization", "")
    token = header[7:].strip() if header.lower().startswith("bearer ") else ""
    if not token:
        return jsonify({"error": "login required"}), 401

    try:
        user = user_from_token(token)
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 503

    if not user:
        return jsonify({"error": "session expired - sign in again"}), 401

    g.user = user
    return None


@auth_bp.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip().lower()
    password = data.get("password") or ""

    with _conn() as conn:
        row = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()

    # Same message and roughly the same work either way, so the response does
    # not reveal which usernames exist.
    if not row or not check_password_hash(row["password_hash"], password):
        return jsonify({"error": "Wrong username or password"}), 401

    try:
        token = issue_token(row["username"])
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 503

    return jsonify({
        "token": token,
        "user": {"username": row["username"], "person": row["person"], "display": row["display"]},
    })


@auth_bp.route("/api/auth/me", methods=["GET"])
def me():
    guard = require_login()
    if guard is not None:
        return guard
    return jsonify({"user": g.user})


init_users()
