# BidGrid Frontend (React + Vite)

Premium React frontend for the BidGrid e-auction platform built with Vite, React Router, Tailwind CSS, and Axios.

## Prerequisites
- Node.js 18+ recommended
- Backend API running at `http://localhost:8080/api` (or set `VITE_API_BASE_URL`)

## Setup
1) Install dependencies
```powershell
Set-Location "c:\Users\raksh\Documents\e-auction\eauction-frontend"
npm install
```

2) Configure environment (optional)
- Copy `.env.example` to `.env` and adjust as needed.
- Default API base is `http://<host>:8080/api` if `VITE_API_BASE_URL` is not set.

Example `.env`:
```
VITE_API_BASE_URL=http://localhost:8080/api
# Firebase (required only for Google Sign-In)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## Development
Start the dev server (PowerShell):
```powershell
Set-Location "c:\Users\raksh\Documents\e-auction\eauction-frontend"
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm run dev
```
Vite will serve on `http://localhost:5173` (or next free port).

## Production build and preview
```powershell
Set-Location "c:\Users\raksh\Documents\e-auction\eauction-frontend"
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm run build
npm run preview
```
Preview runs at `http://localhost:4173` by default.

## Notes
- If the page shows a generic error, the app’s ErrorBoundary provides a friendly fallback; check the browser console for the exact stack.
- API calls log base URL and request info in development for easier debugging (`src/services/api.js`).
- Google Sign-In requires Firebase env variables; without them, only that button will fail gracefully.
