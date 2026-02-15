# IIT Dharwad — R&D Website

## Comprehensive Technical Documentation

**Tech Stack:** React, Vite, Tailwind CSS, Express.js, Node.js  

## 1. Overview

The R&D Website is the public-facing portal for IIT Dharwad's research activities. It displays information about:

- **Sponsored & Consultancy projects** funded by agencies like DST, SERB, DRDO, DAE, DBT, etc.
- **Publications & Patents** produced by faculty
- **People** — faculty, staff, and current/former Research Deans
- **Research Areas & Labs** across 10 departments (CSE, EECE, Physics, Chemistry, etc.)
- **Committees** — Ethics, IPR, and Biosafety
- **Funding statistics** and project analytics
- **Forms, Documents, CSR projects, Workshops, Fellowships, Opportunities**

All content is driven by **Google Sheets** — faculty and staff edit spreadsheets, and the website reflects changes automatically every 10 minutes via a caching backend server.

### 4. Admin Panel

Accessible at `/admin`. Protected by a password login.

#### 5. Features

1. **Admin Features**
   1.1 **Data Source Cards** — Shows all cached sheets with record counts. Cards are color-coded:
   - Green border = has data
   - Red border = no data or error
   - Dimmed with "Hidden" badge = hidden from sidebar

   1.2 **Hide/Unhide** — Click ✕ on any card to hide it from the sidebar. Hidden cards show "↩ Show" to restore.

   1.3 **Add New Sheet** — Form to link a new Google Sheet:
   - **Display Name**: Label shown in navigation
   - **Sheet Tab Name**: Tab within the spreadsheet (default: `Sheet1`)
   - **Sidebar Section**: Where it appears — Sidebar, Projects dropdown, or Committees dropdown
   - **Google Sheet URL or ID**: The URL or spreadsheet ID

   1.4 **Delete Dynamic Sheets** — Only admin-added (dynamic) sheets can be deleted. Built-in sheets can only be hidden.

   1.5 **Refresh Data** — Force-refresh all cached data from Google Sheets.

   1.6 **Live Updates** — After any mutation (add, hide, unhide, delete, refresh), the sidebar updates immediately without a page reload via `refetchStatus()`.

2. **Dynamic Statistics** - Fetches stats from the sheets directly and displays the statistics.

3. **Dynamic Font Size** - User can increase the font size by clicking on the A+, A- buttons.

4. **Paging and Filters added** - Data from the sheets can be filtered while displaying.

## 2. Backend — Data API Server

**File:** `backend/data-api/server.js` (721 lines, pure Express.js)

The backend is a **caching proxy** that sits between the frontend and Google Sheets. It:

1. Fetches data from 26+ Google Sheets, 3 CSV exports, and 1 Google Doc on startup
2. Stores everything in an **in-memory cache** (`Map`)
3. Refreshes all data every 10 minutes automatically
4. Serves cached data to the frontend via REST endpoints
5. Provides admin APIs for managing sheets at runtime

### 3. Environment Setup

Copy `.env.example` to `.env` and configure:

```env
# Port the API server listens on
PORT=3716

# Cache refresh interval (minutes)
REFRESH_MINUTES=10

# Admin password (used for admin login — hashed with bcrypt at startup)
ADMIN_PASSWORD=YourSecurePassword
```
