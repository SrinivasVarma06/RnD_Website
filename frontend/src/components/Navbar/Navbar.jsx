import React from 'react';
import { NavLink } from 'react-router-dom';
import MyDropdownNav from '../MyDropdownNav/MyDropdownNav';
import Ethics from '../MyDropdownNav/ethicsdropdown';
import Stats from '../MyDropdownNav/statsdropdown';
const Navbar = ({ closeMenu }) => {
    const handleLinkClick = () => {
        if (closeMenu) closeMenu();
    };

    return (
        <nav className="h-full w-full bg-white overflow-y-auto pb-20">
            <div className="flex justify-between items-center p-4 sm:hidden">
                <h2 className="font-bold text-gray-800">Menu</h2>
                {/* <button
                    onClick={closeMenu}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button> */}
            </div>
            <ul className="space-y-1 p-3">
                <li className='rounded-lg hover:bg-slate-100 transition-all duration-200'>
                    <NavLink
                        to="/"
                        className={({ isActive }) => `py-2 rounded-lg pl-3 font-medium block w-full ${isActive ? 'bg-slate-100 text-purple-600' : 'text-gray-700'}`}
                        onClick={handleLinkClick}
                    >
                        Home
                    </NavLink>
                </li>
                {/* <li className='rounded-lg hover:bg-slate-100 transition-all duration-200'>
                    <NavLink
                        to="/message"
                        className={({ isActive }) => `py-2 rounded-lg pl-3 font-medium block w-full ${isActive ? 'bg-slate-100 text-purple-600' : 'text-gray-700'}`}
                        onClick={handleLinkClick}
                    >
                        Message from Dean
                    </NavLink>
                </li> */}
                <li className='rounded-lg hover:bg-slate-100 transition-all duration-200'>
                    <NavLink
                        to="/people"
                        className={({ isActive }) => `py-2 rounded-lg pl-3 font-medium block w-full ${isActive ? 'bg-slate-100 text-purple-600' : 'text-gray-700'}`}
                        onClick={handleLinkClick}
                    >
                        People
                    </NavLink>
                </li>
                
                <li className='rounded-lg hover:bg-slate-100 transition-all duration-200'>
                    <NavLink
                        to="/Documents"
                        className={({ isActive }) => `py-2 rounded-lg pl-3 font-medium block w-full ${isActive ? 'bg-slate-100 text-purple-600' : 'text-gray-700'}`}
                        onClick={handleLinkClick}
                    >

                       Documents

                    </NavLink>
                </li>
                <li className='rounded-lg hover:bg-slate-100 transition-all duration-200'>
                    <NavLink
                        to="/opportunities"
                        className={({ isActive }) => `py-2 rounded-lg pl-3 font-medium block w-full ${isActive ? 'bg-slate-100 text-purple-600' : 'text-gray-700'}`}
                        onClick={handleLinkClick}
                    >
                        Call for Proposals
                    </NavLink>
                </li>
                <MyDropdownNav/>
               <Stats/>
               <Ethics/>

                <li className='rounded-lg hover:bg-slate-100 transition-all duration-200'>
                    {/* <NavLink
                        to="/csr"
                        className={({ isActive }) => `py-2 rounded-lg pl-3 font-medium block w-full ${isActive ? 'bg-slate-100 text-purple-600' : 'text-gray-700'}`}
                        onClick={handleLinkClick}
                    >
                        CSR Donations
                    </NavLink> */}
                    <a
                        href="https://iitdh.ac.in/csr-contribution"
                        target="_blank"
                        rel="noopener noreferrer"
                        className='py-2 rounded-lg pl-3 font-medium block w-full text-gray-700 hover:bg-slate-100 transition-all duration-200'
                    >
                        CSR Donations
                    </a>
                </li>
                
                <li className='rounded-lg hover:bg-slate-100 transition-all duration-200'>
                    <NavLink
                        to="/forms"
                        className={({ isActive }) => `py-2 rounded-lg pl-3 font-medium block w-full ${isActive ? 'bg-slate-100 text-purple-600' : 'text-gray-700'}`}
                        onClick={handleLinkClick}
                    >
                        Forms
                    </NavLink>
                </li>
                <li className='rounded-lg hover:bg-slate-100 transition-all duration-200'>
                    <NavLink
                        to="/research-areas"
                        className={({ isActive }) => `py-2 rounded-lg pl-3 font-medium block w-full ${isActive ? 'bg-slate-100 text-purple-600' : 'text-gray-700'}`}
                        onClick={handleLinkClick}
                    >
                        Research Areas
                    </NavLink>
                </li>
                <li className='rounded-lg hover:bg-slate-100 transition-all duration-200'>
                    <NavLink
                        to="/Labs/cse"
                        className={({ isActive }) => `py-2 rounded-lg pl-3 font-medium block w-full ${isActive ? 'bg-slate-100 text-purple-600' : 'text-gray-700'}`}
                        onClick={handleLinkClick}
                    >
                        Labs
                    </NavLink>
                </li>
               
               {/* <li className='rounded-lg hover:bg-slate-100 transition-all duration-200'>
                    <NavLink
                        to="/deans"
                        className={({ isActive }) => `py-2 rounded-lg pl-3 font-medium block w-full ${isActive ? 'bg-slate-100 text-purple-600' : 'text-gray-700'}`}
                        onClick={handleLinkClick}
                    >
                        Deans
                    </NavLink>
                </li>*/}
                <li className='rounded-lg hover:bg-slate-100 transition-all duration-200'>
                    <NavLink
                        to="/feedback"
                        className={({ isActive }) => `py-2 rounded-lg pl-3 font-medium block w-full ${isActive ? 'bg-slate-100 text-purple-600' : 'text-gray-700'}`}
                        onClick={handleLinkClick}
                    >
                        Feedback
                    </NavLink>
                </li>
                
                <li className='rounded-lg hover:bg-slate-100 transition-all duration-200'>
                    <NavLink
                        to="/patents"
                        className={({ isActive }) => `py-2 rounded-lg pl-3 font-medium block w-full ${isActive ? 'bg-slate-100 text-purple-600' : 'text-gray-700'}`}
                        onClick={handleLinkClick}
                    >
                        Patents
                    </NavLink>
                </li>
                 <li className='rounded-lg hover:bg-slate-100 transition-all duration-200'>
                    <NavLink
                        to="/publications"
                        className={({ isActive }) => `py-2 rounded-lg pl-3 font-medium block w-full ${isActive ? 'bg-slate-100 text-purple-600' : 'text-gray-700'}`}
                        onClick={handleLinkClick}
                    >
                        Publications
                    </NavLink>
                </li>
                
            </ul>
        </nav>
    );
};

export default Navbar;
