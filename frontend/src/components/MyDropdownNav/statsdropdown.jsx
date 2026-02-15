import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Stats = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();

    const isProjectsActive = location.pathname.startsWith('/Projects');

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
                <span>Statistics</span>
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
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white  z-20">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <NavLink
                            to="/statistics/projects"
                            className={({ isActive }) => `py-2 rounded-lg pl-3 font-medium block w-full ${isActive ? 'bg-slate-100 text-purple-600' : 'text-gray-700'}`}
                            onClick={handleLinkClick}
                        >
                            Projects
                        </NavLink>
                        <NavLink
                            to="/statistics/publications"
                            className={({ isActive }) => `py-2 rounded-lg pl-3 font-medium block w-full ${isActive ? 'bg-slate-100 text-purple-600' : 'text-gray-700'}`}
                            onClick={handleLinkClick}
                        >
                            Publications
                        </NavLink>

                    </div>
                </div>
            )}
        </li>
    );
};

export default Stats;