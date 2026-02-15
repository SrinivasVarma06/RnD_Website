export const NAV_SHEET_MAP = {
  '/people': ['people'],
  '/Documents': ['documents'],
  '/opportunities': ['opportunities'],
  '/forms': ['forms'],
  '/research-areas': ['research-areas'],
  '/patents': ['patents'],
  '/publications': ['publications'],
  '/Projects/Csr': ['csr'],
  '/Projects/sgnf': ['sgnf'],
  '/Projects/Sponsored': ['sponsored'],
  '/Projects/Consultancy': ['consultancy'],
  '/Projects/Fellowships': ['fellowship'],
  '/Projects/Workshops': ['workshops'],
  '/Committees/biosafety': ['biosafety'],
  '/Committees/ethicscommittee': ['ethics'],
  '/Committees/ipr': ['ipr'],
  '/Labs/cse': ['lab-cse'],
};

export const DROPDOWN_GROUPS = {
  Projects: ['/Projects/Csr', '/Projects/sgnf', '/Projects/Sponsored', '/Projects/Consultancy', '/Projects/Fellowships', '/Projects/Workshops'],
  Committees: ['/Committees/biosafety', '/Committees/ethicscommittee', '/Committees/ipr'],
  Statistics: ['always'], 
};

export function isRouteVisible(route, status) {
  if (!status) return true;

  const sheets = NAV_SHEET_MAP[route];
  if (!sheets) return true; 

  return sheets.some((key) => status[key]?.hasData && !status[key]?.hidden);
}

export function isDropdownVisible(groupName, status) {
  if (!status) return true;

  const children = DROPDOWN_GROUPS[groupName];
  if (!children) return true;
  if (children[0] === 'always') return true;

  if (children.some((route) => isRouteVisible(route, status))) return true;

  const categoryMap = { Projects: 'projects', Committees: 'committees' };
  const cat = categoryMap[groupName];
  if (cat) {
    return Object.entries(status).some(([, info]) => info.dynamic && info.category === cat && !info.hidden);
  }

  return false;
}
