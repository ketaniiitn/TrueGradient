# TrueGradient

Full-stack chat application ( MVP ) consisting of:
- Backend: Flask + JWT + MongoDB Atlas (containerized / previously Render)
- Frontend: React (Vite) + Redux Toolkit (containerized, deployable to Vercel / Netlify)

---
## Features
- User registration, login, logout (JWT based)
- Protected routes on frontend (`ProtectedRoute` wrapper)
- Post-auth conditional hydration of chat state (Strategy 2) – no pre-login localStorage leakage
- Chat UI with:
  - Conversations, suggestion cards, typing indicator (animated loader)
  - Delayed assistant mock replies (extensible to real backend in future)
  - Coins counter (decrements per user message; purely client-side now)
  - Message timestamps (`createdAt` per message)
- Global loading overlay for auth/chat operations
- Health & connectivity test endpoints (`/health`, `/api/test`)
- Environment-driven API base URL (`VITE_API_BASE_URL`) supporting multi-environment deploys
- SPA routing with fallbacks for Netlify (`_redirects`) and Vercel (`vercel.json`)
- Automatic localStorage clearing on logout & fresh login ensures no stale chat data persists across users

---
## Repository Structure
```
backend/
  app.py             # Flask app + WSGI entry (exposes app)
  config.py          # Environment configuration
  extensions.py      # Mongo & JWT init
  routes/auth/       # Auth blueprint (login/register/logout/profile)
  models/user.py     # User model + indexes
  utils/security.py  # Password hashing & security helpers
  requirements.txt   # Python deps (includes gunicorn for prod)
  Procfile           # Render process declaration
  DEPLOYMENT.md      # Backend deployment guide (Render)
frontend/
  src/
    services/api.js  # Axios instance using VITE_API_BASE_URL
    store/           # Redux slices (auth, chat)
    components/      # UI components (chat + global loader)
    pages/           # Route pages (SignIn, SignUp, ChatDashboard, ChatSession)
  public/_redirects  # Netlify SPA fallback
  vercel.json        # Vercel SPA routes & build config
  DEPLOYMENT_NETLIFY.md # Netlify deployment guide
  README.md          # (legacy template + UI evolution notes)
README.md            # (this file) root consolidated documentation
```

---
## Backend Overview
- Framework: Flask 2.x
- Auth: JWT (Flask-JWT-Extended)
- Database: MongoDB (PyMongo)
- CORS: Currently permissive (`*`) – tighten for production (see Hardening section)
- Entry points:
  - `app.py` provides `app` object for Gunicorn (`gunicorn app:app --bind 0.0.0.0:$PORT`)
  - Local dev: `python app.py`

### Environment Variables (Backend)
| Variable | Purpose |
|----------|---------|
| SECRET_KEY | Flask session / signing (change in production) |
| JWT_SECRET_KEY | JWT signing secret |
| DATABASE_URL | MongoDB connection string |
| MONGO_DB_NAME | Mongo database name |
| FLASK_ENV | `development` or `production` |
| PORT | (Injected by Render) |

### Key Routes
| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Service health check |
| GET | /api/test | Simple connectivity test |
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Authenticate & issue JWT |
| POST | /api/auth/logout | (Stateless – client clears token) |
| GET | /api/auth/profile | Returns user profile (JWT required) |

---
## Frontend Overview
- Tooling: Vite + React 19 + Redux Toolkit
- Routing: `BrowserRouter` + protected routes
- State Persistence Strategy: Hydrate chat state after authentication only (prevents previous user’s chat from appearing to new user).
- LocalStorage Keys: token, user, (and custom chat state key if later enabled). Cleared on logout.

