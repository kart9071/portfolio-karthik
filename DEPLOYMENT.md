# Portfolio Deployment

## Hosting
- **Domain:** karthikshetty.co.in
- **Server:** GCP VM — `136.118.61.122`
- **Frontend:** React (Vite) → served via Nginx
- **Backend:** Flask → `api.karthikshetty.co.in` → `localhost:8000`

---

## DNS Records (set in your registrar)
| Type | Name | Value |
|------|------|-------|
| A | `@` | `136.118.61.122` |
| A | `www` | `136.118.61.122` |
| A | `api` | `136.118.61.122` |

---

## What's Done
- Nginx installed and configured (`/etc/nginx/sites-available/portfolio`)
- Certbot + python3-certbot-nginx installed
- SSL attempted — **failed** (DNS not propagated yet)

---

## Remaining Steps

### 1. Verify DNS (after adding records)
```bash
host karthikshetty.co.in 8.8.8.8
```

### 2. Get SSL certificate
```bash
sudo certbot --nginx -d karthikshetty.co.in -d www.karthikshetty.co.in -d api.karthikshetty.co.in
```

### 3. Deploy backend
```bash
sudo apt install -y python3-pip python3-venv
python3 -m venv ~/venv
source ~/venv/bin/activate
pip install flask flask-cors gunicorn
```

```bash
sudo tee /etc/systemd/system/portfolio-backend.service > /dev/null <<EOF
[Unit]
Description=Portfolio Flask Backend
After=network.target

[Service]
User=karthikakala13
WorkingDirectory=/home/karthikakala13/portfolio-backend
Environment="PATH=/home/karthikakala13/venv/bin"
ExecStart=/home/karthikakala13/venv/bin/gunicorn -w 2 -b 127.0.0.1:8000 app:app
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable portfolio-backend
sudo systemctl start portfolio-backend
```

### 4. Check services
```bash
sudo systemctl status portfolio-backend
sudo systemctl status nginx
```

---

## CI/CD

Deploys are automated via GitHub Actions on every push to `master`.
See [PIPELINE.md](PIPELINE.md) for the pipeline and its one-time setup.
The commands above are the original one-time server provisioning.
