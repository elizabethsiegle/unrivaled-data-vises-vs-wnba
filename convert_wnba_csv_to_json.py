import csv
import json

# Read WNBA player stats from CSV and write to JSON for charts.js
input_csv = 'wnba-player-stats.csv'
output_json = 'wnba.json'

players = []



# Skip first two header rows, then parse player stats by index
with open(input_csv, newline='', encoding='utf-8') as csvfile:
    # Skip first two lines
    for _ in range(2):
        next(csvfile)
    reader = csv.reader(csvfile)
    for row in reader:
        if not row or len(row) < 9:
            continue
        player = row[1].strip()
        if not player or player == 'Player':
            continue
        try:
            points = float(row[6])
            rebounds = float(row[7])
            assists = float(row[8])
        except (ValueError, IndexError):
            continue
        players.append({
            'player': player,
            'points': points,
            'rebounds': rebounds,
            'assists': assists
        })

with open(output_json, 'w', encoding='utf-8') as jsonfile:
    json.dump(players, jsonfile, indent=2)

print(f"Extracted {len(players)} players to {output_json}")
