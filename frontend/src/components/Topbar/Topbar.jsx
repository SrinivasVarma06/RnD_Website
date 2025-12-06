// src/components/Topbar.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/institute-logo.png'

function Topbar({ toggleMobileMenu, isMobileMenuOpen }) {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#fafaff] backdrop-blur-sm py-2 px-4 sm:px-6 flex items-center justify-between shadow-sm z-50 h-[70px] transition-all duration-300">
      {/* Mobile menu button and Logo */}
      <div className="flex items-center">
        <button
          className="sm:hidden flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none mr-2"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
        {/* Default Logo (hidden on small screens) */}
        <img
          src={logo}
          alt="IIT DH"
          onClick={()=> window.open('https://www.iitdh.ac.in/', '_blank')}
          className="hidden sm:block cursor-pointer h-[40px] sm:h-[45px] md:h-[55px] w-auto transition-transform duration-200 hover:scale-[1.02]"
        />
        {/* Mobile Logo (visible only on small screens) */}
        <img
          src="/institute_favicon.png"
          alt="IIT DH"
          onClick={()=> window.open('https://www.iitdh.ac.in/', '_blank')}
          className="block sm:hidden cursor-pointer h-[50px] w-auto transition-transform duration-200 hover:scale-[1.02]"
        />
      </div>

      {/* Department name - centered on laptop+ screens */}
      <div className="flex-1 hidden sm:flex justify-center items-center">
        <h1
          onClick={()=> navigate('/')}
          // Added '!' prefix to make these styles important
          className="cursor-pointer !text-base md:!text-lg lg:!text-xl !font-bold !text-gray-800 !tracking-wide !text-center"
        >
          Research and Development Section
        </h1>
      </div>

      {/* Department name - mobile only - abbreviated */}
      <div className="flex sm:hidden max-w-[300px]">
        <h1
          onClick={()=> navigate('/')}
          // Added '!' prefix to make these styles important
          className="cursor-pointer !text-xs !font-semibold !text-gray-800 !tracking-wide !text-center"
        >
          Research and Development Section
        </h1>
      </div>

      {/* Search bar */}
      <div className="hidden sm:block">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
          aria-label="Search"
          className="py-[0.4rem] px-[0.8rem] border border-[#e0e0ff] rounded-full text-[0.85rem] bg-white/70 w-[150px] md:w-[180px] transition-all duration-200 focus:outline-none focus:border-[#d0d0ff] focus:shadow focus:shadow-[#d0d0ff]/40 focus:w-[200px]"
        />
      </div>
    </header>
  )
}

export default Topbar