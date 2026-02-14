require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// ─── Configuration ───────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;
const REFRESH_MINUTES = parseInt(process.env.REFRESH_MINUTES) || 10;
const FETCH_TIMEOUT = 60000; // 60 seconds per request (some sheets are large)
const BATCH_SIZE = 5; // Concurrent fetches per batch

// Admin password — set via ADMIN_PASSWORD env var.
// On first run, if not set, falls back to a default (change immediately in production).
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Rnd@IITDH2025';
// Pre-hash at startup so we never compare plaintext
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(ADMIN_PASSWORD, 10);

// ─── Persistent Sheet Config (sheets.json) ───────────────────────────────────

const SHEETS_CONFIG_PATH = path.join(__dirname, 'sheets.json');

// Session tokens for admin auth (in-memory; resets on server restart)
const activeSessions = new Map();
const crypto = require('crypto');

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// ─── Dynamic Sheets Config (sheets.json) ─────────────────────────────────────

function loadDynamicSheets() {
  try {
    if (fs.existsSync(SHEETS_CONFIG_PATH)) {
      const raw = fs.readFileSync(SHEETS_CONFIG_PATH, 'utf-8');
      const config = JSON.parse(raw);
      return config.sheets || {};
    }
  } catch (err) {
    console.warn('⚠ Could not load sheets.json:', err.message);
  }
  return {};
}