### Environment Variables (Frontend)
| Variable | Purpose |
|----------|---------|
| VITE_API_BASE_URL | Backend base URL (e.g., https://truegradient.onrender.com) |

Define in `.env` during development or via hosting provider environment settings at build time.

### Logout & LocalStorage Behavior
Upon logout:
- Token removed
- User object removed
- Chat state not rehydrated until next successful login
This guarantees isolation between user sessions.

---
## Deployment
### Backend (Render)
1. Render Web Service connected to repo root (or `backend` subdir) 
2. Build command: `pip install -r backend/requirements.txt`
3. Start command: `cd backend && gunicorn app:app --bind 0.0.0.0:$PORT --log-level info`
4. Set environment variables (see above)
5. Optional: Health check path `/health`

### Frontend (Vercel)
- `vercel.json` ensures SPA fallback to `index.html` for deep links
- Build: `npm run build` in `frontend` directory
- Output: `dist/`
- Env var: `VITE_API_BASE_URL` set to backend URL

### Frontend (Netlify Alternative)
- `_redirects` file ensures SPA fallback
- Build command: `npm run build`
- Publish directory: `dist`

---
## Quick Start (Local)
### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # (if example provided)
python app.py
```
Backend at: http://127.0.0.1:5001

### Frontend
```bash
cd frontend
npm install
# Optional: echo VITE_API_BASE_URL=http://127.0.0.1:5001 > .env
npm run dev
```
Frontend at: http://localhost:5173 (Vite default) or per console output

---
## Docker
Docker setup is now implemented and uses MongoDB Atlas (no local Mongo container). Backend listens on port 5001.

### Files Added
```
backend/Dockerfile        # Gunicorn-based Flask runtime (port 5001)
backend/.dockerignore
frontend/Dockerfile       # Multi-stage Vite build -> Nginx static server
frontend/nginx.conf
frontend/.dockerignore
docker-compose.yml        # Orchestrates backend + frontend (Atlas external)
.env.example              # Consolidated env vars (copy to .env)
backend/.env.example
```

### Environment Variables
Create a `.env` file in the project root (copy from `.env.example`) and fill in your Atlas credentials:
```
SECRET_KEY=change-this-secret
JWT_SECRET_KEY=change-this-jwt-secret
DATABASE_URL=mongodb+srv://<user>:<pass>@<cluster-host>/<db>?retryWrites=true&w=majority
MONGO_DB_NAME=truegradient
FLASK_ENV=production
PORT=5001
VITE_API_BASE_URL=http://localhost:5001
```

### Build & Run (Windows PowerShell)
```powershell
docker compose build
docker compose up -d
```

### Access
- Backend: http://localhost:5001/health
- Frontend: http://localhost:5173

### Rebuilding After Code Changes
For backend (Python deps unchanged):
```powershell
docker compose up -d --build backend
```
For frontend (rebuild bundle):
```powershell
docker compose up -d --build frontend
```

### Logs & Troubleshooting
```powershell
docker compose logs -f backend
docker compose logs -f frontend
```

If the backend fails to connect to MongoDB Atlas, verify:
- IP/network access list allows your machine / 0.0.0.0/0 (temporary for dev)
- Correct username/password and database name
- `mongodb+srv://` URI includes the target database or provide `MONGO_DB_NAME`

### Stopping & Cleanup
```powershell
docker compose down
# Remove images & dangling resources (optional)
docker image prune -f
```

### Live Development Option
For rapid iteration you can still run services outside Docker locally while keeping .env alignment.

---
## Security / Hardening Checklist (Future)
| Item | Status | Notes |
|------|--------|-------|
| Restrict CORS origins | Pending | Replace `*` with production frontend domain(s) |
| HTTPS enforcement | Hosting dependent | Use custom domains + TLS |
| JWT refresh / rotation | Pending | Introduce refresh tokens & blacklist if required |
| Rate limiting | Pending | Add Flask-Limiter for auth endpoints |
| Chat persistence | Pending | Store messages server-side instead of client mock |
| Input validation | Basic | Add schema validation (e.g., Marshmallow / Pydantic via wrapper) |
| Logging & monitoring | Minimal | Add structured logging & error tracking |

---
## Development Notes
- Assistant replies currently mocked in frontend (`simulateAssistantReply`). To integrate real AI/chat backend, implement `/api/chat` in Flask and return structured response.
- Coins feature is client-only; if it becomes billing-related, persist & validate server-side.
- Typing placeholder message distinguished by internal flag – remove when real streaming is implemented.

---
## Future Improvements
- Real chat pipeline (LLM / inference API integration)
- CI pipeline (GitHub Actions)
- E2E tests (Playwright/Cypress) + component tests (React Testing Library)
- Dark mode toggle & theme persistence
- Message editing / regeneration UX
- Optimistic updates with server reconciliation

---
## License
Currently unspecified – add a license file if intending open source distribution.

---
## Acknowledgements
Built with Flask, React, Redux Toolkit, Vite, TailwindCSS.
