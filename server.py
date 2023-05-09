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
import cloudinary
from cloudinary.uploader import upload
from cloudinary.utils import cloudinary_url


from jinja2 import StrictUndefined

app = Flask(__name__)

# Secret key is used to cryptographically-sign the cookies used for storing the session id
app.secret_key = os.environ["FLASK_SECRET"]
app.jinja_env.undefined = StrictUndefined

# Configure Redis for storing the session data on the server-side
app.config["SESSION_TYPE"] = "redis"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_USE_SIGNER"] = True
app.config["SESSION_REDIS"] = redis.from_url("redis://localhost:6379")

# Create and initialize the Flask-Session object AFTER configurations
server_session = Session(app)

# Initialize cross-origin requests
CORS(app, supports_credentials=True)

# Cloudinary configuration
cloudinary.config(
  cloud_name = "tennismatchup",
  api_key = os.environ["CLOUDINARY_KEY"],
  api_secret = os.environ["CLOUDINARY_SECRET"],
  secure = True
)

connect_to_db(app)

def to_dict(objects):
    """Converts list of SQLAlchemy objects to list of dictionaries to prep for jsonify."""

    # Convert the list of Player objects to a list of dictionaries
    dict_list = [o.__dict__ if o is not None else o for o in objects]

    # Remove the SQLAlchemy-specific attributes from each dictionary
    for o in dict_list:
        if o is not None:
            o.pop("_sa_instance_state", None)
            
            date = o.get("join_date", None)
            if date is not None:
                o["join_date"] = o["join_date"].isoformat()
    
    return dict_list


@app.route("/")
def homepage():
    """Greet from backend."""

    return "Welcome to the Tennis Matchup backend server."


@app.route("/dashboard")
def dashboard():
    """View dashboard page."""

    print(session)
    # Authenticate user
    if "email" in session:
        player = crud.get_player_by_id(session["id"])

        # #need to star preferred court
        courts = player.courts
        ratings_given = player.ratings_given
        ratings_received = player.ratings_received
        activities = crud.get_history(player)

        player_info = {
            "fname" : player.fname,
            "lname" : player.lname,
            "gender" : player.gender,
            "skill_lvl" : player.skill_lvl,
            "game_pref" : player.game_pref, 
            "join_date" : player.join_date,
            "pref_court" :player.pref_court_id,
            "photo" : player.photo
        }

        courts = to_dict(courts)
        ratings_given = to_dict(ratings_given)
        ratings_received = to_dict(ratings_received)

        dashboard = {
            "player": player_info,
            "courts": courts,
            "ratingsG": ratings_given,
            "ratingsR": ratings_received,
            "activities": activities
        }

        return jsonify(dashboard), 200
    else:
        # User is not logged in, redirect to homepage
        return jsonify({"message": "Could not authenticate user."}), 401




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

    print(user.password)
    print(hashed_password)

    if user and user.password == hashed_password:
        session["id"] = user.player_id
        session["email"] = email

        return jsonify({"id": session["id"] }), 200
    else:
        return jsonify({"message": "Incorrect username or password"}), 401


@app.route("/reset-password")
def reset_password():
    """Display form for password recovery."""

    pass


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

    players = court.players
    activities = court.activities

    players = to_dict(players)
    activities = to_dict(activities)

    court_info = {
            "id" : court.id,
            "borough" : court.borough,
            "name" : court.name,
            "location" : court.location,
            "phone" : court.phone, 
            "court_count" : court.court_count,
            "indoor_outdoor" : court.indoor_outdoor,
            "surface" : court.surface,
            "accessible" : court.accessible,
            "lat" : court.lat,
            "long" : court.long
        }
    
    court_page = {
            "court": court_info,
            "players": players,
            "activities": activities
    }

    return jsonify(court_page)


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

    player = crud.get_player_by_id(session["id"])
    friends = crud.get_friends(player)
    friends_dict = to_dict(friends)

    return jsonify(friends_dict)


@app.route("/players/<player_id>")
def show_player(player_id):
    """Show player profile page."""

    player = crud.get_player_by_id(player_id)
    court = crud.get_court_by_id(player.pref_court_id)
    ratings = player.ratings_received

    court = to_dict([court])
    ratings = to_dict(ratings)

    player_info = {
        "id" : player.id,
        "fname" : player.fname,
        "lname" : player.lname,
        "gender" : player.gender,
        "skill_lvl" : player.skill_lvl,
        "game_pref" : player.game_pref, 
        "join_date" : player.join_date,
        "pref_court" :player.pref_court_id,
        "photo" : player.photo
    }

    player_profile = {
        "player" : player_info,
        "court": court[0],
        "ratings": ratings
    }

    return jsonify(player_profile)