function saveDynamicSheets(sheets) {
  const config = { sheets, updatedAt: new Date().toISOString() };
  fs.writeFileSync(SHEETS_CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}

function mergeSources() {
  const dynamic = loadDynamicSheets();
  OPENSHEET_SOURCES = { ...DEFAULT_OPENSHEET_SOURCES, ...dynamic };
}

// ─── Hidden Sheets Config (hidden_sheets.json) ───────────────────────────────

const HIDDEN_CONFIG_PATH = path.join(__dirname, 'hidden_sheets.json');

function loadHiddenSheets() {
  try {
    if (fs.existsSync(HIDDEN_CONFIG_PATH)) {
      const raw = fs.readFileSync(HIDDEN_CONFIG_PATH, 'utf-8');
      return JSON.parse(raw).hidden || [];
    }
  } catch (err) {
    console.warn('⚠ Could not load hidden_sheets.json:', err.message);
  }
  return [];
}

function saveHiddenSheets(hidden) {
  fs.writeFileSync(HIDDEN_CONFIG_PATH, JSON.stringify({ hidden, updatedAt: new Date().toISOString() }, null, 2), 'utf-8');
}

// ─── Default Google Sheet Sources (OpenSheet API) ────────────────────────────
// These are the built-in sheets. Additional sheets can be added at runtime via
// the admin API and are persisted in sheets.json.

const DEFAULT_OPENSHEET_SOURCES = {
  // Project data
  'sponsored':      { id: '1cVHmxJMGNPD_yGoQ4-_IASm1NYRfW1jpnozaR-PlB2o', sheet: 'Sheet1' },
  'consultancy':    { id: '1ET9vwdstPycSC1WUh4DwtHRg7_2axgYwZQgPVtqHfEQ', sheet: 'Sheet1' },
  'csr':            { id: '1aGpQlcEX4hw_L4nAhOxTC07KK0yXe0QqoKW3s7TRAaM', sheet: 'Sheet1' },
  'sgnf':           { id: '1JQ_9Xh9aPNnklv7_iP0ihVUztYd4Rs2ZnumybaJrf7c', sheet: 'Sheet1' },

  // Publications & Patents
  'publications':   { id: '10P7vgxarVBixJkawH_SrFf3FaITKWeNLkc2rwPj0aoo', sheet: 'Sheet1' },
  'patents':        { id: '1GwrkMQ6uIeKmUU8yhEpZce-cTnGDcvNlj6KwYR6CrBE', sheet: 'Sheet1' },

  // People & Administration
  'people':         { id: '1DPFcbQFTMe5AsEHycc25MDc-SlvfJhli8taVGR8mORU', sheet: 'json' },
  'deans':          { id: '1gcvBIaxeUtNLoqsTKuCZsxFWONsIF58kI8RtKyqJ7jk', sheet: 'Sheet1' },
  'carousel':       { id: '1vWcPPCIsbXw0O8zwvjXAkXn0Hg7zY0pUWwUCJ_jTkjc', sheet: 'Carousel Images' },

  // Resources
  'opportunities':  { id: '1t352KbG0gFpu_QK7BVjBrcwLy5Kthq4JmHRy_AtVHUM', sheet: 'Sheet1' },
  'forms':          { id: '1zmpwBGzv6VtYhkiosMQfJ3YE3-8CNiGAUP0tiNEX_rU', sheet: 'Sheet1' },
  'documents':      { id: '1RG3VNFWNk8tnVrsNmk3-cf1Pko3lQIofwRyZonQmVg0', sheet: 'Sheet1' },
  'research-areas': { id: '1L4vUCsuD0Qn6UjloNVOMMmaMl37YaWIl2MFOZIMG5ps', sheet: 'Sheet1' },

  // Committees
  'biosafety':      { id: '1eSLx7mpxl18s9tbPviwM4iTYCxNQSZOfe3S_Lf4gWn0', sheet: 'Sheet1' },
  'ethics':         { id: '1mpZ4L867iqx-47amKA8PVSdYpub2naAYmQ-mzFXYCNc', sheet: 'Sheet1' },
  'ipr':            { id: '14Xz-Gg74ERDRkFMT_ocq0NWsnRwMDUFSBb8ooZSduiQ', sheet: 'Sheet1' },

  // Labs
  'lab-biosciences':  { id: '1veYDe_wJ4aeYOOi3I-sc3FWnWEHkl1h7et0gKuX_L3I', sheet: 'BSBE' },
  'lab-chemicaleng':  { id: '1HzVcvQzqZaF1Wdlv4e1mIOHbs4O4lLkNcGMWA4ubQNo', sheet: 'Chem Eng' },
  'lab-chemistry':    { id: '1WhxVoG-kv62pww7y_GY0LrkNi0YLyUNhxP1UOu6Tm9k', sheet: 'Chemistry' },
  'lab-civil':        { id: '1g4imjnV8Yc0Aupva6slg9Z3m8L4fU05tfk_PJe7q0-c', sheet: 'CIE' },
  'lab-cse':          { id: '14ipy-bZL0U3v2BzXWm5ivb9uOlM5p8Dc8pR7lSG7_Uc', sheet: 'CSE' },
  'lab-ece':          { id: '1DlYPfxatycmVxRC8N38MlXXEcU8HDcULfwCFG8WbIVw', sheet: 'EECE' },
  'lab-humanities':   { id: '1YOnB2D9WJuk0WCO2qU0JZNcFitS_8aTSvbhdQDzWh9E', sheet: 'HEART' },
  'lab-mathematics':  { id: '1Qfrdh8e4-ZTfMK1gEIFYV-1jcTKhNXztB44wpsXqgDc', sheet: 'Maths' },
  'lab-mechanical':   { id: '1-5vffxh_5xua1-VzDI0H3FKHIhVJQ3O2gHCC6LvhCXI', sheet: 'MMAE' },
  'lab-physics':      { id: '1F4QnT9Uq8l-bW42DHLDG32yfkQpzAOjCLwf_ASadZ3o', sheet: 'Physics' },
};

// Mutable copy that gets merged with dynamic sheets from sheets.json
let OPENSHEET_SOURCES = { ...DEFAULT_OPENSHEET_SOURCES };

// ─── CSV Export Sources (Excel files that can't use OpenSheet) ────────────────

const CSV_SOURCES = {
  'workshops': {
    url: 'https://docs.google.com/spreadsheets/d/1NKU2N_sag8rOG87o2V9n9hN2Z4pXeBuG/export?format=csv&gid=1544214083',
    sanitizeHeaders: true,
  },
  'fellowship': {
    url: 'https://docs.google.com/spreadsheets/d/1ebO7W5s2yQEWFcNnhX5Jr2n4tMwzspFc/export?format=csv&gid=1256952165',
    sanitizeHeaders: true,
  },
  'patents-count': {
    url: 'https://docs.google.com/spreadsheets/d/1-v5ne-TsrgHOGDlcBMoGugzE_vO8H93kgWXtHNkYnZM/export?format=csv&gid=0',
    rawNumber: true,
  },
};

// ─── Google Doc Sources (HTML content) ───────────────────────────────────────

const DOC_SOURCES = {
  'dean-message': {
    url: 'https://docs.google.com/document/d/1erNNTzZQF3MTEzao2Sr2hRA7wp_HwohI9Ah9yiAzjPU/export?format=html',
  },
};

// ─── In-Memory Cache ─────────────────────────────────────────────────────────

const cache = new Map();

function setCacheEntry(name, data, error = null) {
  cache.set(name, {
    data,
    fetchedAt: new Date().toISOString(),
    error,
  });
}

function getCacheEntry(name) {
  return cache.get(name) || null;
}

// ─── CSV Parsing ─────────────────────────────────────────────────────────────

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCsv(text, sanitize = false) {
  const rawLines = text.split('\n');
  const dataLines = [];
  let tempLine = '';
  let inQuote = false;

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (trimmed === '' && !inQuote) continue;

    const quoteCount = (trimmed.match(/"/g) || []).length;
    if (quoteCount % 2 !== 0) inQuote = !inQuote;

    tempLine += trimmed;
    if (!inQuote) {
      dataLines.push(tempLine);
      tempLine = '';
    } else {
      tempLine += '\n';
    }
  }

  if (dataLines.length === 0) return [];

  const rawHeaders = parseCsvLine(dataLines[0]);
  const headers = sanitize ? rawHeaders.map(sanitizeHeader) : rawHeaders;

  return dataLines.slice(1).map(line => {
    const values = parseCsvLine(line);
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = (values[idx] || '').trim();
    });
    return obj;
  }).filter(item => Object.values(item).some(val => val !== ''));
}

