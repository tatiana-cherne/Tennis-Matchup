"""Script to seed database."""

import os
import json
from random import choice, randint, sample
from datetime import datetime

import crud
import model
import server

import sys

os.system("dropdb tennis")
os.system("createdb tennis")

model.connect_to_db(server.app)
model.db.create_all()

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

# Load fake player data from JSON file
with open("data/playerdata.json") as f:
    all_player_data = json.load(f)

# Create n players, player_data contains 50 as of last output
n = 50
players = []

for i in range(n):
    player_data = all_player_data[i]

    db_player = crud.create_player(
        fname = player_data["fname"],
        lname = player_data["lname"],
        gender = player_data["gender"],
        skill_lvl = player_data["init_lvl"],
        game_pref = player_data["game_pref"], 
        join_date = player_data["join_date"],
        pref_court = choice(public_courts))
    
    players.append(db_player)
    
model.db.session.add_all(players)

# Load fake player data from JSON file
with open("data/userdata.json") as f:
    all_user_data = json.load(f)

# Create n players, player_data contains 50 as of last output
n = 50
users = []

for i in range(n):
    user_data = all_user_data[i]

    db_user = crud.create_user(
        player_id=user_data["player_id"],
        email=user_data["email"],
        password=user_data["password"])
    
    players.append(db_user)
    
model.db.session.add_all(users)

# # Will create [a_count] # of activities where 
# # 0 to n players submit a rating
# a_count = 30
    
# for i in range(a_count):

#     db_activity = crud.create_activity(
#         date = datetime.now(),
#         court = choice(public_courts),
#         match_type = choice(["match", "practice"]),
#         score = "SCORE")

#     # Randomly choose if activity was singles (2) or doubles (4)
#     player_count = choice([2, 4])
#     players_on_court = sample(players, player_count)
    
#     # Add players to activity
#     for p in players_on_court:
#         db_activity.players.append(p)

#     model.db.session.add(db_activity)

#     # Choose 2 players from activity and submit 1 rating
#     rating_pair = sample(players_on_court, 2)

#     db_rating = crud.create_rating(
#         player = rating_pair[0],
#         commenter = rating_pair[1],
#         activity = db_activity,
#         lvl_rating = choice([2.5, 3.0, 3.5, 4.0, 4.5, 5.0]),
#         comments = f"Comments on Player",
#         created_at = datetime.now())
    
#     model.db.session.add(db_rating)

model.db.session.commit()

