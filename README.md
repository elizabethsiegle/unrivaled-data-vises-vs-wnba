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
[Create a droplet here](https://cloud.digitalocean.com/droplets). Get YOUR_DROPLET_IP here in the console under <em>ipv4</em>
![screenshot of DigitalOcean console showing my Droplet](/gh-media/dropletscreenshotconsole.png)

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

3. Systemd keeps our app running 24/7 so you can access the web server dashboard at any time at http://143.110.229.164/ (and you could hook a domain up to it to make it prettier)

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
`scp {charts.js} root@YOUR_DROPLET_IP:/unrivaled-scrape-drop`

## Domain Setup & SSL
Once your dashboard is live at your IP, follow these steps to connect your domain and secure it with HTTPS.

1. Move Project to `/var/www`
Standard practice is to serve web apps from /var/www. Create the directory and move your files there:
```bash
# Create the directory
mkdir -p /var/www/unrivaled-scrape-drop

# Move your files
mv /unrivaled-scrape-drop/* /var/www/unrivaled-scrape-drop/

# Set ownership to Nginx user (www-data)
sudo chown -R www-data:www-data /var/www/unrivaled-scrape-drop
sudo chmod -R 755 /var/www/unrivaled-scrape-drop
```
1a. update service paths
Update `WorkingDirectory` and `ExecStart` paths in your `unrivaled.service` file and your `crontab` to reflect the new location:
```toml
WorkingDirectory=/var/www/unrivaled-scrape-drop
ExecStart=/var/www/unrivaled-scrape-drop/env/bin/uvicorn app:app --host 0.0.0.0 --port 8000
```
In `crontab -e`:
```bash
0 0 * * * cd /var/www/unrivaled-scrape-drop && /var/www/unrivaled-scrape-drop/env/bin/python3 scraper.py >> /var/log/scraper.log 2>&1
2. Configure DNS
Go to your domain registrar (e.g., Namecheap, Google, GoDaddy) and point your domain to DigitalOcean:

- A Record: Set `@` to your `YOUR_DROPLET_IP`.

- A Record: Set `www` to your `YOUR_DROPLET_IP`.

3. Update Nginx for the Domain
Update your Nginx configuration to recognize your domain and serve the files from the new /var/www path. (while SSH-d in)
```bash
nano /etc/nginx/sites-available/unrivaled
```
Update the file with this config:
```
server {
   listen 80;
   server_name unrivaleddata.com www.unrivaleddata.com;

   # Point to the new /var/www directory
   root /var/www/unrivaled-scrape-drop;

   location / {
       proxy_pass http://127.0.0.1:8000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
   }

   # Ensure JSON files are served correctly for Chart.js
   location ~* \.json$ {
       add_header Content-Type application/json;
       add_header Access-Control-Allow-Origin *;
   }
}
```
Test and reload:
```bash
nginx -t
systemctl reload nginx
```

4. install SSL
```bash
sudo apt update
sudo apt install python3-certbot-nginx
sudo certbot --nginx -d unrivaleddata.com -d www.unrivaleddata.com
```
4a. Permission fix (post-deploy)
If your charts don't load after the move, ensure the Nginx user has permission to read your project folder:
```bash
sudo chown -R www-data:www-data /unrivaled-scrape-drop
sudo chmod -R 755 /unrivaled-scrape-drop
```

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