function sanitizeHeader(header) {
  if (header.includes('Value') && header.includes('₹1,00,000')) return 'value_inr_lakh';
  if (header.includes('Sanction date')) return 'sanction_date';
  if (header.includes('Duration (years)')) return 'duration_years';
  return header
    .trim()
    .replace(/[^a-zA-Z0-9_]+/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
}

// ─── Fetch Functions ─────────────────────────────────────────────────────────

async function fetchFromOpenSheet(id, sheet) {
  const urls = [
    `https://opensheet.elk.sh/${id}/${encodeURIComponent(sheet)}`,
    `https://opensheet.vercel.app/${id}/${encodeURIComponent(sheet)}`,
  ];

  for (const url of urls) {
    try {
      const res = await axios.get(url, { timeout: FETCH_TIMEOUT });
      if (Array.isArray(res.data)) return res.data;
    } catch (err) {
      console.warn(`  OpenSheet failed for ${url}: ${err.message}`);
      continue;
    }
  }
  throw new Error(`All OpenSheet sources failed for sheet ${id}`);
}

async function fetchCsvSource(config) {
  const res = await axios.get(config.url, {
    timeout: FETCH_TIMEOUT,
    responseType: 'text',
  });

  if (config.rawNumber) {
    const num = parseFloat(res.data);
    return { count: isNaN(num) ? null : num };
  }

  return parseCsv(res.data, config.sanitizeHeaders || false);
}

async function fetchDocSource(config) {
  const res = await axios.get(config.url, {
    timeout: FETCH_TIMEOUT,
    responseType: 'text',
  });
  return res.data;
}

// ─── Refresh Logic ───────────────────────────────────────────────────────────

async function refreshSheet(name) {
  try {
    let data;

    if (OPENSHEET_SOURCES[name]) {
      const { id, sheet } = OPENSHEET_SOURCES[name];
      data = await fetchFromOpenSheet(id, sheet);
    } else if (CSV_SOURCES[name]) {
      data = await fetchCsvSource(CSV_SOURCES[name]);
    } else {
      return false;
    }

    setCacheEntry(name, data);
    return true;
  } catch (err) {
    console.error(`  ✗ ${name}: ${err.message}`);
    // Keep stale data if available; only create empty entry if nothing cached
    if (!getCacheEntry(name)) {
      setCacheEntry(name, [], err.message);
    }
    return false;
  }
}

async function refreshContent(name) {
  try {
    const config = DOC_SOURCES[name];
    if (!config) return false;

    const html = await fetchDocSource(config);
    setCacheEntry(`content:${name}`, html);
    return true;
  } catch (err) {
    console.error(`  ✗ content:${name}: ${err.message}`);
    if (!getCacheEntry(`content:${name}`)) {
      setCacheEntry(`content:${name}`, '', err.message);
    }
    return false;
  }
}

async function refreshAll() {
  const startTime = Date.now();
  console.log(`\n[${new Date().toISOString()}] 🔄 Refreshing all data...`);

  const allSheetNames = [
    ...Object.keys(OPENSHEET_SOURCES),
    ...Object.keys(CSV_SOURCES),
  ];
  let success = 0;
  let failed = 0;

  // Fetch sheets in batches to avoid overwhelming APIs
  for (let i = 0; i < allSheetNames.length; i += BATCH_SIZE) {
    const batch = allSheetNames.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(name => refreshSheet(name))
    );
    results.forEach((r, idx) => {
      if (r.status === 'fulfilled' && r.value) {
        success++;
        const entry = getCacheEntry(batch[idx]);
        const count = Array.isArray(entry?.data) ? entry.data.length : '?';
        console.log(`  ✓ ${batch[idx]} (${count} records)`);
      } else {
        failed++;
      }
    });
  }

  // Fetch document sources
  for (const name of Object.keys(DOC_SOURCES)) {
    const result = await refreshContent(name);
    if (result) {
      success++;
      console.log(`  ✓ content:${name}`);
    } else {
      failed++;
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`[${new Date().toISOString()}] ✅ Refresh complete: ${success} success, ${failed} failed (${elapsed}s)\n`);
}

// ─── Express Server ──────────────────────────────────────────────────────────

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

// ─── Sheet Data Endpoint ─────────────────────────────────────────────────────

app.get('/api/sheets/:name', async (req, res) => {
  const { name } = req.params;

  // Try cache first
  const cached = getCacheEntry(name);
  if (cached && cached.data && (Array.isArray(cached.data) ? cached.data.length > 0 : true)) {
    res.set('X-Cache', 'HIT');
    res.set('X-Cached-At', cached.fetchedAt);
    return res.json(cached.data);
  }

  // If valid source but not cached, fetch on demand
  if (OPENSHEET_SOURCES[name] || CSV_SOURCES[name]) {
    console.log(`  Cache miss for "${name}", fetching on demand...`);
    const ok = await refreshSheet(name);
    const entry = getCacheEntry(name);
    if (ok && entry?.data) {
      res.set('X-Cache', 'MISS');
      return res.json(entry.data);
    }
    // If fetch failed but stale data exists, serve stale
    if (entry?.data && (Array.isArray(entry.data) ? entry.data.length > 0 : true)) {
      res.set('X-Cache', 'STALE');
      return res.json(entry.data);
    }
    return res.status(503).json({ error: 'Failed to fetch data', sheet: name });
  }

  return res.status(404).json({ error: `Unknown sheet: "${name}"` });
});

// ─── Content Endpoint (HTML documents) ───────────────────────────────────────

app.get('/api/content/:name', async (req, res) => {
  const { name } = req.params;

  const cached = getCacheEntry(`content:${name}`);
  if (cached && cached.data) {
    res.set('X-Cache', 'HIT');
    return res.json({ html: cached.data, fetchedAt: cached.fetchedAt });
  }

  if (DOC_SOURCES[name]) {
    await refreshContent(name);
    const entry = getCacheEntry(`content:${name}`);
    if (entry?.data) {
      res.set('X-Cache', 'MISS');
      return res.json({ html: entry.data, fetchedAt: entry.fetchedAt });
    }
    return res.status(503).json({ error: 'Failed to fetch content' });
  }

  return res.status(404).json({ error: `Unknown content: "${name}"` });
});

// ─── Health Check ────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  const sheets = {};
  for (const [name, entry] of cache.entries()) {
    sheets[name] = {
      records: Array.isArray(entry.data) ? entry.data.length : (entry.data ? 'html' : 0),
      fetchedAt: entry.fetchedAt,
      error: entry.error,
    };
  }

  res.json({
    status: 'ok',
    uptime: `${(process.uptime() / 60).toFixed(1)} min`,
    totalSources: Object.keys(OPENSHEET_SOURCES).length + Object.keys(CSV_SOURCES).length + Object.keys(DOC_SOURCES).length,
    cachedEntries: cache.size,
    refreshInterval: `${REFRESH_MINUTES} min`,
    sheets,
  });
});

