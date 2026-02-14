/**
 * Maps sidebar nav routes to their sheet data key(s).
 * If ALL mapped sheets are empty, the nav item is hidden.
 */
export const NAV_SHEET_MAP = {
  // Simple pages → single sheet key
  '/people': ['people'],
  '/Documents': ['documents'],
  '/opportunities': ['opportunities'],
  '/forms': ['forms'],
  '/research-areas': ['research-areas'],
  '/patents': ['patents'],
  '/publications': ['publications'],

  // Projects dropdown items
  '/Projects/Csr': ['csr'],
  '/Projects/sgnf': ['sgnf'],
  '/Projects/Sponsored': ['sponsored'],
  '/Projects/Consultancy': ['consultancy'],
  '/Projects/Fellowships': ['fellowship'],
  '/Projects/Workshops': ['workshops'],

  // Committees dropdown items
  '/Committees/biosafety': ['biosafety'],
  '/Committees/ethicscommittee': ['ethics'],
  '/Committees/ipr': ['ipr'],

  // Labs (visible if at least one has data)
  '/Labs/cse': ['lab-cse'],
};

/**
 * Dropdown groups: visible if at least one child has data.
 */
export const DROPDOWN_GROUPS = {
  Projects: ['/Projects/Csr', '/Projects/sgnf', '/Projects/Sponsored', '/Projects/Consultancy', '/Projects/Fellowships', '/Projects/Workshops'],
  Committees: ['/Committees/biosafety', '/Committees/ethicscommittee', '/Committees/ipr'],
  Statistics: ['always'], // Stats are computed, always show
};

/**
 * Check if a route should be visible based on sheet data.
 * Returns true if status hasn't loaded yet (show everything during loading).
 */
export function isRouteVisible(route, status) {
  if (!status) return true;

  const sheets = NAV_SHEET_MAP[route];
  if (!sheets) return true; // No mapping = always visible (Home, Feedback, CSR Donations, etc.)

  return sheets.some((key) => status[key]?.hasData && !status[key]?.hidden);
}

/**
 * Check if a dropdown group should be visible.
 * Hidden only if ALL children (both built-in and dynamic) are hidden.
 */
export function isDropdownVisible(groupName, status) {
  if (!status) return true;

  const children = DROPDOWN_GROUPS[groupName];
  if (!children) return true;
  if (children[0] === 'always') return true;

  // Check built-in children
  if (children.some((route) => isRouteVisible(route, status))) return true;

  // Also check dynamic sheets in this category
  const categoryMap = { Projects: 'projects', Committees: 'committees' };
  const cat = categoryMap[groupName];
  if (cat) {
    return Object.entries(status).some(([, info]) => info.dynamic && info.category === cat && !info.hidden);
  }

  return false;
}
