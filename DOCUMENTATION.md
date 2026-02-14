# IIT Dharwad — R&D Website

## Comprehensive Technical Documentation

**Tech Stack:** React, Vite, Tailwind CSS, Express.js, Node.js  

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Folder Structure](#3-folder-structure)
4. [Backend — Data API Server](#4-backend--data-api-server)
   - [Environment Setup](#41-environment-setup)
   - [Data Sources](#42-data-sources)
   - [Caching System](#43-caching-system)
   - [API Endpoints](#44-api-endpoints)
   - [Admin Authentication](#45-admin-authentication)
   - [Dynamic Sheet Management](#46-dynamic-sheet-management)
   - [Hide/Unhide System](#47-hideunhide-system)
5. [Frontend — React Application](#5-frontend--react-application)
   - [Environment Setup](#51-environment-setup)
   - [Routing & Pages](#52-routing--pages)
   - [Components](#53-components)
   - [Dynamic Sidebar Visibility](#54-dynamic-sidebar-visibility)
   - [Admin Panel](#55-admin-panel)
   - [Styling & Tailwind CSS](#56-styling--tailwind-css)
6. [How Data Flows (End to End)](#6-how-data-flows-end-to-end)
7. [Development Guide](#7-development-guide)
---

## 1. Project Overview

The R&D Website is the public-facing portal for IIT Dharwad's research activities. It displays information about:

- **Sponsored & Consultancy projects** funded by agencies like DST, SERB, DRDO, DAE, DBT, etc.
- **Publications & Patents** produced by faculty
- **People** — faculty, staff, and current/former Research Deans
- **Research Areas & Labs** across 10 departments (CSE, EECE, Physics, Chemistry, etc.)
- **Committees** — Ethics, IPR, and Biosafety
- **Funding statistics** and project analytics
- **Forms, Documents, CSR projects, Workshops, Fellowships, Opportunities**

All content is driven by **Google Sheets** — faculty and staff edit spreadsheets, and the website reflects changes automatically every 10 minutes via a caching backend server.

---

## 2. Architecture

**Key architectural decisions:**

| Concern | Approach |
|---------|----------|
| Data source | Google Sheets (edited by staff), Google Docs (Dean's message) |
| Data access | OpenSheet API (`opensheet.elk.sh`) translates Sheets → JSON |
| Performance | Backend caches all data in-memory; refreshes every 10 min |
| Frontend data fetching | All pages fetch from `/api/sheets/{name}` (proxied to backend) |
| Sidebar visibility | Sidebar items auto-hide when their Google Sheet is empty |
| Admin features | Password-protected panel to add/remove/hide data sources at runtime |
| Deployment | Single-server: backend runs as a Node process, frontend is a static Vite build |

---

## 3. Folder Structure

```
Rnd-Dept/
├── package.json               # Root package.json (workspace-level)
├── DOCUMENTATION.md           # ← This file
│
├── backend/
│   └── data-api/
│       ├── server.js          # Main Express server (721 lines)
│       ├── package.json       # Backend dependencies  
│       ├── .env               # Secret environment variables (not committed)
│       ├── .env.example       # Template for .env
│       ├── sheets.json        # Runtime-generated: dynamic sheet configs
│       └── hidden_sheets.json # Runtime-generated: list of hidden sheet keys
│
└── frontend/
    ├── index.html             # Vite entry point
    ├── vite.config.js         # Vite + Tailwind + proxy configuration
    ├── tailwind.config.js     # Tailwind CSS 4 configuration
    ├── package.json           # Frontend dependencies
    │
    └── src/
        ├── App.jsx            # Root component with all routes
        ├── main.jsx           # React DOM entry point
        ├── index.css          # Global CSS (Tailwind imports)
        ├── searchData.jsx     # Static search index (300+ entries)
        │
        ├── admin/
        │   ├── adminGate.jsx  # Login gate → renders AdminPanel when authenticated
        │   ├── adminPanel.jsx # Admin dashboard: manage sheets, hide/unhide
        │   └── adminLinks.js  # Admin route definitions
        │
        ├── config/
        │   └── api.js         # API URL helpers, admin auth helpers
        │
        ├── context/
        │   ├── SheetStatusContext.jsx  # Provider: fetches /api/sheets-status
        │   ├── sheetStatusDef.js       # Context definition (createContext)
        │   └── sheetMappings.js        # Route → sheet key maps, visibility logic
        │
        ├── components/
        │   ├── Navbar/Navbar.jsx       # Left sidebar navigation
        │   ├── Topbar/Topbar.jsx       # Top bar with logo + mobile menu
        │   ├── Footer/Footer.jsx       # Site footer
        │   ├── Breadcrumbs/            # Auto breadcrumb trail
        │   ├── BackToTop/              # Scroll-to-top button
        │   ├── Carousel/               # Homepage image carousel
        │   ├── LoadingSkeleton/        # Loading placeholder
        │   ├── MyDropdownNav/          # Dropdown menus for sidebar:
        │   │   ├── MyDropdownNav.jsx   #   Projects dropdown
        │   │   ├── ethicsdropdown.jsx  #   Committees dropdown
        │   │   └── statsdropdown.jsx   #   Statistics dropdown
        │   ├── PageHeader/             # Reusable page title header
        │   ├── PageTransition/         # Route transition animations
        │   ├── PDFViewer/              # PDF document viewer
        │   ├── ProjectFilters/         # Filtering + pagination for tables
        │   ├── StatisticsDashboard/    # Charts for funding/office stats
        │   └── labnav.jsx              # Sub-navigation for /Labs/* pages
        │
        └── pages/
            ├── Home.jsx               # Homepage with carousel + message
            ├── People.jsx             # Faculty & staff directory
            ├── Deans.jsx              # Current & former Research Deans
            ├── Publications.jsx       # Publications list
            ├── Patents.jsx            # Patents list
            ├── Sponsored.jsx          # Sponsored projects
            ├── Consultancy.jsx        # Consultancy projects
            ├── CSRProjects.jsx        # CSR-funded projects
            ├── Csr.jsx                # CSR donations page
            ├── sgnf.jsx               # SGNF projects
            ├── Fellowship.jsx         # Fellowships
            ├── Workshops.jsx          # Workshops & conferences
            ├── Documents.jsx          # Office documents & circulars
            ├── Forms.jsx              # R&D forms
            ├── Opportunities.jsx      # Call for proposals
            ├── ResearchAreas.jsx      # Research areas overview
            ├── Message.jsx            # Dean's message (from Google Doc)
            ├── feedback.jsx           # Feedback form
            ├── biosafety.jsx          # Biosafety committee
            ├── ethicscommitte.jsx     # Ethics committee
            ├── iprcommittee.jsx       # IPR committee
            ├── Funding_statistics.jsx # Funding statistics dashboard
            ├── Office_statistics.jsx  # Office statistics
            ├── statsofprojects.jsx    # Project statistics
            ├── statsofpublications.jsx# Publication statistics
            ├── searchresults.jsx      # Global search results
            ├── DynamicSheetPage.jsx   # Generic page for admin-added sheets
            └── labs/                  # Lab pages (one per department)
                ├── cse.jsx
                ├── biosciences.jsx
                ├── chemistry.jsx
                ├── chemicaleng.jsx
                ├── civil.jsx
                ├── ece.jsx
                ├── humanities.jsx
                ├── mathematics.jsx
                ├── mechanical.jsx
                └── physics.jsx
```

---

## 4. Backend — Data API Server

**File:** `backend/data-api/server.js` (721 lines, pure Express.js)

The backend is a **caching proxy** that sits between the frontend and Google Sheets. It:

1. Fetches data from 26+ Google Sheets, 3 CSV exports, and 1 Google Doc on startup
2. Stores everything in an **in-memory cache** (`Map`)
3. Refreshes all data every 10 minutes automatically
4. Serves cached data to the frontend via REST endpoints
5. Provides admin APIs for managing sheets at runtime

### 4.1 Environment Setup

Copy `.env.example` to `.env` and configure:

```env
# Port the API server listens on
PORT=3716

# Cache refresh interval (minutes)
REFRESH_MINUTES=10

# Admin password (used for admin login — hashed with bcrypt at startup)
ADMIN_PASSWORD=YourSecurePassword
```

**Install & run:**

```bash
cd backend/data-api
npm install
npm start          # Production
npm run dev         # Development (auto-restart on changes via --watch)
```

### 4.2 Data Sources

The server fetches from three types of sources:

#### OpenSheet Sources (26 sheets)

These use the [OpenSheet API](https://opensheet.elk.sh/) which converts published Google Sheets into JSON. **Row 1 of each sheet is treated as column headers; data starts from Row 2.**

#### CSV Export Sources (3)

For spreadsheets that can't use OpenSheet (e.g., `.xlsx` files):

| Key | Description |
|-----|-------------|
| `workshops` | Workshops & conferences |
| `fellowship` | Fellowship data |
| `patents-count` | Total patent count (single number) |

#### Google Doc Sources (1)

| Key | Description |
|-----|-------------|
| `dean-message` | HTML content of the Dean's message |

- **On startup:** All sources are fetched in batches of 5 concurrent requests
- **Every `REFRESH_MINUTES`:** All sources are re-fetched automatically
- **On cache miss:** If a request arrives for a sheet that isn't cached, it's fetched on-demand
- **Stale data:** If a refresh fails, the old cached data is preserved rather than cleared
- **Headers:** Responses include `X-Cache: HIT|MISS|STALE` and `X-Cached-At` headers

### 4.4 API Endpoints

#### Public Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/sheets/:name` | Get cached data for a sheet (JSON array) |
| `GET` | `/api/content/:name` | Get cached HTML content (Google Docs) |
| `GET` | `/api/sheets` | List all available sheet/content names |
| `GET` | `/api/sheets-status` | Get status of all sheets (hasData, records, hidden, dynamic, etc.) |
| `GET` | `/api/health` | Health check with cache stats and uptime |
| `POST` | `/api/refresh` | Force refresh one sheet (`{ name }`) or all sheets (no body) |

#### Admin Endpoints (require `Authorization: Bearer <token>`)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/admin/login` | Login with password → returns `{ token }` |
| `POST` | `/api/admin/logout` | Invalidate current token |
| `GET` | `/api/admin/verify` | Check if current token is valid |
| `POST` | `/api/admin/sheets` | Add a new dynamic sheet |
| `DELETE` | `/api/admin/sheets/:name` | Remove a dynamic sheet |
| `GET` | `/api/admin/dynamic-sheets` | List all dynamic sheets |
| `POST` | `/api/admin/sheets/:name/hide` | Hide a sheet from sidebar |
| `POST` | `/api/admin/sheets/:name/unhide` | Unhide a sheet |
| `GET` | `/api/admin/hidden-sheets` | List all hidden sheet keys |

### 4.5 Admin Authentication

- **Password** is set via the `ADMIN_PASSWORD` environment variable
- On startup, the password is **hashed with bcrypt** — plaintext is never stored or compared
- Login generates a random 32-byte hex token stored in an in-memory `Map`
- Tokens expire after **30 minutes** (refreshed on each authenticated request)
- Expired tokens are cleaned up every 5 minutes
- The frontend stores the token in `sessionStorage` (cleared when the browser tab closes)

### 4.6 Dynamic Sheet Management

Admins can add new Google Sheets at runtime through the admin panel:

1. Admin provides: display name, Google Sheet URL, sheet tab name, sidebar category
2. Backend extracts the spreadsheet ID, creates a cache key, saves to `sheets.json`
3. The sheet is immediately fetched and cached
4. The `sheets-status` endpoint includes it as `dynamic: true` with its category
5. The frontend sidebar automatically shows the new item

**`sheets.json` format:**

```json
{
  "sheets": {
    "internships": {
      "id": "1abc...xyz",
      "sheet": "Sheet1",
      "label": "Internships",
      "category": "projects",
      "route": "/Projects/internships",
      "editUrl": "https://docs.google.com/spreadsheets/d/1abc...xyz/edit",
      "addedAt": "2025-06-01T10:00:00.000Z"
    }
  },
  "updatedAt": "2025-06-01T10:00:00.000Z"
}
```

**Category determines sidebar placement:**

| Category | Sidebar Location | Route Pattern |
|----------|-----------------|---------------|
| `other` | Sidebar | `/sheet/:key` |
| `projects` | Inside "Projects" dropdown | `/Projects/:key` |
| `committees` | Inside "Committees" dropdown | `/Committees/:key` |

### 4.7 Hide/Unhide System

Any sheet (built-in or dynamic) can be hidden from the sidebar:

- Hidden sheet keys are stored in `hidden_sheets.json` (an array)
- The `sheets-status` endpoint marks hidden sheets with `hidden: true`
- The frontend sidebar respects this flag and hides the corresponding navigation items
- The admin panel shows hidden items in a dimmed style with a "Show" button to restore

---

## 5. Frontend — React Application

### 5.1 Environment Setup

```bash
cd frontend
npm install
npm run dev       # Development server (port 3715)
npm run build     # Production build (output: dist/)
npm run preview   # Preview production build locally
```

**Environment variables** (optional):

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `""` (empty) | Backend API base URL. Empty in dev (Vite proxy handles it). Set to `http://server:3716` in production if served from a different origin. |

**Vite Configuration** (`vite.config.js`):

- **Port:** 3715 (dev and preview)
- **Proxy:** `/api/*` requests are forwarded to `http://localhost:3716` during development
- **Plugins:** `@vitejs/plugin-react` + `@tailwindcss/vite` (Tailwind CSS 4 integration)

### 5.2 Routing & Pages

All routes are defined in `App.jsx`. Pages are **lazy-loaded** using `React.lazy()` for code splitting.

| Route | Page Component | Data Source |
|-------|---------------|-------------|
| `/` | `Home` | `carousel`, `dean-message` |
| `/people` | `People` | `people` |
| `/deans` | `Deans` | `deans` |
| `/publications` | `Publications` | `publications` |
| `/patents` | `Patents` | `patents` |
| `/research-areas` | `ResearchAreas` | `research-areas` |
| `/opportunities` | `Opportunities` | `opportunities` |
| `/forms` | `Forms` | `forms` |
| `/documents` | `Documents` | `documents` |
| `/feedback` | `Feedback` | (static form) |
| `/search` | `Searchresults` | `searchData.jsx` |
| `/FundingStatistics` | `Funding_statistics` | Multiple sheets |
| `/statistics/Office` | `Office_statistics` | Multiple sheets |
| `/statistics/projects` | `Statsofprojects` | Multiple sheets |
| `/statistics/publications` | `Statsofpublications` | `publications` |
| `/Projects/Sponsored` | `Sponsored` | `sponsored` |
| `/Projects/Consultancy` | `Consultancy` | `consultancy` |
| `/Projects/Csr` | `CSRProjects` | `csr` |
| `/Projects/Fellowships` | `Fellowship` | `fellowship` |
| `/Projects/Workshops` | `Workshops` | `workshops` |
| `/Projects/sgnf` | `Sgnf` | `sgnf` |
| `/Committees/ethicscommittee` | `Ethics` | `ethics` |
| `/Committees/biosafety` | `Biosafety` | `biosafety` |
| `/Committees/ipr` | `Ipr` | `ipr` |
| `/Labs/*` (10 routes) | Lab pages | `lab-*` sheets |
| `/admin` | `AdminGate` | Admin APIs |
| `/sheet/:sheetKey` | `DynamicSheetPage` | Dynamic (admin-added) |
| `/Projects/:sheetKey` | `DynamicSheetPage` | Dynamic (projects category) |
| `/Committees/:sheetKey` | `DynamicSheetPage` | Dynamic (committees category) |

### 5.3 Components

#### Layout Components

| Component | File | Description |
|-----------|------|-------------|
| **Topbar** | `components/Topbar/Topbar.jsx` | Fixed top bar with IIT Dharwad logo; toggles mobile sidebar |
| **Navbar** | `components/Navbar/Navbar.jsx` | Left sidebar navigation; items auto-hide when sheets have no data |
| **Footer** | `components/Footer/Footer.jsx` | Site footer with links and credits |
| **Breadcrumbs** | `components/Breadcrumbs/` | Auto-generated breadcrumb trail |
| **BackToTop** | `components/BackToTop/` | Scroll-to-top floating button |
| **LabSubNavbar** | `components/labnav.jsx` | Department sub-navigation on `/Labs/*` pages |

#### Dropdown Navigation

The sidebar uses three dropdown menus:

| Component | File | Contents |
|-----------|------|----------|
| **MyDropdownNav** | `MyDropdownNav/MyDropdownNav.jsx` | **Projects:** Sponsored, Consultancy, CSR, SGNF, Fellowships, Workshops + dynamic |
| **EthicsDropdown** | `MyDropdownNav/ethicsdropdown.jsx` | **Committees:** Ethics, Biosafety, IPR + dynamic |
| **StatsDropdown** | `MyDropdownNav/statsdropdown.jsx` | **Statistics:** Projects, Publications, Funding, Office |

Dynamic sheets with the matching category (`projects` or `committees`) automatically appear in the corresponding dropdown.

#### Data Display Components

| Component | Description |
|-----------|-------------|
| **Carousel** | Homepage image slideshow (data from `carousel` sheet) |
| **PageHeader** | Reusable page title with optional description |
| **ProjectFilters** | Table filtering (search, year, agency) + pagination |
| **StatisticsDashboard** | Recharts-based charts for funding and office statistics |
| **PDFViewer** | Embedded PDF viewer using `react-pdf` |
| **LoadingSkeleton** | Shimmer loading placeholder while pages load |
| **PageTransition** | Route change animations |

### 5.4 Dynamic Sidebar Visibility

The sidebar automatically hides navigation items when their underlying Google Sheet has no data. This is managed by three files:

#### `context/SheetStatusContext.jsx`

- Fetches `/api/sheets-status` on mount and every 5 minutes
- Provides `{ status, loading, refetchStatus }` via React Context
- `refetchStatus()` can be called to immediately re-fetch (used by admin panel)

#### `context/sheetMappings.js`

- **`NAV_SHEET_MAP`**: Maps each route to its sheet cache key(s)
- **`DROPDOWN_GROUPS`**: Defines which routes belong to each dropdown group
- **`isRouteVisible(route, status)`**: Returns `false` if ALL mapped sheets are empty or hidden
- **`isDropdownVisible(groupName, status)`**: Returns `false` only if ALL children (including dynamic sheets) are empty/hidden

#### How it works in Navbar.jsx

```jsx
// Each sidebar item checks:
{isRouteVisible('/people', status) && (
  <NavLink to="/people">People</NavLink>
)}

// Dropdowns check:
{isDropdownVisible('Projects', status) && (
  <MyDropdownNav status={status} />
)}
```

### 5.5 Admin Panel

Accessible at `/admin`. Protected by a password login.

#### Features

1. **Data Source Cards** — Shows all cached sheets with record counts. Cards are color-coded:
   - Green border = has data
   - Red border = no data or error
   - Dimmed with "Hidden" badge = hidden from sidebar

2. **Hide/Unhide** — Click ✕ on any card to hide it from the sidebar. Hidden cards show "↩ Show" to restore.

3. **Add New Sheet** — Form to link a new Google Sheet:
   - **Display Name**: Label shown in navigation
   - **Sheet Tab Name**: Tab within the spreadsheet (default: `Sheet1`)
   - **Sidebar Section**: Where it appears — Sidebar, Projects dropdown, or Committees dropdown
   - **Google Sheet URL or ID**: The URL or spreadsheet ID

4. **Delete Dynamic Sheets** — Only admin-added (dynamic) sheets can be deleted. Built-in sheets can only be hidden.

5. **Refresh Data** — Force-refresh all cached data from Google Sheets.

6. **Live Updates** — After any mutation (add, hide, unhide, delete, refresh), the sidebar updates immediately without a page reload via `refetchStatus()`.

### 5.6 Styling & Tailwind CSS

The project uses **Tailwind CSS v4** with the Vite plugin:

- **Plugin:** `@tailwindcss/vite` (configured in `vite.config.js`)
- **Config:** `tailwind.config.js` at the frontend root
- **Import:** `index.css` uses `@import "tailwindcss"` with `@config "../tailwind.config.js"`
- **Additional libraries:** MUI (Material UI) for some icons, Flowbite for some components, Lucide for icons

---

## 6. How Data Flows (End to End)

Here's the complete journey of data from a Google Sheet to the user's browser:

```
1. Staff edits a Google Sheet (e.g., adds a new sponsored project)
          │
          ▼
2. The Google Sheet is published (Share → Anyone with the link → Viewer)
          │
          ▼
3. Backend server (every 10 min) calls OpenSheet API:
   GET https://opensheet.elk.sh/{spreadsheetId}/{tabName}
   → Returns JSON array of rows (Row 1 = headers, Row 2+ = data)
          │
          ▼
4. Backend stores the JSON array in its in-memory cache (Map)
          │
          ▼
5. Frontend page (e.g., Sponsored.jsx) makes API call:
   GET /api/sheets/sponsored
          │
          ▼
6. Vite proxy (dev) or reverse proxy (prod) forwards to backend:
   → http://localhost:3716/api/sheets/sponsored
          │
          ▼
7. Backend returns cached JSON array with X-Cache: HIT header
          │
          ▼
8. React component renders the data in a table/card/chart
```

**For the sidebar (navigation visibility):**

```
1. SheetStatusContext fetches GET /api/sheets-status on page load
          │
          ▼
2. Backend returns an object like:
   {
     "sponsored": { "hasData": true, "records": 45, "hidden": false },
     "csr":       { "hasData": false, "records": 0, "hidden": false },
     ...
   }
          │
          ▼
3. Navbar checks isRouteVisible('/Projects/Csr', status)
   → status['csr'].hasData is false → returns false
   → CSR link is hidden from the sidebar
```

---

## 7. Development Guide

### Prerequisites

- **Node.js** v18+ (LTS recommended)
- **npm** v9+

### First-Time Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd Rnd-Dept

# 2. Set up backend
cd backend/data-api
cp .env.example .env
# Edit .env: set PORT=3716 and ADMIN_PASSWORD
npm install

# 3. Set up frontend
cd ../../frontend
npm install
```

### Running in Development

You need **two terminals**:

```bash
# Terminal 1 — Start backend
cd backend/data-api
npm run dev
# Server starts on http://localhost:3716
# Initial data fetch takes ~30-60 seconds

# Terminal 2 — Start frontend
cd frontend
npm run dev
# Vite dev server starts on http://localhost:3715
# API calls are proxied to localhost:3716
```

Open `http://localhost:3715` in your browser.

### Key Development Notes

1. **The backend must be running** for any page with data to work. Without it, you'll see loading errors.
2. **First startup is slow** (~30-60s) because the backend fetches all 30+ sheets from Google.
3. **Vite proxy** handles `/api/*` routing in development — you never need to hardcode localhost:3716 in frontend code.
4. **Hot Module Replacement (HMR)** is enabled — frontend changes appear instantly without refresh.
5. **Backend auto-restart** — `npm run dev` uses Node's `--watch` flag to restart on file changes.

### Adding a New Built-In Page

1. Create a page component in `frontend/src/pages/NewPage.jsx`
2. Add a lazy import in `App.jsx`: `const NewPage = lazy(() => import('./pages/NewPage'));`
3. Add a `<Route>` in `App.jsx`
4. Add the sheet key mapping in `context/sheetMappings.js` → `NAV_SHEET_MAP`
5. Add a sidebar link in `components/Navbar/Navbar.jsx`
6. Add the Google Sheet source in `backend/data-api/server.js` → `DEFAULT_OPENSHEET_SOURCES`

### Adding a New Google Sheet Source to the Backend

In `server.js`, add to `DEFAULT_OPENSHEET_SOURCES`:

```javascript
'my-new-sheet': { id: 'SPREADSHEET_ID_HERE', sheet: 'Sheet1' },
```

Restart the backend. The data will be fetchable at `/api/sheets/my-new-sheet`.

---