// ─── Force Refresh ───────────────────────────────────────────────────────────

app.post('/api/refresh', async (req, res) => {
  const { name } = req.body || {};

  if (name) {
    const ok = await refreshSheet(name);
    const entry = getCacheEntry(name);
    return res.json({
      success: ok,
      name,
      records: Array.isArray(entry?.data) ? entry.data.length : null,
    });
  }

  await refreshAll();
  res.json({ success: true, message: 'All data refreshed', cachedEntries: cache.size });
});

// ─── List Available Sheets ───────────────────────────────────────────────────

app.get('/api/sheets', (req, res) => {
  const available = [
    ...Object.keys(OPENSHEET_SOURCES),
    ...Object.keys(CSV_SOURCES),
  ];
  res.json({ sheets: available, content: Object.keys(DOC_SOURCES) });
});

// ─── Sheet Status (for dynamic sidebar visibility) ───────────────────────────

app.get('/api/sheets-status', (req, res) => {
  const status = {};

  // All opensheet + csv sources
  const allNames = [
    ...Object.keys(OPENSHEET_SOURCES),
    ...Object.keys(CSV_SOURCES),
  ];

  for (const name of allNames) {
    const entry = getCacheEntry(name);
    const records = Array.isArray(entry?.data) ? entry.data.length : 0;
    status[name] = { hasData: records > 0, records };
  }

  // Mark dynamic sheets
  const dynamic = loadDynamicSheets();
  for (const name of Object.keys(dynamic)) {
    if (status[name]) {
      status[name].dynamic = true;
      status[name].label = dynamic[name].label || name;
      status[name].category = dynamic[name].category || 'other';
      status[name].route = dynamic[name].route || `/${name}`;
    }
  }

  // Mark hidden sheets
  const hiddenList = loadHiddenSheets();
  for (const name of hiddenList) {
    if (status[name]) {
      status[name].hidden = true;
    }
  }

  res.json(status);
});

