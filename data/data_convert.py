import json
import csv
import sys

def json_to_csv(json_file_path, csv_file_path):

    with open(json_file_path) as f:
        data = json.load(f)

    with open(csv_file_path, mode='w') as f:
        writer = csv.writer(f)
        
        writer.writerow(data[0].keys())
        
        for item in data:
            writer.writerow(item.values())

def csv_to_json(csv_file_path, json_file_path):

    with open(csv_file_path) as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        
    with open(json_file_path, mode='w') as f:
        json.dump(rows, f)

if __name__ == '__main__':
    print("Usage: python data_convert.py [json_to_csv | csv_to_json]")
    print("Remember the files need to be in string quotes")
