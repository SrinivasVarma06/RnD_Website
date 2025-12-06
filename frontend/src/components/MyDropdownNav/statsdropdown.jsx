import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import MyDropdownNav from './MyDropdownNav';
const Stats = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();

    // isProjectsActive is still useful for other logic, but not for button highlight
    const isProjectsActive = location.pathname.startsWith('/Projects');

    // Effect to close the dropdown if a click occurs outside of it
    // This is crucial for click-to-open dropdowns
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

    // Function to close the dropdown when a link within it is clicked
    const handleLinkClick = () => {
        setIsOpen(false);
    };

    return (
        <li
            className='rounded-lg hover:bg-slate-100 transition-all duration-200 relative'
            ref={dropdownRef}
        >
            {/* Dropdown Button - styled as a regular nav item, NO active highlight */}
            <button
                type="button"
                className={`
                    py-2 pl-3 font-medium block w-full text-left
                    rounded-lg transition-all duration-400 cursor-pointer
                    text-gray-700 hover:bg-slate-100 border border-transparent // Always apply these
                    focus:outline-none focus:bg-slate-100
                    flex items-center space-x-1 // Ensure text and icon are side-by-side with spacing
                `}
                onClick={() => setIsOpen(!isOpen)} // This is the primary trigger now
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <span>Statistics</span>
                <span className="flex-grow"></span> {/* This span pushes the SVG to the right */}
                <svg
                    className={`
                        h-5 w-5
                        transition-transform duration-300 ease-in-out // Smooth transition for rotation
                        ${isOpen ? 'rotate-180' : 'rotate-0'} // Rotate 180 degrees when open, 0 when closed
                    `}
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
                >
                    {/* Reverted to the original down-pointing arrow path */}
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

            {/* Dropdown Menu - now positioned to drop down */}
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
                        {/* <NavLink

                            to="/statistics/Office"

                            className={({ isActive }) => `py-2 rounded-lg pl-3 font-medium block w-full ${isActive ? 'bg-slate-100 text-purple-600' : 'text-gray-700'}`}
                            onClick={handleLinkClick}
                        >
                            Office
                        </NavLink> */}
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