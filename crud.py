"""CRUD operations."""

from model import (db, Player, User, PlayerCourt, Rating, 
                   Activity, Court, Pairing, connect_to_db)

from sqlalchemy.orm import joinedload

def create_player(fname, lname, gender, skill_lvl,
                  game_pref, join_date, 
                  pref_court=None):
    """Create and return a new player."""

    player = Player(
        fname=fname,
        lname=lname,
        gender=gender,
        skill_lvl=skill_lvl,
        game_pref=game_pref, 
        join_date=join_date,
        pref_court=pref_court)

    return player

def get_player_by_id(player_id):
    """Return a player by primary key."""

    return Player.query.get(player_id)

def check_email(email):
    """Returns user if email already in system."""

    return User.query.filter_by(email=email).first()


def create_user(player_id, email, password):
    """Create and return a new user."""

    user = User(
        player_id=player_id,
        email=email,
        password=password)
    
    return user

def get_court_by_id(court_id):
    """Return a player by primary key."""

    return Court.query.get(court_id)

def get_friends(player):
    """Return all historical hitting partners of player."""

    friends = Player.query \
        .join(Pairing) \
        .join(Activity) \
        .filter(Activity.players.contains(player)) \
        .filter(Pairing.player_id != player.id) \
        .distinct() \
        .all()

    return friends

def sort_by_skill():
    items = Player.query.order_by("skill_lvl").all()

def create_fav_courts(player, courts):
    """Create and return a list of favorite courts."""

    fav_courts = player.courts.append(courts)
    
    return fav_courts


def get_rem_court(player, court):
    """Get query for fave court that player wants to remove."""

    rem_court = PlayerCourt.query \
        .filter(PlayerCourt.player_id == player.id) \
        .filter(PlayerCourt.court_id == court.id)
    
    return rem_court


def create_court(borough, name, location, phone, court_count,
                 indoor_outdoor, surface, accessible, lat, long):
    """Create and return a new court."""

    court = Court(
        borough=borough,
        name=name,
        location=location,
        phone=phone,
        court_count=court_count,
        indoor_outdoor=indoor_outdoor,
        surface=surface,
        accessible=accessible,
        lat=lat,
        long=long)

    return court

def create_rating(player, commenter, activity, lvl_rating, comments,
                 created_at):
    """Create and return a new rating."""
    
    rating = Rating(
       player=player,
       commenter=commenter,
       activity=activity,
       lvl_rating=lvl_rating,
       comments=comments,
       created_at=created_at)

    return rating

def create_pairing(activity, player, outcome=None, no_show=None):
    """Create and return a new pairing."""

    pairing = Pairing(
        activity=activity,
        player=player,
        outcome=outcome,
        no_show=no_show)
    
    return pairing

def create_activity(date, court, match_type, score=None):
    """Create and return a new activity."""

    activity = Activity(
        date=date,
        court=court,
        match_type=match_type,
        score=score)

    return activity

if __name__ == "__main__":
    from server import app

    connect_to_db(app)