// ─── Admin Auth ──────────────────────────────────────────────────────────────

function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !activeSessions.has(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // Refresh expiry on use
  activeSessions.set(token, Date.now() + 30 * 60 * 1000); // 30 min
  next();
}

// Clean up expired sessions every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, expiry] of activeSessions) {
    if (now > expiry) activeSessions.delete(token);
  }
}, 5 * 60 * 1000);

app.post('/api/admin/login', async (req, res) => {
  const { password } = req.body || {};
  if (!password) {
    return res.status(400).json({ error: 'Password required' });
  }

  const valid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = generateToken();
  activeSessions.set(token, Date.now() + 30 * 60 * 1000); // 30 min expiry
  res.json({ token, expiresIn: '30m' });
});

app.post('/api/admin/logout', requireAdmin, (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  activeSessions.delete(token);
  res.json({ success: true });
});

app.get('/api/admin/verify', requireAdmin, (req, res) => {
  res.json({ valid: true });
});

// ─── Admin: Dynamic Sheet Management ─────────────────────────────────────────

app.post('/api/admin/sheets', requireAdmin, async (req, res) => {
  const { name, spreadsheetId, sheetTab, label, category, route, editUrl } = req.body || {};

  if (!name || !spreadsheetId) {
    return res.status(400).json({ error: 'name and spreadsheetId are required' });
  }

  // Don't allow overwriting built-in sources
  if (DEFAULT_OPENSHEET_SOURCES[name] || CSV_SOURCES[name]) {
    return res.status(409).json({ error: `"${name}" is a built-in source and cannot be overwritten` });
  }

  const dynamic = loadDynamicSheets();
  dynamic[name] = {
    id: spreadsheetId,
    sheet: sheetTab || 'Sheet1',
    label: label || name,
    category: category || 'other',
    route: route || `/${name}`,
    editUrl: editUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    addedAt: new Date().toISOString(),
  };

  saveDynamicSheets(dynamic);
  mergeSources();

  // Fetch the new sheet data immediately
  const ok = await refreshSheet(name);
  const entry = getCacheEntry(name);
  const records = Array.isArray(entry?.data) ? entry.data.length : 0;

  if (!ok) {
    // Sheet was saved but fetch failed — likely not published publicly
    return res.status(200).json({
      success: true,
      name,
      records,
      fetched: false,
      warning: 'Sheet was saved but could not be fetched. Make sure the Google Sheet is shared as "Anyone with the link → Viewer". Data will appear once the sheet is public and the next refresh occurs.',
    });
  }

  res.json({
    success: true,
    name,
    records,
    fetched: ok,
  });
});

