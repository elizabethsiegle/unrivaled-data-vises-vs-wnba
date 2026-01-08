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
            if len(cells) < 6:
                continue
            try:
                player = cells[1]
                gp = float(cells[2])
                mins = float(cells[3])
                pts = float(cells[4])
                rebs = float(cells[7])
                asts = float(cells[8])
                stls = float(cells[9])
                blk = float(cells[10])
                players.append({
                    "player": player,
                    "games": gp,
                    "mins": mins,
                    "pts": pts,
                    "rebs": rebs,
                    "asts": asts,
                    "stls": stls,
                    "blk": blk

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
