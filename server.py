from flask import (Flask, render_template, request, flash, 
                   session, redirect, jsonify, get_flashed_messages,
                   url_for)
from flask_session import Session
from flask_cors import CORS
from model import (db, User, Player, PlayerCourt, Rating, 
                   Activity, Court, Pairing, connect_to_db)
from datetime import datetime
import crud
from hashlib import sha256
import os
import redis
# import cloudinary.uploader

from jinja2 import StrictUndefined

app = Flask(__name__)

# Secret key is used to cryptographically-sign the cookies used for storing the session id
app.secret_key = "asdfjkln4389htia72342390iokje"
app.jinja_env.undefined = StrictUndefined


# Configure Redis for storing the session data on the server-side
app.config["SESSION_TYPE"] = "redis"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_USE_SIGNER"] = True
app.config["SESSION_REDIS"] = redis.from_url("redis://localhost:6379")

# app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True


# Create and initialize the Flask-Session object AFTER configurations
server_session = Session(app)

# CORS(app, supports_credentials = True, resources={r"/*": {"origins": "http://localhost:3000/"}})
# Initialize cross-origin requests
CORS(app, supports_credentials=True)
# CORS(app, resources={r'/*': {'origins': '*'}, 'expose_headers': 'Authorization', 'allow_headers': ['Content-Type']})# CORS(app, supports_credentials=True)

# # Set the session cookie to be secure and HTTP-only

# app.config['CORS_HEADERS'] = 'Content-Type'
# app.config['CORS_SUPPORTS_CREDENTIALS'] = True
# # app.config['SESSION_COOKIE_DOMAIN'] = "127.0.0.1"

CLOUDINARY_KEY = os.environ["CLOUDINARY_KEY"]
CLOUDINARY_SECRET = os.environ["CLOUDINARY_SECRET"]
CLOUD_NAME = "tennismatchup"

connect_to_db(app)

# @app.after_request
# def add_cors_headers(response):
#     response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
#     response.headers.add("Access-Control-Allow-Credentials", "true")
#     return response

# @app.after_request
# def add_cors_headers(response):
#     # Allow requests from other port
#     response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")

# #     # Allow credentials for all responses
#     response.headers.add('Access-Control-Allow-Credentials', 'true')

# #     # Set allowed headers for CORS requests
#     response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')

#     # Set allowed methods for CORS requests
#     response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')

#     return response


def to_dict(objects):
    """Converts list of SQLAlchemy objects to list of dictionaries to prep for jsonify."""

    # Convert the list of Player objects to a list of dictionaries
    dict_list = [o.__dict__ for o in objects]

    # Remove the SQLAlchemy-specific attributes from each dictionary
    for o in dict_list:
        o.pop("_sa_instance_state", None)
        
        date = o.get("join_date", None)
        if date is not None:
            o["join_date"] = o["join_date"].isoformat()
    
    if len(dict_list) == 1:
        return dict_list[0]
    
    return dict_list


@app.route("/")
def homepage():
    """Greet from backend."""

    return "Welcome to the Tennis Matchup backend server."


@app.route("/dashboard")
def dashboard():
    """View dashboard page."""

    # # Check if user is logged in
    # if "email" in session:
    #     # User is logged in
    #     player = crud.get_player_by_id(session["id"])
    #     return render_template("dashboard.html", player=player)
    # else:
    #     # User is not logged in, redirect to homepage
    #     return redirect("/")
    # session["id"] = 2

    return jsonify({"id": session["id"] })


@app.route("/welcome", methods=["POST"])
def welcome():
    """ Submit user info to db and welcome new player."""

    email = request.json["signUpEmail"]
    user = crud.check_email(email)
    
    # Email already in use
    if user:
        return jsonify({"error": "Email already in use. Please enter a different email."}), 409

    # Create new user and player
    else:
        new_player = crud.create_player(
            fname = request.json["fname"],
            lname = request.json["lname"],
            gender = request.json["gender"],
            skill_lvl = request.json["skillLevel"],
            game_pref = request.json["gamePref"],
            join_date = datetime.now())
        
        db.session.add(new_player)
        db.session.commit()

        password = request.json["signUpPassword"]
        hashed_password = sha256(password.encode()).hexdigest()
        
        new_user = crud.create_user(
            player_id = new_player.id,
            email = email,
            password = hashed_password)
        
        db.session.add(new_user)
        db.session.commit()

    return jsonify({"message": "Signup Successful! Please login."}), 200


