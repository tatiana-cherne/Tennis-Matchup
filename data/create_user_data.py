from string import ascii_lowercase, ascii_uppercase, digits
from json import dumps
from random import choices, choice

# Possible values for the attributes
email_values = ["gmail", "yahoo", "aol", "outlook"]

# Function to generate a random user dictionary, based off players
def generate_user_dict(id):
    # Generate password with 12 chars, with 1 uppercase and 1 number
    chars = choices(ascii_lowercase, k=10)
    chars.append(choice(ascii_uppercase))
    chars.append(choice(digits))

    return {
        "player_id": id,
        "email": f"example{id}@{choice(email_values)}.com",
        "password": ''.join(chars)}

# Generate and print list of 50 player dictionaries
i = 50

user_dicts = [(generate_user_dict(id)) for id in range(1, i+1)]
user_dicts = dumps(user_dicts)

print(user_dicts)