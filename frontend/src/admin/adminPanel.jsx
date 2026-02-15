import React, { useState, useEffect } from "react";
import { ADMIN_LINKS } from "./adminLinks";
import { adminHeaders, clearAdminToken } from "../config/api";
import { useSheetStatus } from "../context/useSheetStatus";

const API_BASE = import.meta.env.VITE_API_URL || '';

const LABEL_TO_KEYS = {
  'People': ['people'],
  'Documents': ['documents'],
  'Call for Proposals': ['opportunities'],
  'Forms': ['forms'],
  'Research Areas': ['research-areas'],
  'Patents': ['patents'],
  'Publications': ['publications'],
  'Dean Tenures': ['deans'],
  'Carousel Images': ['carousel'],
  'Projects': ['csr', 'sgnf', 'sponsored', 'consultancy', 'fellowship', 'workshops'],
  'Committees': ['biosafety', 'ethics', 'ipr'],
  'Labs': ['lab-cse', 'lab-ece', 'lab-civil', 'lab-mechanical', 'lab-chemistry', 'lab-chemicaleng', 'lab-biosciences', 'lab-humanities', 'lab-mathematics', 'lab-physics'],
};

/** Extract Spreadsheet ID from a Google Sheets URL or raw ID */
function parseSheetId(input) {
  if (!input) return '';
  const match = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  if (/^[a-zA-Z0-9_-]{20,}$/.test(input.trim())) return input.trim();
  return '';
}