@app.route("/pref-court", methods=["POST"])
def pref_court():
    """Update player preferred Court."""

    try:
        player = crud.get_player_by_id(session["id"])

        player.pref_court_id = request.json["courtId"]
        
        db.session.commit()

        return jsonify({"message": "Preferred court updated."}), 200
    
    except:
        return jsonify({"message": "Could not update preferred court."}), 500


@app.route("/upload-photo", methods=["POST"])
def upload_photo():
    """Add profile photo from cloudinary."""
    
    photo = request.files["file"]
    player_id = session["id"]
    response = upload(photo, public_id=f"playerphotos/{player_id}")
 
    url, options = cloudinary_url(response['public_id'], width=200, height=200, crop="fill")

    player = Player.query.get(player_id)
    player.photo = url
    db.session.commit()

    return jsonify({"url": url}), 200


@app.route("/remove-photo")
def remove_photo():
    """Remove profile photo from cloudinary."""

    player_id = session["id"]
    response = cloudinary.uploader.destroy(f"playerphotos/{player_id}")
    print(response)

    player = Player.query.get(player_id)
    player.photo = None
    db.session.commit()

    if response["result"] == "ok":
        return jsonify({"message": "Photo deletion successful."}), 200
    else:
        return jsonify({"message": "Error deleting photo: " + response["result"]}), 500


@app.route("/submit-rating", methods=["POST"])
def submit_rating():
    """Submit a player rating."""

    try:
        new_rating = crud.create_rating(
            player_id = request.json["playerId"], 
            commenter_id = session["id"],
            activity_id = request.json["activityId"], 
            lvl_rating = request.json["rating"], 
            comments = request.json["comments"], 
            created_at = datetime.now())
        
        print(new_rating)

        db.session.add(new_rating)
        db.session.commit()

        return jsonify({"message": "Rating submission successful"}), 200
    
    except:
        return jsonify({"message": "Could not submit new rating."}), 500


@app.route("/submit-schedule", methods=["POST"])
def submit_schedule():
    """ Submit new session info."""

    try:
        new_activity = crud.create_activity(
            date=datetime.strptime(request.json["datetime"], "%Y-%m-%dT%H:%M"),
            court=crud.get_court_by_id(request.json["courtSession"]),
            match_type=request.json["matchType"]
        )
        
        player_self = crud.get_player_by_id(request.json["schedulingPlayer"]) 
        player_other = crud.get_player_by_id(request.json["hittingPartner"])

        new_activity.players = [player_self, player_other]
        
        db.session.add(new_activity)
        db.session.commit()

        return jsonify({"message": "Scheduling successful"}), 200
    
    except:
        return jsonify({"message": "Could not submit new schedule."}), 500


@app.route("/delete-activity", methods=["POST"])
def delete_activity():
    """ Delete future activitiy and repective pairing."""

    try:
        activity = crud.get_activity_by_id(request.json["id"])

        db.session.delete(activity)
        db.session.commit()

        return jsonify({"message": "Deletion successful"}), 200
    
    except:
        return jsonify({"message": "Could not delete activity."}), 500


@app.route("/add-court", methods=["POST"])
def add_court():
    """ Add court to player's favorites."""
    
    try:
        player = player = crud.get_player_by_id(session["id"])
        court = crud.get_court_by_id(request.json["courtId"])
        
        player.courts.append(court)

        db.session.commit()

        return jsonify({"message": "Court added successfully."}), 200
    
    except:
        return jsonify({"message": "Could not add court."}), 500
    

@app.route("/delete-court", methods=["POST"])
def delete_court():

    try:
        player = crud.get_player_by_id(session["id"])
        court = crud.get_court_by_id(request.json["courtId"])

        if player.pref_court_id == court.id:
            player.pref_court_id = None

        player.courts.remove(court)
        
        db.session.commit()

        return jsonify({"message": "Court deleted successfully."}), 200
    
    except:
        return jsonify({"message": "Could not delete court."}), 500


if __name__ == "__main__":
    # debug=True gives error messages in browser & "reloads"
    # web app as code changes.
    app.run(debug=True, host="0.0.0.0")