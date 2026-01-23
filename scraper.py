# scraper.py
from playwright.sync_api import sync_playwright
import json
from datetime import datetime

URL = "https://www.unrivaled.basketball/stats/player"
OUT = "data.json"

def scrape():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(URL, timeout=60000)
        page.wait_for_selector("tbody tr")

        rows = page.query_selector_all("tbody tr")
        players = []

        for row in rows:
            cells = [c.inner_text().strip() for c in row.query_selector_all("td")]
            # Expect: [rank, player, games, points, rebounds, assists, ...]
            if len(cells) < 20: # check to ensure all columns exist
                continue
            try:
                # 0:RK, 1:PLAYER, 2:GP, 3:MIN, 4:PTS, 5:FGM, 6:FGA, 7:FG%... 14:REB, 15:AST
                players.append({
                    "player": cells[1],
                    "games": float(cells[2]),
                    "mins": float(cells[3]),
                    "pts": float(cells[4]),
                    "rebs": float(cells[16]), # Corrected index
                    "asts": float(cells[17]), # Corrected index
                    "stls": float(cells[18]), # Corrected index
                    "blk": float(cells[19])   # Corrected index
                })
            except Exception as e:
                print(f"Skipping row with invalid stats: {cells} ({e})")

        browser.close()

    with open(OUT, "w") as f:
        json.dump({
            "updated_at": datetime.utcnow().isoformat(),
            "players": players
        }, f, indent=2)
    print(f"Scraped {len(players)} players")
    print("Wrote data.json to", OUT)

if __name__ == "__main__":
    scrape()
