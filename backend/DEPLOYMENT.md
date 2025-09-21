# Deployment (Render / Production)

## Overview
This backend is a Flask application now prepared for production deployment using Gunicorn as the WSGI server. Render (and most PaaS providers) require your web process to listen on `0.0.0.0` and the port they assign via the `PORT` environment variable.

## Key Changes
- `app.py` now exposes a module-level `app` object for Gunicorn: `app = create_app()`
- Local dev still works via `python app.py` (auto-binds to `0.0.0.0:${PORT or 5000}`)
- Added `gunicorn` to `requirements.txt`
- Added `Procfile` with: `web: gunicorn app:app --bind 0.0.0.0:$PORT --log-level info`

## Environment Variables
Set these in Render dashboard (Environment tab):
- `SECRET_KEY`
- `JWT_SECRET_KEY`
- `DATABASE_URL` (Mongo connection string)
- `MONGO_DB_NAME`
- (Optional) `FLASK_ENV=production` to disable debug.

## Render Service Settings
- Environment: Python
- Build Command: `pip install -r backend/requirements.txt`
- Start Command: (Either leave blank to auto-detect Procfile or explicitly set) `cd backend && gunicorn app:app --bind 0.0.0.0:$PORT --log-level info`
- Root Directory: repository root (Render will run build in root; adjust paths accordingly)

If your root is the project root (contains `backend` & `frontend`), prefix build steps:
```
# Build Command
pip install -r backend/requirements.txt
```

## Health Check
Render optionally hits `/` by default. You have a health endpoint at `/health` returning JSON. You can configure a health check path in Render to `/health` for clearer diagnostics.

## CORS Note
Currently CORS allows all origins (`*`) while also setting `supports_credentials=True`. Browsers will block credentialed requests with wildcard origin. If you need cookies/auth headers cross-origin, replace with:
```
CORS(app, resources={r"/*": {"origins": ["https://your-frontend-domain.com"]}}, supports_credentials=True)
```

## Local Development
```
cd backend
python app.py  # or: flask run (if you configure FLASK_APP)
```
Accessible at: http://127.0.0.1:5000 (or 0.0.0.0:5000 for external access on LAN)

## Logs
Gunicorn logs are written to stdout/stderr; Render surfaces them in the dashboard. For more verbosity, add `--access-logfile -` to Procfile command.

## Common Issues
1. Port detection failure: Ensure binding `0.0.0.0:$PORT` (already handled).
2. Timeout on startup: Check Mongo connectivity string correctness.
3. 502 errors: Review logs; verify no exceptions on import (e.g., missing env vars).
4. CORS errors: Adjust allowed origins in production.

---
Happy deploying! 🎉
