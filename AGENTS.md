# Base44 Dev Environment

## Project Overview
Equipment inventory management app ("Inventário de Equipamentos") for DiRad.
React frontend (Vite) + Node/Express backend with SQLite database.
Image uploads via Amazon S3 (optional — app runs without S3 credentials configured).

## Architecture
- **Frontend** (`frontend/`): React 18 + Vite dev server on port 5173 (mapped to host 3000).
  Vite proxies `/api` requests to the backend service. Bootstrap 5 via CDN for styling.
  SheetJS and jsPDF loaded via CDN for Excel/PDF export.
- **Backend** (`backend/`): Node.js + Express on port 8000. SQLite via `better-sqlite3`.
  Database file stored in a Docker volume at `backend/data/inventario.db`.
  S3 image upload at `POST /api/upload` (disabled if AWS credentials not set).
- **Single origin**: Only port 3000 is public. API calls go through Vite's proxy.

## Setup Notes
- The original repo committed project files inside `inventario.zip` (now superseded by React app).
- S3 credentials (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET, AWS_S3_REGION)
  are optional — the app starts without them and shows a warning in the upload form.
  Provide real values via the Base44 secrets dashboard to enable image uploads.
- `node:22` (full image) is used for the API service because `better-sqlite3` needs build tools.
- `node:22-slim` is used for the web service (no native modules needed).

## Verification
- `curl -s http://localhost:3000/` should return the React app HTML.
- `curl -s http://localhost:8000/api/equipamentos` should return `[]` (empty array).
- `curl -s http://localhost:8000/api/status` should return `{"uploadEnabled":false}` without S3 creds.
- Preview should show the inventory page with navbar, search, export buttons, and empty grid.
