# Netlify Deployment Guide (Frontend)

## 1. Overview
This frontend is built with Vite (React). It now uses an environment variable `VITE_API_BASE_URL` to talk to the backend. In production you've deployed the backend at:

https://truegradient.onrender.com

You do NOT hardcode the backend URL in code anymore; you set it at build time.

## 2. Environment Variable
In Netlify dashboard (Site Settings → Build & Deploy → Environment):
Add:
```
VITE_API_BASE_URL=https://truegradient.onrender.com
```

For local development create a `.env` file (ignored by git):
```
VITE_API_BASE_URL=http://127.0.0.1:5000
```
(See `.env.example` included.)

## 3. Build Settings (Netlify)
- Build Command: `npm run build`
- Publish Directory: `dist`
- Node Version: (optional) set to a recent LTS (e.g. 20) in Netlify or via `.nvmrc`

## 4. Single Page App Routing
File `public/_redirects` added with:
```
/* /index.html 200
```
This ensures React Router routes (e.g., `/chat`, `/signin`) work when directly accessed.

## 5. Deploy Options
### Option A: Connect Git Repository
Netlify auto-builds on push.
### Option B: Manual Deploy (ZIP Upload)
1. Run locally:
```
npm install
npm run build
```
2. Upload the generated `dist/` folder in Netlify (Drag & Drop deploy).
3. Make sure the environment variable was already set (for connected builds). Manual drag & drop builds bake in whatever `.env` values existed at build time on your machine.

## 6. Verifying After Deploy
1. Open the deployed site URL.
2. Sign Up / Sign In should hit backend endpoints at `https://truegradient.onrender.com`.
3. Open DevTools → Network; confirm requests go to that domain.
4. Try refreshing on a deep route (e.g., `/chat`); should still load (thanks to `_redirects`).

## 7. Troubleshooting
| Issue | Cause | Fix |
|-------|-------|-----|
| 401 after login | Token cleared by interceptor | Confirm backend JWT endpoints working & CORS allows origin |
| CORS error | Backend wildcard with credentials | Restrict CORS origin to actual Netlify domain if you need cookies/credentials |
| API base still localhost | Forgot to set `VITE_API_BASE_URL` before build | Rebuild after setting variable |
| Blank page on route refresh | Missing `_redirects` | Ensure file exists in `public/` before build |

## 8. Optional Hardening
- Set `VITE_API_BASE_URL` to a custom domain if you later map one to the backend.
- Add analytics or error tracking (Sentry, etc.).
- Use Netlify Headers file for security headers.

## 9. Clean Build Commands (Local)
```
cd frontend
npm install
VITE_API_BASE_URL=https://truegradient.onrender.com npm run build
```
Result emits production-optimized assets into `dist/`.

---
Happy shipping 🚀