app.delete('/api/admin/sheets/:name', requireAdmin, (req, res) => {
  const { name } = req.params;

  if (DEFAULT_OPENSHEET_SOURCES[name] || CSV_SOURCES[name]) {
    return res.status(409).json({ error: `"${name}" is a built-in source and cannot be removed` });
  }

  const dynamic = loadDynamicSheets();
  if (!dynamic[name]) {
    return res.status(404).json({ error: `Dynamic sheet "${name}" not found` });
  }

  delete dynamic[name];
  saveDynamicSheets(dynamic);
  mergeSources();

  // Remove from cache
  cache.delete(name);

  // Also remove from hidden list if it was hidden
  let hidden = loadHiddenSheets();
  if (hidden.includes(name)) {
    hidden = hidden.filter(k => k !== name);
    saveHiddenSheets(hidden);
  }

  res.json({ success: true, name });
});

app.get('/api/admin/dynamic-sheets', requireAdmin, (req, res) => {
  const dynamic = loadDynamicSheets();
  res.json(dynamic);
});

// ─── Admin: Hide / Unhide Built-in Sheets from Sidebar ──────────────────────

app.post('/api/admin/sheets/:name/hide', requireAdmin, (req, res) => {
  const { name } = req.params;
  const hidden = loadHiddenSheets();
  if (!hidden.includes(name)) {
    hidden.push(name);
    saveHiddenSheets(hidden);
  }
  res.json({ success: true, hidden: true, name });
});

app.post('/api/admin/sheets/:name/unhide', requireAdmin, (req, res) => {
  const { name } = req.params;
  let hidden = loadHiddenSheets();
  hidden = hidden.filter(k => k !== name);
  saveHiddenSheets(hidden);
  res.json({ success: true, hidden: false, name });
});

app.get('/api/admin/hidden-sheets', requireAdmin, (req, res) => {
  res.json(loadHiddenSheets());
});

// ─── Startup ─────────────────────────────────────────────────────────────────

async function start() {
  console.log('╔═══════════════════════════════════════════════╗');
  console.log('║       R&D Website — Data API Server           ║');
  console.log('╚═══════════════════════════════════════════════╝');

  // Load dynamic sheets from sheets.json and merge with defaults
  mergeSources();
  const dynamicCount = Object.keys(loadDynamicSheets()).length;

  // Clean up stale hidden entries (sheets that no longer exist in any source)
  const allKnownKeys = new Set([
    ...Object.keys(OPENSHEET_SOURCES),
    ...Object.keys(CSV_SOURCES),
    ...Object.keys(DOC_SOURCES),
  ]);
  const hiddenBefore = loadHiddenSheets();
  const hiddenClean = hiddenBefore.filter(k => allKnownKeys.has(k));
  if (hiddenClean.length !== hiddenBefore.length) {
    const removed = hiddenBefore.filter(k => !allKnownKeys.has(k));
    saveHiddenSheets(hiddenClean);
    console.log(`Cleaned ${removed.length} stale hidden entries: ${removed.join(', ')}`);
  }

  console.log(`Sources: ${Object.keys(OPENSHEET_SOURCES).length} sheets (${dynamicCount} dynamic), ${Object.keys(CSV_SOURCES).length} CSV, ${Object.keys(DOC_SOURCES).length} docs`);
  console.log(`Refresh interval: ${REFRESH_MINUTES} minutes`);
  console.log('');

  // Initial data fetch
  await refreshAll();

  // Start server
  const server = app.listen(PORT, () => {
    console.log(`🚀 API server running at http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
    console.log(`   Sheets: http://localhost:${PORT}/api/sheets`);
    console.log('');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Port ${PORT} is already in use.`);
      console.error(`   Run: npx kill-port ${PORT}   (or close the other process)`);
      process.exit(1);
    }
    throw err;
  });

  // Periodic refresh
  setInterval(refreshAll, REFRESH_MINUTES * 60 * 1000);
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
