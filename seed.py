"""Script to seed database."""

import os
import json
from random import choice, randint, sample
from datetime import datetime, timedelta
from hashlib import sha256

import crud
import model
import server

import sys

os.system("dropdb tennis")
os.system("createdb tennis")

model.connect_to_db(server.app)
model.db.create_all()


### COURTS ###
# Load court data from JSON file
with open("data/DPR_courts.json") as f:
    court_data = json.load(f)

# Create courts, store them in list to use later
public_courts = []

borough_ID_lookup = {
    "X": "Bronx",
    "B": "Brooklyn",
    "M": "Manhattan",
    "Q": "Queens",
    "R": "Staten Island"
}

for court in court_data:
    borough_ID = court["Prop_ID"][0]

    borough = borough_ID_lookup[borough_ID]
    name = court["Name"]
    location = court ["Location"]
    phone = court["Phone"]
    court_count = court["Courts"]
    indoor_outdoor = court["Indoor_Outdoor"]
    surface = court["Tennis_Type"]
    accessible = court["Accessible"]
    lat = court["lat"]
    long = court["lon"]

    db_court = crud.create_court(borough, name, location, phone, 
                                 court_count, indoor_outdoor, surface, 
                                 accessible, lat, long)
    
    public_courts.append(db_court)

model.db.session.add_all(public_courts)


### PLAYERS, USERS ###
# Load fake player data from JSON file
with open("data/playerdata.json") as f:
    all_player_data = json.load(f)

# Create 41 players, player_data contains 41 as of last output
n = 41
players = []
users = []

for i in range(n):
    player_data = all_player_data[i]

    # Randomly pick 5 courts, one will be the favorite
    pref_courts = sample(public_courts, 5)

    db_player = crud.create_player(
        fname = player_data["fname"],
        lname = player_data["lname"],
        gender = player_data["gender"],
        skill_lvl = player_data["init_lvl"],
        game_pref = player_data["game_pref"], 
        join_date = player_data["join_date"],
        pref_court = choice(pref_courts),
        photo = player_data["photo"])

    db_player.courts = pref_courts
    players.append(db_player)
    model.db.session.add(db_player)
    model.db.session.commit()

    password = player_data["password"]
    hashed_password = sha256(password.encode()).hexdigest()

    db_user = crud.create_user(
        player_id = db_player.id,
        email = player_data["email"],
        password = hashed_password)
    
    model.db.session.add(db_user)
    model.db.session.commit()

### ACTIVITIES ###
# Will create [a_count] # of activities where 
# 0 to n players submit a rating
a_count = 100
    
for i in range(a_count):
    
    # Generate random date from the past month
    now = datetime.now()
    start = now - timedelta(days=30)
    
    random_date = start + timedelta(
        days=randint(0, 30),
        hours=randint(0, 23),
        minutes=randint(0, 59),
        seconds=randint(0, 59),
    )

    db_activity = crud.create_activity(
        date = random_date,
        court = choice(public_courts),
        match_type = choice(["Match", "Practice"]),
        score = "SCORE")

    # # Randomly choose if activity was singles (2) or doubles (4)
    # player_count = choice([2, 4])
    # players_on_court = sample(players, player_count)
    
    # Add players to activity
    players_on_court = sample(players, 2)
    for p in players_on_court:
        db_activity.players.append(p)

    model.db.session.add(db_activity)
    model.db.session.commit()

    # Choose 2 players from activity and submit 1 rating
    player1, player2 = rating_pair = sample(players_on_court, 2)

    # Create sample comments
    comments =[
        "Great Serve! Hard to return.",
        "Fantastic Sportsmanship.",
        "Made questionable calls",
        "Plays at a professional level!",
        "Not very consistent.",
        "Great at rallying.",
        "The best tennis player in NYC!",
        "Good.",
        "Not a strategic player, but fun.",
        "Plays a serve and volley game, lookout!",
        "Will play together again.",
        "Strong baseliner with good footwork.",
        "Showed up late.",
        "Always enjoy hitting with them!",
        "OK.",
        "Better at pickleball.",
        "Defensive player."
    ]

    db_rating_1 = crud.create_rating(
        player_id = player1.id,
        commenter_id = player2.id,
        activity_id = db_activity.id,
        lvl_rating = choice([2.5, 3.0, 3.5, 4.0, 4.5, 5.0]),
        comments = choice(comments),
        created_at = random_date)
    
    db_rating_2 = crud.create_rating(
        player_id = player2.id,
        commenter_id = player1.id,
        activity_id = db_activity.id,
        lvl_rating = choice([2.5, 3.0, 3.5, 4.0, 4.5, 5.0]),
        comments = choice(comments),
        created_at = random_date)
    
    model.db.session.add(db_rating_1, db_rating_2)

model.db.session.commit()