/** Convert a display name to a URL-safe key */
function nameToKey(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function AdminPanel({ onLogout }) {
  const { refetchStatus } = useSheetStatus();
  const [openGroups, setOpenGroups] = useState({});
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [dynamicSheets, setDynamicSheets] = useState({});
  const [addForm, setAddForm] = useState({
    displayName: '', sheetUrl: '', sheetTab: 'Sheet1', category: 'other',
  });
  const [addMessage, setAddMessage] = useState(null);
  const [hiddenSheets, setHiddenSheets] = useState(new Set());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDynamicSheets();
    fetchHiddenSheets();
  }, []);

  async function fetchHiddenSheets() {
    try {
      const res = await fetch(`${API_BASE}/api/admin/hidden-sheets`, {
        headers: adminHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setHiddenSheets(new Set(data));
      }
    } catch { /* ignore */ }
  }

  async function fetchDynamicSheets() {
    try {
      const res = await fetch(`${API_BASE}/api/admin/dynamic-sheets`, {
        headers: adminHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setDynamicSheets(data);
      }
    } catch { /* ignore */ }
  }

  const handleLogout = () => {
    clearAdminToken();
    onLogout();
  };

  const toggleGroup = (label) => {
    setOpenGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleAddSheet = async (e) => {
    e.preventDefault();
    setAddMessage(null);

    const spreadsheetId = parseSheetId(addForm.sheetUrl);
    if (!addForm.displayName.trim()) {
      setAddMessage({ type: 'error', text: 'Display name is required' });
      return;
    }
    if (!spreadsheetId) {
      setAddMessage({ type: 'error', text: 'Please enter a valid Google Sheets URL or Spreadsheet ID' });
      return;
    }

    const key = nameToKey(addForm.displayName);
    if (!key) {
      setAddMessage({ type: 'error', text: 'Could not generate a valid key from the name. Use letters and numbers.' });
      return;
    }

    try {
      const category = addForm.category;
      let route = `/sheet/${key}`;
      if (category === 'projects') route = `/Projects/${key}`;
      else if (category === 'committees') route = `/Committees/${key}`;

      const res = await fetch(`${API_BASE}/api/admin/sheets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...adminHeaders() },
        body: JSON.stringify({
          name: key,
          spreadsheetId,
          sheetTab: addForm.sheetTab || 'Sheet1',
          label: addForm.displayName.trim(),
          category,
          route,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add sheet');

      if (data.warning) {
        setAddMessage({
          type: 'error',
          text: data.warning,
        });
      } else if (data.records === 0) {
        setAddMessage({
          type: 'error',
          text: `Sheet registered, but 0 data rows found. Remember: Row 1 is treated as column headers. Add data starting from Row 2, then click "\u21bb Refresh Data".`,
        });
      } else {
        setAddMessage({
          type: 'success',
          text: `"${addForm.displayName.trim()}" registered successfully (${data.records} records). It will now appear in the sidebar.`,
        });
        setTimeout(() => {
          setShowAddSheet(false);
          setAddMessage(null);
        }, 2000);
      }
      setAddForm({ displayName: '', sheetUrl: '', sheetTab: 'Sheet1', category: 'other' });
      fetchDynamicSheets();
      refetchStatus();
    } catch (err) {
      setAddMessage({ type: 'error', text: err.message });
    }
  };

  const handleRemoveSheet = async (name, label) => {
    if (!confirm(`Remove "${label || name}" permanently? This won't delete the Google Sheet itself.`)) return;

    try {
      const res = await fetch(`${API_BASE}/api/admin/sheets/${name}`, {
        method: 'DELETE',
        headers: adminHeaders(),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to remove');
      }
      fetchDynamicSheets();
      refetchStatus();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleHideSheet = async (keys) => {
    try {
      for (const key of keys) {
        await fetch(`${API_BASE}/api/admin/sheets/${key}/hide`, {
          method: 'POST',
          headers: adminHeaders(),
        });
      }
      fetchHiddenSheets();
      refetchStatus();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUnhideSheet = async (keys) => {
    try {
      for (const key of keys) {
        await fetch(`${API_BASE}/api/admin/sheets/${key}/unhide`, {
          method: 'POST',
          headers: adminHeaders(),
        });
      }
      fetchHiddenSheets();
      refetchStatus();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRefreshAll = async () => {
    setRefreshing(true);
    try {
      await fetch(`${API_BASE}/api/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch { /* ignore */ }
    fetchDynamicSheets();
    fetchHiddenSheets();
    refetchStatus();
    setRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Admin Dashboard
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRefreshAll}
            disabled={refreshing}
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50"
            title="Re-fetch all Google Sheets data now"
          >
            {refreshing ? 'Refreshing…' : '↻ Refresh Data'}
          </button>
          <button
            onClick={() => setShowAddSheet(!showAddSheet)}
            className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold px-4 py-2 rounded-lg transition"
          >
            {showAddSheet ? 'Hide' : '+ Add Sheet'}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>


      {showAddSheet && (
        <div className="bg-white shadow-lg rounded-xl p-6 border border-purple-200 mb-6">
          <h2 className="text-lg font-semibold mb-2 text-purple-800">Add New Sheet</h2>
          <div className="mb-4 p-3 rounded-lg text-sm bg-amber-50 text-amber-800 border border-amber-200">
            <strong>Important:</strong> The Google Sheet must be shared publicly (Share → Anyone with the link → Viewer).
            Row 1 is used as column headers; actual data must start from Row 2.
          </div>

          {addMessage && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              addMessage.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {addMessage.text}
            </div>
          )}

          <form onSubmit={handleAddSheet} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name *</label>
                <input
                  type="text"
                  placeholder="Research Grants 2026"
                  value={addForm.displayName}
                  onChange={e => setAddForm(f => ({ ...f, displayName: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Label shown in the sidebar navigation</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sheet Tab Name</label>
                <input
                  type="text"
                  placeholder="Sheet1"
                  value={addForm.sheetTab}
                  onChange={e => setAddForm(f => ({ ...f, sheetTab: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">Tab name within the spreadsheet (default: Sheet1)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sidebar Section</label>
                <select
                  value={addForm.category}
                  onChange={e => setAddForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
                >
                  <option value="other">Sidebar</option>
                  <option value="projects">Projects (dropdown)</option>
                  <option value="committees">Committees (dropdown)</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">Where this sheet appears in navigation</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Sheet URL or Spreadsheet ID *</label>
              <input
                type="text"
                placeholder="https://docs.google.com/spreadsheets/d/..."
                value={addForm.sheetUrl}
                onChange={e => setAddForm(f => ({ ...f, sheetUrl: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
              />
              {addForm.sheetUrl && (
                <p className="text-xs mt-1 text-gray-500">
                  Detected ID: <span className="font-mono text-purple-700">{parseSheetId(addForm.sheetUrl) || '(invalid)'}</span>
                </p>
              )}
            </div>
            <button
              type="submit"
              className="bg-purple-700 hover:bg-purple-800 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              Register Data Source
            </button>
          </form>
        </div>
      )}


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(dynamicSheets).map(([name, sheet]) => {
          const isHidden = hiddenSheets.has(name);
          return (
          <div
            key={`dynamic-${name}`}
            className={`bg-white shadow-lg rounded-xl p-6 border ${isHidden ? 'border-red-200 opacity-50' : 'border-purple-200'}`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {sheet.label || name}
                {isHidden && <span className="ml-2 text-xs text-red-500 font-normal">(hidden)</span>}
              </h3>
              {isHidden ? (
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => handleUnhideSheet([name])}
                    className="text-green-600 hover:text-green-800 text-sm font-semibold px-2 py-1 rounded hover:bg-green-50 transition"
                    title="Show on sidebar"
                  >
                    ↩ Show
                  </button>
                  <button
                    onClick={() => handleRemoveSheet(name, sheet.label)}
                    className="text-red-400 hover:text-red-600 text-sm font-semibold px-2 py-1 rounded hover:bg-red-50 transition"
                    title="Delete permanently"
                  >
                    🗑 Delete
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleHideSheet([name])}
                  className="text-red-400 hover:text-red-600 text-lg font-bold leading-none"
                  title="Hide from sidebar"
                >
                  ✕
                </button>
              )}
            </div>
            <a
              href={sheet.editUrl || `https://docs.google.com/spreadsheets/d/${sheet.id}/edit`}
              target="_blank"
              rel="noreferrer"
              className="block text-center bg-green-100 hover:bg-green-200 text-green-900 font-semibold py-2 rounded-lg transition"
            >
              Open Google Sheet
            </a>
          </div>
          );
        })}

        {ADMIN_LINKS.map((item) => {
          const keys = LABEL_TO_KEYS[item.label] || [];
          const hidden = keys.length > 0 && keys.every(k => hiddenSheets.has(k));
          return (
          <div
            key={item.label}
            className={`bg-white shadow-lg rounded-xl p-6 border ${hidden ? 'border-red-200 opacity-50' : 'border-gray-200'}`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {item.label}
                {hidden && <span className="ml-2 text-xs text-red-500 font-normal">(hidden)</span>}
              </h3>
              {keys.length > 0 && (
                hidden ? (
                  <button
                    onClick={() => handleUnhideSheet(keys)}
                    className="text-green-600 hover:text-green-800 text-sm font-semibold px-2 py-1 rounded hover:bg-green-50 transition"
                    title="Show on sidebar"
                  >
                    ↩ Show
                  </button>
                ) : (
                  <button
                    onClick={() => handleHideSheet(keys)}
                    className="text-red-400 hover:text-red-600 text-lg font-bold leading-none"
                    title="Hide from sidebar"
                  >
                    ✕
                  </button>
                )
              )}
            </div>

            {item.type === "sheet" && (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="block text-center bg-green-100 hover:bg-green-200 text-green-900 font-semibold py-2 rounded-lg transition"
              >
                Open Google Sheet
              </a>
            )}

            {item.type === "link" && (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="block text-center bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold py-2 rounded-lg transition"
              >
                Open in Google Drive
              </a>
            )}

            {item.type === "group" && (
              <>
                <button
                  onClick={() => toggleGroup(item.label)}
                  className="w-full text-left bg-green-100 hover:bg-green-200 text-green-900 font-semibold py-2 px-3 rounded-lg transition flex justify-between items-center"
                >
                  <span>
                    {openGroups[item.label] ? "Hide" : "Show More"}
                  </span>
                  <span className="text-sm">
                    {openGroups[item.label] ? "▲" : "▼"}
                  </span>
                </button>

                {openGroups[item.label] && (
                  <div className="mt-3 space-y-2">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-sm bg-green-50 hover:bg-green-100 text-green-900 px-3 py-2 rounded-md transition"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}
