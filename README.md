# UrojoBooking

## Deployment files added

- `render.yaml` (root): Deploys Django backend + PostgreSQL on Render.
- `vercel.json` (root): Deploys Vite frontend on Vercel.
- `backend/requirements.txt`: Python dependencies for Render build.
- `frontend/.env.example`: Frontend environment variable template.

## Render (Backend)

1. Push this repo to GitHub.
2. In Render, create a new **Blueprint** and select the repo.
3. Render will read `render.yaml` automatically and create:
   - Web service: `urojoselling-backend`
   - Postgres database: `urojoselling-db`
4. Set these environment variables on the backend service:
   - `CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app`
   - `CSRF_TRUSTED_ORIGINS=https://your-frontend.vercel.app`

Backend URL example after deploy:
`https://your-backend-name.onrender.com`

## Vercel (Frontend)

1. Import the same repo into Vercel.
2. Vercel reads `vercel.json` from root automatically.
3. Add frontend env var in Vercel project settings:
   - `VITE_API_BASE_URL=https://your-backend-name.onrender.com`
4. Redeploy.

## Notes

- Frontend calls backend through `VITE_API_BASE_URL` (see `frontend/src/services/api.js`).
- For local development, frontend still works with Vite proxy if no `VITE_API_BASE_URL` is set.
