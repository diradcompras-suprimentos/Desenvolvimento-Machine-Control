# Base44 Dev Environment

## Project Overview
Static HTML/CSS/JS app for equipment inventory management ("Inventário de Equipamentos").
No build step, no backend — pure client-side app using localStorage for persistence.

## Setup Notes
- The original repo committed project files inside `inventario.zip`. The extracted
  files (`index.html`, `css/style.css`, `js/app.js`) are served directly by nginx.
- Served via `nginx:alpine` on host port 3000 (container port 80).
- No dependencies to install; no secrets required.
- External CDNs (Bootstrap, SheetJS, jsPDF) are loaded at runtime in the browser.

## Verification
- `curl -s http://localhost:3000/` should return the HTML page.
- Preview should show the inventory page with navbar, search, export buttons, and empty grid.
