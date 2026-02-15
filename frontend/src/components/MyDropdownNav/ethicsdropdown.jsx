import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { isRouteVisible } from '../../context/sheetMappings';

const Ethics = ({ sheetStatus }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    const items = [
      { route: '/Committees/biosafety', label: 'BioSafety Committee' },
      { route: '/Committees/ethicscommittee', label: 'Institutional Ethics Committee' },
      { route: '/Committees/ipr', label: 'IPR Committee' },
    ];

    if (sheetStatus) {
      Object.entries(sheetStatus)
        .filter(([, info]) => info.dynamic && info.hasData && info.category === 'committees' && !info.hidden)
        .forEach(([key, info]) => {
          items.push({ route: `/Committees/${key}`, label: info.label || key });
        });
    }

    const visibleItems = items.filter(item => {
      if (sheetStatus) {
        const key = item.route.split('/').pop();
        const info = sheetStatus[key];
        if (info && info.dynamic) return true;
      }
      return isRouteVisible(item.route, sheetStatus);
    });

    if (visibleItems.length === 0) return null;

    return (
        <li
            className='rounded-lg hover:bg-slate-100 transition-all duration-200 relative'
            ref={dropdownRef}
        >
            <button
                type="button"
                className={`
                    py-2.5 pl-4 font-medium block w-full text-left
                    rounded-lg transition-all duration-200 cursor-pointer
                    text-gray-800 hover:bg-slate-50 hover:text-purple-600
                    focus:outline-none
                    flex items-center space-x-1
                `}
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <span>Committees</span>
                <span className="flex-grow"></span>
                <svg
                    className={`
                        h-5 w-5
                        transition-transform duration-300 ease-in-out
                        ${isOpen ? 'rotate-180' : 'rotate-0'}
                    `}
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
                >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white z-20">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {visibleItems.map(item => (
                            <NavLink
                                key={item.route}
                                to={item.route}
                                className={({ isActive }) => `
                                    py-2 pl-3 pr-3 font-medium block w-full text-gray-700 hover:text-[blue] hover:bg-slate-100 rounded-lg
                                `}
                                onClick={handleLinkClick}
                                role="menuitem"
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                </div>
            )}
        </li>
    );
};

export default Ethics;