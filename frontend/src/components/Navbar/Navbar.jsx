import React from 'react';
import { NavLink } from 'react-router-dom';
import MyDropdownNav from '../MyDropdownNav/MyDropdownNav';
import Ethics from '../MyDropdownNav/ethicsdropdown';
import Stats from '../MyDropdownNav/statsdropdown';
import { useSheetStatus } from '../../context/useSheetStatus';
import { isRouteVisible, isDropdownVisible } from '../../context/sheetMappings';

const Navbar = ({ closeMenu }) => {
    const { status } = useSheetStatus();

    const handleLinkClick = () => {
        if (closeMenu) closeMenu();
    };

    const baseLinkClasses = "py-2.5 rounded-lg pl-4 font-medium block w-full transition-all duration-200";
    
    const getLinkClasses = ({ isActive }) => 
      `${baseLinkClasses} ${isActive 
        ? 'bg-purple-50 text-purple-700 border-l-4 border-purple-600 pl-3' 
        : 'text-gray-800 hover:bg-slate-50 hover:text-purple-600 hover:pl-5'}`;

    return (
        <nav className="h-full w-full bg-white overflow-y-auto pb-20">
            <div className="flex justify-between items-center p-4 sm:hidden">
                <h2 className="font-bold text-gray-800">Menu</h2>
            </div>
            <ul className="space-y-1 p-3">
                <li className='rounded-lg transition-all duration-200'>
                    <NavLink
                        to="/"
                        className={getLinkClasses}
                        onClick={handleLinkClick}
                        end
                    >
                        Home
                    </NavLink>
                </li>
                {isRouteVisible('/people', status) && (
                <li className='rounded-lg transition-all duration-200'>
                    <NavLink
                        to="/people"
                        className={getLinkClasses}
                        onClick={handleLinkClick}
                    >
                        People
                    </NavLink>
                </li>
                )}
                
                {isRouteVisible('/Documents', status) && (
                <li className='rounded-lg transition-all duration-200'>
                    <NavLink
                        to="/Documents"
                        className={getLinkClasses}
                        onClick={handleLinkClick}
                    >
                       Documents
                    </NavLink>
                </li>
                )}
                {isRouteVisible('/opportunities', status) && (
                <li className='rounded-lg transition-all duration-200'>
                    <NavLink
                        to="/opportunities"
                        className={getLinkClasses}
                        onClick={handleLinkClick}
                    >
                        Call for Proposals
                    </NavLink>
                </li>
                )}
                {isDropdownVisible('Projects', status) && <MyDropdownNav sheetStatus={status} />}
                {isDropdownVisible('Statistics', status) && <Stats/>}
                {isDropdownVisible('Committees', status) && <Ethics sheetStatus={status} />}

                <li className='rounded-lg transition-all duration-200'>
                    <a
                        href="https://iitdh.ac.in/csr-contribution"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${baseLinkClasses} text-gray-800 hover:bg-slate-50 hover:text-purple-600 hover:pl-5`}
                    >
                        CSR Donations
                    </a>
                </li>
                
                {isRouteVisible('/forms', status) && (
                <li className='rounded-lg transition-all duration-200'>
                    <NavLink
                        to="/forms"
                        className={getLinkClasses}
                        onClick={handleLinkClick}
                    >
                        Forms
                    </NavLink>
                </li>
                )}
                {isRouteVisible('/research-areas', status) && (
                <li className='rounded-lg transition-all duration-200'>
                    <NavLink
                        to="/research-areas"
                        className={getLinkClasses}
                        onClick={handleLinkClick}
                    >
                        Research Areas
                    </NavLink>
                </li>
                )}
                <li className='rounded-lg transition-all duration-200'>
                    <NavLink
                        to="/Labs/cse"
                        className={getLinkClasses}
                        onClick={handleLinkClick}
                    >
                        Labs
                    </NavLink>
                </li>
               
                <li className='rounded-lg transition-all duration-200'>
                    <NavLink
                        to="/feedback"
                        className={getLinkClasses}
                        onClick={handleLinkClick}
                    >
                        Feedback
                    </NavLink>
                </li>
                
                {isRouteVisible('/patents', status) && (
                <li className='rounded-lg transition-all duration-200'>
                    <NavLink
                        to="/patents"
                        className={getLinkClasses}
                        onClick={handleLinkClick}
                    >
                        Patents
                    </NavLink>
                </li>
                )}
                {isRouteVisible('/publications', status) && (
                 <li className='rounded-lg transition-all duration-200'>
                    <NavLink
                        to="/publications"
                        className={getLinkClasses}
                        onClick={handleLinkClick}
                    >
                        Publications
                    </NavLink>
                </li>
                )}

                {status && Object.entries(status)
                    .filter(([, info]) => info.dynamic && info.hasData && (!info.category || info.category === 'other') && !info.hidden)
                    .map(([key, info]) => (
                        <li key={key} className='rounded-lg transition-all duration-200'>
                            <NavLink
                                to={info.route || `/sheet/${key}`}
                                className={getLinkClasses}
                                onClick={handleLinkClick}
                            >
                                {info.label || key}
                            </NavLink>
                        </li>
                    ))
                }
                
            </ul>
        </nav>
    );
};

export default Navbar;
