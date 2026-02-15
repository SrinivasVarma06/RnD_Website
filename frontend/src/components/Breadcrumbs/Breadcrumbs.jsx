import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNames = {
  '': 'Home',
  'people': 'People',
  'documents': 'Documents',
  'opportunities': 'Call for Proposals',
  'forms': 'Forms',
  'research-areas': 'Research Areas',
  'publications': 'Publications',
  'patents': 'Patents',
  'feedback': 'Feedback',
  'deans': 'Deans',
  'search': 'Search Results',
  'FundingStatistics': 'Funding Statistics',
  'statistics': 'Statistics',
  'projects': 'Projects',
  'office': 'Office',
  'Projects': 'Projects',
  'Sponsored': 'Sponsored Projects',
  'Consultancy': 'Consultancy Projects',
  'Csr': 'CSR Projects',
  'sgnf': 'SGNF',
  'Fellowships': 'Fellowships',
  'Workshops': 'Workshops',
  'Committees': 'Committees',
  'ethicscommittee': 'Ethics Committee',
  'ipr': 'IPR Committee',
  'biosafety': 'Biosafety Committee',
  'Labs': 'Labs',
  'cse': 'Computer Science',
  'biosciences': 'Biosciences',
  'humanities': 'Humanities',
  'mechanical': 'Mechanical Engineering',
  'chemistry': 'Chemistry',
  'chemicaleng': 'Chemical Engineering',
  'physics': 'Physics',
  'eece': 'EECE',
  'civil': 'Civil Engineering',
  'mathematics': 'Mathematics',
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) {
    return null;
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="px-4 md:px-8 py-3 bg-white border-b border-gray-100 sticky top-[70px] z-30 shadow-sm"
    >
      <ol className="flex items-center flex-wrap gap-1 text-sm">
        <li className="flex items-center">
          <Link 
            to="/" 
            className="flex items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors duration-200"
          >
            <Home size={14} />
            <span>Home</span>
          </Link>
        </li>

        {pathnames.map((segment, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const displayName = routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

          return (
            <li key={routeTo} className="flex items-center">
              <ChevronRight size={14} className="text-gray-400 mx-1" />
              {isLast ? (
                <span className="text-purple-700 font-medium">
                  {displayName}
                </span>
              ) : (
                <Link 
                  to={routeTo} 
                  className="text-gray-500 hover:text-purple-600 transition-colors duration-200"
                >
                  {displayName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
