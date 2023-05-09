"""Models for tennis scheduling and ratings app."""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Player(db.Model):
    """A tennis player."""

    __tablename__ = "players"

    id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String, nullable=False)
    lname = db.Column(db.String, nullable=False)
    gender = db.Column(db.String)
    skill_lvl = db.Column(db.Float(2), nullable=False)
    game_pref = db.Column(db.String)
    join_date = db.Column(db.DateTime, nullable=False)
    pref_court_id = db.Column(db.Integer, db.ForeignKey("courts.id"))
    photo = db.Column(db.String)

    pref_court = db.relationship("Court", back_populates="pref_players")
    courts = db.relationship("Court", secondary="player_courts", back_populates="players")
    ratings_given = db.relationship("Rating", back_populates="commenter", foreign_keys="[Rating.commenter_id]")
    ratings_received = db.relationship("Rating", back_populates="player", foreign_keys="[Rating.player_id]")
    activities = db.relationship("Activity", secondary="pairings", back_populates="players")
    user = db.relationship("User", back_populates="player", uselist=False)

    def __repr__(self):
        return f"<Player id={self.id} name={self.fname} {self.lname}>"

class User(db.Model):
    """User credentials."""

    __tablename__ = "users"

    player_id = db.Column(db.Integer, db.ForeignKey("players.id"), primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    
    player = db.relationship("Player", back_populates="user", uselist=False)

    def __repr__(self):
        return f"<Player id={self.player_id} username={self.email}>"

class PlayerCourt(db.Model):
    """Player's preferred courts."""

    __tablename__ = "player_courts"

    id = db.Column(db.Integer, primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey("players.id"), nullable=False)
    court_id = db.Column(db.Integer, db.ForeignKey("courts.id"), nullable=False)

    def __repr__(self):
        return f"<Player={self.player_id} court={self.court_id}>"


class Rating(db.Model):
    """A user rating submitted after a hitting session."""

    __tablename__ = "ratings"

    id = db.Column(db.Integer, primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey("players.id"), nullable=False)
    commenter_id = db.Column(db.Integer, db.ForeignKey("players.id"), nullable=False)
    activity_id = db.Column(db.Integer, db.ForeignKey("activities.id"), nullable=False)
    lvl_rating = db.Column(db.Float(2), nullable=False)
    comments = db.Column(db.Text)
    created_at = db.Column(db.DateTime, nullable=False)

    player = db.relationship("Player", back_populates="ratings_received", foreign_keys=[player_id])
    commenter = db.relationship("Player", back_populates="ratings_given", foreign_keys=[commenter_id])
    activity = db.relationship("Activity", back_populates="ratings")

    def __repr__(self):
        return f"<Player={self.player_id} rating={self.lvl_rating}> commenter={self.commenter_id}"

class Activity(db.Model):
    """A hitting session."""

    __tablename__ = "activities"

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False)
    court_id = db.Column(db.Integer, db.ForeignKey("courts.id"))
    match_type = db.Column(db.String)
    score = db.Column(db.String)

    players = db.relationship("Player", secondary="pairings", back_populates="activities")
    court = db.relationship("Court", back_populates="activities")
    ratings = db.relationship("Rating", back_populates="activity")

    def __repr__(self):
        return f"<Activity={self.id}>"
    

class Court(db.Model):
    """Available tennis courts."""

    __tablename__ = "courts"

    id = db.Column(db.Integer, primary_key=True)
    borough = db.Column(db.String, nullable=False)
    name = db.Column(db.String)
    location = db.Column(db.String, nullable=False)
    phone = db.Column(db.String)
    # city = db.Column(db.String)
    # state = db.Column(db.String(2))
    # zipcode = db.Column(db.Integer, nullable=False)
    court_count = db.Column(db.Integer)
    # club = db.Column(db.Boolean)
    # fee = db.Column(db.Boolean)
    # lighted = db.Column(db.Boolean)
    # restricted = db.Column(db.Boolean)
    indoor_outdoor = db.Column(db.String)
    surface = db.Column(db.String)
    accessible = db.Column(db.String(3))
    # website = db.Column(db.Text)
    lat = db.Column(db.String)
    long = db.Column(db.String)

    pref_players = db.relationship("Player", back_populates="pref_court")
    players = db.relationship("Player", secondary="player_courts", back_populates="courts")
    activities = db.relationship("Activity", back_populates="court")

    def __repr__(self):
        return f"<Court={self.id} borough={self.borough}>"


class Pairing(db.Model):
    """Pairings for hitting sessions."""

    __tablename__ = "pairings"
    
    id = db.Column(db.Integer, primary_key=True)
    activity_id = db.Column(db.Integer, db.ForeignKey("activities.id"), nullable=False)
    player_id = db.Column(db.Integer, db.ForeignKey("players.id"), nullable=False)
    # outcome = db.Column(db.String)
    # no_show = db.Column(db.Boolean)

    def __repr__(self):
        return f"<Pairing={self.id} activity={self.activity_id} player={self.player_id}>"


def connect_to_db(flask_app, db_uri="postgresql:///tennis", echo=True):
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    flask_app.config["SQLALCHEMY_ECHO"] = echo
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.app = flask_app
    db.init_app(flask_app)

    print("Connected to the db!")

if __name__ == "__main__":
    from server import app

    # Call connect_to_db(app, echo=False) to limit output
    connect_to_db(app)

    db.create_all()
