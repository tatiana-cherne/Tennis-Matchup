import csv
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Function to scrape photos from ATP
def scrape_website_data(name):

    driver = webdriver.Chrome()
    url = "https://www.atptour.com/en/"
    driver.get(url)

    # Wait for the siteSearch input field to appear
    search_box = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "siteSearch"))
    )
    # Search Player
    search_box.clear()
    search_box.send_keys(name)

    # Wait for the playersWrapper div to appear
    players_div = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "playersWrapper"))
    )

    # Get the first image src file in the playersWrapper div
    player_img = players_div.find_element_by_tag_name('img').get_attribute('src')
    driver.quit()

    return (name, player_img)

with open('players.csv', 'r') as csv_file:
    csv_reader = csv.reader(csv_file)
    next(csv_reader)
    
    for row in csv_reader:
        player_name = row[0]
        player_data = scrape_website_data(player_name)
        print(f"{player_data[0]};{player_data[1]}\n")

# script to save down to folder system