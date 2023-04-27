from random import choice randrange, randint
from datetime import datetime, timedelta, date
from json import dumps

# Possible values for the attributes
gender_values = ["M", "F"]
init_lvl_values = [2.5, 3.0, 3.5, 4.0, 4.5, 5.0]
game_pref_values = ["singles", "doubles", "both"]
last_name_values = ["Federer", "Djokovic", "Nadal", "Williams", "Sharapova", "King"]

# Calculate range of possible days for date
start_date = date(2020, 1, 1)
end_date = date(2023, 3, 31)
days = (end_date - start_date).days

# Function to generate a random player dictionary
def generate_player_dict(id):
    join_date = start_date + timedelta(days=randrange(days))
    
    return {
        "id": id,
        "fname": f"Player{id}",
        "lname": choice(last_name_values),
        "gender": choice(gender_values),
        "init_lvl": choice(init_lvl_values),
        "game_pref": choice(game_pref_values),
        "join_date": join_date.strftime("%Y-%m-%d"),
        "pref_court_id": randint(1, 100)
    }

# Generate and print list of 50 player dictionaries
i = 50

player_dicts = [(generate_player_dict(id)) for id in range(1, i+1)]
player_dicts = dumps(player_dicts)

print(player_dicts)


