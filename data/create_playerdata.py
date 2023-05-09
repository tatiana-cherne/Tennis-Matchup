from random import choice, choices, randrange, randint, shuffle
from datetime import datetime, timedelta, date
from json import dumps
import os
import cloudinary
from cloudinary.uploader import upload
from cloudinary.utils import cloudinary_url

# Cloudinary configuration
cloudinary.config(
  cloud_name = "tennismatchup",
  api_key = os.environ["CLOUDINARY_KEY"],
  api_secret = os.environ["CLOUDINARY_SECRET"],
  secure = True
)

# Possible values for the attributes
gender_values = ["M", "F"]
init_lvl_values = [2.5, 3.0, 3.5, 4.0, 4.5, 5.0]
email_values = ["gmail", "yahoo", "aol", "outlook"]
game_pref_values = ["Singles", "Doubles", "Both"]

men = ["Novak Djokovic", "Casper Ruud", "Stefanos Tsitsipas","Frances Tiafoe",
    "Rafael Nadal", "Nick Kyrgios", "Andy Murray", "John Isner", 
    "Roger Federer","Pete Sampras", "Andre Agassi", "Bjorn Borg",
    "Jimmy Connors", "Boris Becker", "Arthur Ashe", "Andy Roddick",
    "Marat Safin", "Stan Wawrinka", "Matteo Berrettini", "Dominic Thiem",
    "Wesley Koolhof"]

women = ["Serena Williams", "Martina Navratilova", "Chris Evert", "Martina Hingis",
    "Billie Jean-King", "Steffi Graf", "Venus Williams", "Monica Seles",
    "Maria Sharapova", "Lindsay Davenport", "Kim Clijsters", "Iga Swiate",
    "Margaret Court", "Justine Henin", "Naomi Osaka","Anna Kournikova",
    "Coco Gauff", "Madison Keys", "Jessica Pegula", "Elena Rybakina" ]

men = [(m, "M") for m in men]
women = [(w, "F") for w in women]

players = men + women
shuffle(players)

# Calculate range of possible days for date
start_date = date(2020, 1, 1)
end_date = date(2023, 3, 31)
days = (end_date - start_date).days

# Function to generate a random player dictionary
def generate_player_dict(i):
    id = i + 1
    name = players[i][0]

    join_date = start_date + timedelta(days=randrange(days))

    dir_path = "../imgs"
    filename = f"{name}.png"
    photo_path = os.path.join(dir_path, filename)
    response = upload(photo_path, public_id=f"playerphotos/{id}")
    url, options = cloudinary_url(response['public_id'], width=200, height=200, crop="fill")
    

    names = name.split()
    
    return {
        "id": id,
        "fname": names[0],
        "lname": names[1],
        "gender": players[i][1],
        "init_lvl": choice(init_lvl_values),
        "game_pref": choice(game_pref_values),
        "join_date": join_date.strftime("%Y-%m-%d"),
        "pref_court_id": randint(1, 30),
        "email": f"{names[0]}.{names[1]}@{choice(email_values)}.com",
        "password": "Password12345",
        "photo" : url
    }

# Generate and print list of 41 player dictionaries
i = 41

player_dicts = [(generate_player_dict(i)) for i in range(0, i)]
player_dicts = dumps(player_dicts)

print(player_dicts)








