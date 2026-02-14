# R&D Department Website — IIT Dharwad

A full-stack website for the Research & Development department, built with **React + Vite** (frontend) and an **Express.js** data-caching server (backend).

---

## Quick Start

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9

### 1. Clone & Install

```bash
git clone <repo-url> && cd Rnd-Dept

# Install backend dependencies
cd backend/data-api
npm install

# Install frontend dependencies
cd ../../frontend
npm install
```

### 2. Configure Environment

```bash
# Backend — copy template and set a strong admin password
cp backend/data-api/.env.example backend/data-api/.env
# Edit backend/data-api/.env → change ADMIN_PASSWORD

# Frontend — copy template and fill in values
cp frontend/.env.example frontend/.env
# Edit frontend/.env → set VITE_CAROUSEL_IMAGES_FOLDER
```

### 3. Start Development Servers

Open **two terminals**:

```bash
# Terminal 1 — Backend API (port 5000)
cd backend/data-api
npm run dev

# Terminal 2 — Frontend (port 3715)
cd frontend
npm run dev
```

The frontend Vite dev server automatically proxies `/api/*` requests to the backend at `localhost:5000`.

Open **http://localhost:3715** in your browser.

---

## Project Structure

```
Rnd-Dept/
├── backend/
│   └── data-api/           ← Express caching server
│       ├── server.js       ← Main server (routes, caching, admin API)
│       ├── sheets.json     ← Dynamic sheets added via admin panel
│       ├── .env.example    ← Environment template
│       └── package.json
├── frontend/
│   ├── src/
│   │   ├── admin/          ← Admin panel (login, sheet management)
│   │   ├── components/     ← Reusable UI components
│   │   ├── config/api.js   ← Central API URL configuration
│   │   ├── context/        ← React contexts (SheetStatusContext)
│   │   └── pages/          ← All route pages
│   ├── .env.example        ← Environment template
│   └── vite.config.js      ← Vite config with API proxy
├── deploy.sh               ← Production deployment script
└── .gitignore
```

---

## How It Works

### Data Flow

1. **Google Sheets** hold all website data (projects, people, publications, etc.)
2. **Backend server** fetches and caches every sheet in memory, refreshing every 10 minutes
3. **Frontend** calls `/api/sheets/<name>` — in dev, Vite proxies to the backend
4. Sidebar items are **automatically hidden** if their corresponding sheet is empty

### Admin Panel

Navigate to `/admin` to access the admin dashboard.

- **Login** — password is validated server-side with bcrypt (no plaintext on the client)
- **Built-in sheets** — links to all existing Google Sheets for editing
- **Add Sheet** — register a new Google Sheet; it will be cached automatically and appear in the sidebar once it has data
- **Remove Sheet** — deregister a dynamic sheet (doesn't delete the Google Sheet itself)

### Adding a New Data Source (Admin)

1. Go to `/admin` → click **"+ Add Sheet"**
2. Fill in:
   - **Sheet Key** — lowercase slug used in API URLs (e.g. `internships`)
   - **Spreadsheet ID** — from the Google Sheets URL: `https://docs.google.com/spreadsheets/d/{THIS_PART}/edit`
   - **Sheet Tab** — name of the tab within the spreadsheet (default: `Sheet1`)
   - **Display Label** — human-readable name for display
   - **Category** — where it appears in the sidebar (Projects dropdown, Committees, etc.)
   - **Route Path** — the page URL path
3. Click **"Add Sheet Source"** — the backend fetches it immediately

### Changing the Admin Password

Edit `backend/data-api/.env`:

```
ADMIN_PASSWORD=YourNewSecurePassword
```

Restart the backend server. The password is hashed with bcrypt at startup.

---

## Production Deployment

```bash
# Build frontend
cd frontend
npm run build    # → outputs to frontend/dist/

# Start backend
cd ../backend/data-api
NODE_ENV=production node server.js
```

In production, set `VITE_API_URL` in `frontend/.env` to the backend server's public URL before building.

---

## Environment Variables

### Backend (`backend/data-api/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | API server port |
| `REFRESH_MINUTES` | `10` | Data refresh interval |
| `ADMIN_PASSWORD` | *(fallback)* | Admin login password |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_CAROUSEL_IMAGES_FOLDER` | — | Google Drive folder URL for carousel |
| `VITE_API_URL` | *(empty)* | Backend URL (leave empty in dev) |
