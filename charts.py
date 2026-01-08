import json
import matplotlib.pyplot as plt

# Load the data
with open("data.json") as f:
    data = json.load(f)

players = data["players"]

# Get player names and stats
names = [p["player"] for p in players]
points = [p["points"] for p in players]
rebounds = [p["rebounds"] for p in players]
assists = [p["assists"] for p in players]

# Plot points
plt.figure(figsize=(16, 6))
plt.bar(names, points, color='skyblue')
plt.xticks(rotation=90)
plt.title("Points by Player")
plt.ylabel("Points")
plt.tight_layout()
plt.savefig("points_chart.png")
plt.close()

# Plot rebounds
plt.figure(figsize=(16, 6))
plt.bar(names, rebounds, color='lightgreen')
plt.xticks(rotation=90)
plt.title("Rebounds by Player")
plt.ylabel("Rebounds")
plt.tight_layout()
plt.savefig("rebounds_chart.png")
plt.close()

# Plot assists
plt.figure(figsize=(16, 6))
plt.bar(names, assists, color='salmon')
plt.xticks(rotation=90)
plt.title("Assists by Player")
plt.ylabel("Assists")
plt.tight_layout()
plt.savefig("assists_chart.png")
plt.close()

print("Charts saved as points_chart.png, rebounds_chart.png, assists_chart.png")