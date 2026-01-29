from flask import Flask, request, jsonify
from flask_cors import CORS
from database import get_db
import datetime

app = Flask(__name__)
CORS(app)

PRIORITY = {
    "Emergency": 1,
    "Senior": 2,
    "Normal": 3
}

# USER SIGNUP
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to Token Generator API"})

@app.route("/user/signup", methods=["POST"])
def signup():
    data = request.json
    db = get_db()
    c = db.cursor()
    c.execute(
        "INSERT INTO users (name, age) VALUES (%s,%s)",
        (data["name"], data["age"])
    )
    db.commit()
    return jsonify({"message": "User created"})

# TOKEN GENERATION
@app.route("/token/generate", methods=["POST"])
def generate_token():
    data = request.json
    user_id = data["user_id"]
    service = data["service_type"]

    db = get_db()
    c = db.cursor(dictionary=True)

    c.execute("SELECT age FROM users WHERE id=%s", (user_id,))
    age = c.fetchone()["age"]

    if service == "Emergency":
        priority = PRIORITY["Emergency"]
    elif age >= 60:
        priority = PRIORITY["Senior"]
    else:
        priority = PRIORITY["Normal"]

    token = f"T{int(datetime.datetime.now().timestamp()) % 100000}"

    c.execute("""
        INSERT INTO tokens (token_no, user_id, service_type, priority)
        VALUES (%s,%s,%s,%s)
    """, (token, user_id, service, priority))

    db.commit()
    return jsonify({"token": token})

# VIEW QUEUE
@app.route("/queue")
def queue():
    db = get_db()
    c = db.cursor(dictionary=True)
    c.execute("""
        SELECT token_no, service_type, priority
        FROM tokens
        WHERE status='waiting'
        ORDER BY priority, created_at
    """)
    return jsonify(c.fetchall())

# CALL NEXT
@app.route("/queue/call-next", methods=["POST"])
def call_next():
    db = get_db()
    c = db.cursor(dictionary=True)

    c.execute("SELECT counter_no FROM counters WHERE status='idle' LIMIT 1")
    counter = c.fetchone()

    if not counter:
        return jsonify({"message": "No free counter"}), 400

    c.execute("""
        SELECT token_no FROM tokens
        WHERE status='waiting'
        ORDER BY priority, created_at
        LIMIT 1
    """)
    token = c.fetchone()

    if not token:
        return jsonify({"message": "No waiting patients"})

    c.execute("UPDATE tokens SET status='serving' WHERE token_no=%s", (token["token_no"],))
    c.execute("UPDATE counters SET status='busy' WHERE counter_no=%s", (counter["counter_no"],))
    c.execute("""
        INSERT INTO service_logs (token_no, counter_no, start_time)
        VALUES (%s,%s,%s)
    """, (token["token_no"], counter["counter_no"], datetime.datetime.now()))

    db.commit()
    return jsonify({"serving": token["token_no"], "counter": counter["counter_no"]})

# COMPLETE SERVICE
@app.route("/queue/complete", methods=["POST"])
def complete():
    token = request.json["token"]

    db = get_db()
    c = db.cursor(dictionary=True)

    c.execute("UPDATE tokens SET status='completed' WHERE token_no=%s", (token,))
    c.execute("""
        UPDATE service_logs SET end_time=%s
        WHERE token_no=%s AND end_time IS NULL
    """, (datetime.datetime.now(), token))

    c.execute("""
        SELECT counter_no FROM service_logs
        WHERE token_no=%s ORDER BY id DESC LIMIT 1
    """, (token,))
    counter = c.fetchone()

    if counter:
        c.execute("UPDATE counters SET status='idle' WHERE counter_no=%s", (counter["counter_no"],))

    db.commit()
    return jsonify({"completed": token})

# DASHBOARD
@app.route("/dashboard")
def dashboard():
    db = get_db()
    c = db.cursor(dictionary=True)

    # Now Serving
    c.execute("SELECT token_no, counter_no FROM service_logs WHERE end_time IS NULL")
    serving = c.fetchall()

    # Waiting
    c.execute("SELECT COUNT(*) AS waiting FROM tokens WHERE status='waiting'")
    waiting = c.fetchone()["waiting"]

    # Avg Wait Time (for completed)
    c.execute("""
        SELECT AVG(TIMESTAMPDIFF(MINUTE, start_time, end_time)) AS avg_wait
        FROM service_logs WHERE end_time IS NOT NULL
    """)
    avg_wait = c.fetchone()["avg_wait"] or 0

    # Served Today
    c.execute("SELECT COUNT(*) AS served FROM tokens WHERE status='completed'")
    served = c.fetchone()["served"]

    # Longest Wait
    c.execute("""
        SELECT MAX(TIMESTAMPDIFF(MINUTE, start_time, end_time)) AS longest
        FROM service_logs WHERE end_time IS NOT NULL
    """)
    longest = c.fetchone()["longest"] or 0

    return jsonify({
        "serving": serving,
        "waiting": waiting,
        "avg_wait": round(avg_wait),
        "served": served,
        "longest": round(longest)
    })


if __name__ == "__main__":
    app.run(debug=True)