@app.route("/login", methods=["POST"])
def login():
    """Authenticate user."""

    email = request.json["email"]
    password = request.json["password"]

    # Confirm user exists and hash password
    hashed_password = sha256(password.encode()).hexdigest()
    user = User.query.filter_by(email=email).first()

    if user and user.password == hashed_password:
        session["id"] = user.player_id
        session["email"] = email

        print(f"$$$$$$$$$${session}")
        return jsonify({"id": session["id"] }), 200
    else:
        return jsonify({"message": "Incorrect username or password"}), 401


# @app.route("/status")
# def status():
#     """Confirm authorization status."""

#     if session["id"]:
#         return jsonify({"status": "true"})
#     else:
#         return jsonify({"status": "false"})


@app.route("/reset-password")
def reset_password():
    """Display form for password recovery."""

    return render_template("reset_password.html")


@app.route("/send-recovery-email", methods=['POST'])
def send_recovery_email():
    pass


@app.route("/logout")
def logout():
    """Logout user."""

    # Clear session cookies
    session.clear()

    if len(session) == 0:
        return jsonify({"message": "Logout successful"}), 200
    else:
        return jsonify({"message": "Could not log out"}), 500


@app.route("/courts")
def courts():
    """View map of courts page."""

    courts = Court.query.all()

    courts_dict = to_dict(courts)

    return jsonify(courts_dict)


@app.route("/courts/<court_id>")
def show_court(court_id):
    """Show player court page."""

    court = crud.get_court_by_id(court_id)

    court_dict = to_dict([court])

    return jsonify(court_dict)


@app.route("/courts-players")
def courts_players():
    """View map of courts page."""

    courts = Court.query.all()
    courts_dict = to_dict(courts)
    
    players = Player.query.all()
    players_dict = to_dict(players)

    data_dict = {"players": players_dict, "courts": courts_dict}

    return jsonify(data_dict)


@app.route("/all-players")
def all_players():
    """Returns JSON of all players."""

    players = Player.query.all()

    players_dict = to_dict(players)

    return jsonify(players_dict)


@app.route("/friends")
def friends():
    """Returns JSON of all friends."""
    if 'session' in request.cookies:
        print("***************")
        print(session)
    else:
        print("*******BIG SAD******")

    print(session["id"])

    player = crud.get_player_by_id(session["id"])
    print(player)
    friends = crud.get_friends(player)
    print(friends)

    friends_dict = to_dict(friends)

    return jsonify(friends_dict)


@app.route("/players/<player_id>")
def show_player(player_id):
    """Show player profile page."""

    player = crud.get_player_by_id(player_id)
    player_dict = to_dict([player])

    return jsonify(player_dict)


# @app.route("/scheduler")
# def schedule_session():
#     """Create a hitting session."""

#     courts = Court.query.all()
#     players = Player.query.all()

#     return render_template("scheduler.html", courts=courts, players=players, int=int)


@app.route("/upload-photo", methods=["POST"])
def upload_photo():
    """Add a photo session."""
    
    photo = request.files["photo"]
    player_id = request.form["player_id"]

    result = cloudinary.uploader.upload(photo,
        api_key=CLOUDINARY_KEY,
        api_secret=CLOUDINARY_SECRET,
        cloud_name=CLOUD_NAME)
    
    img_url = result["secure_url"]

    player = Player.query.get(player_id)
    player.photo = img_url
    db.session.commit()
    
    return redirect("/dashboard")


@app.route("/submit-rating")
def submit_rating():
    """Submit a player rating."""
    
    # new_rating = crud.create_rating(
    #    player=player,
    #    commenter=session["id"],
    #    activity=activity,
    #    lvl_rating=lvl_rating,
    #    comments=comments,
    #    created_at=created_at)
    
    # db.session.add(new_activity)
    # db.session.commit()

    return redirect("/dashboard")



@app.route("/submit-schedule", methods=["POST"])
def submit_schedule():
    """ Submit new session info."""
    try:
        new_activity = crud.create_activity(
            date=datetime.strptime(request.json["datetime"], "%Y-%m-%dT%H:%M"),
            court=crud.get_court_by_id(request.json["courtSession"]),
            match_type=request.json["matchType"]
        )
        
        player_self = crud.get_player_by_id(request.form["schedulingPlayer"]) 
        player_other = crud.get_player_by_id(request.form["hittingPartner"])

        new_activity.players = [player_self, player_other]
        
        db.session.add(new_activity)
        db.session.commit()

        return jsonify({"message": "Scheduling successful"}), 200
    except:
        return jsonify({"message": "Could not submit new schedule."}), 500


if __name__ == "__main__":
    # debug=True gives error messages in browser & "reloads"
    # web app as code changes.
    app.run(debug=True, host="0.0.0.0")