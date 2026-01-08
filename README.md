# Unrivaled vs WNBA 🏀stats dashboard 

Unrivaled is a fast-paced, 3v3 women’s basketball league. Many of the players are in the WNBA.

This web app that runs a Cron job nightly to check the [Unrivaled stats website](https://www.unrivaled.basketball/stats/player) and displays some interactive data visualizations of the scraped stats with [chart.js](https://www.chartjs.org/), as well as compares the data to [existing 2025 WNBA data](https://www.rotowire.com/wnba/stats.php) (the season ended.) There’s a chatbot using [DigitalOcean Gradient AI](https://www.digitalocean.com/products/gradient/platform) with a knowledge base containing WNBA data and also self-updates/scrapes on the Unrivaled stats website nightly. It’s deployed to a [DigitalOcean droplet](https://www.digitalocean.com/products/droplets). 

Click to watch the full demo:
[![Watch the video](/gh-media/unrivaleddrop-thumbnail-github.png)](https://youtu.be/A7BZIVa03W4)

## Features

- Interactive charts with zoom, pan, and click functionality
- Searchable player stats tables
- Player comparison between Unrivaled and WNBA leagues
- AI chatbot with knowledge base
- Automated nightly data updates

## Tech Stack

**Backend**: FastAPI, Python 3, Playwright  
**Frontend**:   Chart.js, Gradient AI Chatbot  
**Deployment**: DigitalOcean Droplet, Nginx, Systemd  

## Quick Start
Make a droplet. Get YOUR_DROPLET_IP here
![/gh-media/dropletscreenshotconsole.png](screenshot of DigitalOcean console showing my Droplet)

```bash
# Setup environment
mkdir unrivaled-scrape-drop
cd unrivaled-scrape-drop
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt # fastapi uvicorn playwright
playwright install chromium

# Scrape and process data
python3 scraper.py
python3 convert_wnba_csv_to_json.py

# Run server
uvicorn app:app --reload
```
Visit `http://localhost:8000`

## Deployment

1. Upload files to `/unrivaled-scrape-drop/` on your droplet
    a. ssh into server: `ssh root@YOUR_DROPLET_IP`
    b. `scp -r * root@YOUR_DROPLET_IP:/unrivaled-scrape-drop/`
2. install dependencies on the server
```bash
```bash
cd /unrivaled-scrape-drop
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
playwright install chromium
playwright install-deps
```

3. Systemd keeps our app running even after we disconnect.
a.  Create service file!
```bash
nano /etc/systemd/system/unrivaled.service
```
b. Add this to it
```ini
[Unit]
Description=Unrivaled Basketball Stats API
After=network.target


[Service]
Type=simple
User=root
WorkingDirectory=/unrivaled-scrape-drop
ExecStart=/usr/bin/uvicorn app:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=3


[Install]
WantedBy=multi-user.target
```
c. enable and start!
```bash
systemctl enable unrivaled
systemctl start unrivaled
```

4. Configure Nginx as reverse proxy
```bash
nano /etc/nginx/sites-available/unrivaled
```
Add this to that file 
```nginx
server {
   listen 80;
   server_name YOUR_DROPLET_IP;


   location / {
       proxy_pass http://127.0.0.1:8000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
   }
}
```
Enable site
```bash
ln -s /etc/nginx/sites-available/unrivaled /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

5. Add cron job for nightly updates:
```bash
crontab -e
```

```bash
0 0 * * * cd /unrivaled-scrape-drop && python3 scraper.py >> /var/log/scraper.log 2>&1
```

Run locally with
`python3 -m http.server 8000` -> view: `http://localhost:8000/index.html`
Whenever you edit a file locally, copy it over to the Droplet:
`scp {charts.js} root@YOUR_DROPLET_IP:/unrivaled-scrape-drop


## Project Structure

```
├── Backend (Python)
│   ├── scraper.py - Playwright web scraper
│   ├── convert_wnba_csv_to_json.py - CSV parser
│   └── app.py - FastAPI server
├── Frontend (Vanilla JS)
│   ├── index.html - UI structure
│   └── charts.js - Chart.js visualizations
└── Deployment
   ├── Nginx - Reverse proxy
   ├── Systemd - Service management
   └── Cron - Scheduled updates
```