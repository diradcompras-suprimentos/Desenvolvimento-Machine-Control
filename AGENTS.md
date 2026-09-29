# Base44 Dev Environment

## Project Overview
Static HTML/CSS/JS site — an equipment inventory app ("Inventário de Equipamentos") for DiRad.
No backend, no build step, no database. Data is stored in the browser's localStorage.

## Stack
- Pure static files: `index.html`, `css/style.css`, `js/app.js`
- Bootstrap 5.3, SheetJS (xlsx), jsPDF — all loaded via CDN
- Served by nginx (alpine) on host port 3000

## Running
```
docker compose -f docker-compose.base44.yml up -d
```
The repo root is bind-mounted read-only into nginx at `/usr/share/nginx/html`.
Edits to HTML/CSS/JS are reflected immediately on browser refresh (nginx reads from disk).

## Notes
- The repo root directory must be world-readable (chmod 755) so the nginx worker
  process can traverse it. If you get a 403, run `chmod 755 .` from the repo root.
- Source files were extracted from `inventario.zip`.
