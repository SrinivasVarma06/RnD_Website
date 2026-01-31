// src/components/Topbar.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/institute-logo.png'
import FontSizeControl from '../FontSizeControl/FontSizeControl'

function Topbar({ toggleMobileMenu, isMobileMenuOpen, setMobileMenuOpen }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const mobileSearchRef = useRef(null)
  const desktopSearchRef = useRef(null)
  const navigate = useNavigate()

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setMobileSearchOpen(false)
    }
  }

  const handleMobileSearch = () => {
    if (mobileSearchOpen && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setMobileSearchOpen(false)
    } else {
      setMobileSearchOpen(!mobileSearchOpen)
    }
  }

  // Keyboard shortcuts: "/" to focus search, "Escape" to close
  useEffect(() => {
    const handleKeyDown = (event) => {
      const activeElement = document.activeElement
      const isTyping = activeElement?.tagName === 'INPUT' || 
                       activeElement?.tagName === 'TEXTAREA' ||
                       activeElement?.isContentEditable

      // "/" key - focus search (only if not already typing)
      if (event.key === '/' && !isTyping) {
        event.preventDefault()
        if (window.innerWidth >= 640) {
          desktopSearchRef.current?.focus()
        } else {
          setMobileSearchOpen(true)
        }
      }

      // Escape key - close menus, blur inputs
      if (event.key === 'Escape') {
        setMobileSearchOpen(false)
        if (setMobileMenuOpen) setMobileMenuOpen(false)
        if (isTyping) activeElement.blur()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [setMobileMenuOpen])

  // Close mobile search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
        setMobileSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 backdrop-blur-sm py-2 px-4 sm:px-6 flex items-center justify-between shadow-sm z-50 h-[70px] transition-all duration-300" style={{ backgroundColor: '#89288f' }}>
      {/* Mobile menu button and Logo */}
      <div className="flex items-center">
        <button
          className="sm:hidden flex items-center justify-center p-2 rounded-md text-white hover:text-gray-100 focus:outline-none mr-2"
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
        {/* Default Logo (hidden on small screens) - with white background for visibility */}
        <div className="hidden sm:flex items-center bg-white rounded-lg p-1">
          <img
            src={logo}
            alt="IIT Dharwad"
            onClick={()=> window.open('https://www.iitdh.ac.in/', '_blank')}
            className="cursor-pointer h-[38px] sm:h-[42px] md:h-[50px] w-auto transition-transform duration-200 hover:scale-[1.02]"
          />
        </div>
        {/* Mobile Logo (visible only on small screens) - with white background */}
        <div className="flex sm:hidden items-center bg-white rounded-lg p-1">
          <img
            src="/institute_favicon.png"
            alt="IIT Dharwad"
            onClick={()=> window.open('https://www.iitdh.ac.in/', '_blank')}
            className="cursor-pointer h-[40px] w-auto transition-transform duration-200 hover:scale-[1.02]"
          />
        </div>
      </div>

      {/* Department name - centered on laptop+ screens */}
      <div className="flex-1 hidden sm:flex justify-center items-center">
        <h1
          onClick={()=> navigate('/')}
          className="cursor-pointer !text-base md:!text-lg lg:!text-xl !font-bold !text-white !tracking-wide !text-center"
        >
          Research and Development Section
        </h1>
      </div>

      {/* Department name - mobile only - abbreviated */}
      <div className="flex sm:hidden flex-1 justify-center">
        <h1
          onClick={()=> navigate('/')}
          className="cursor-pointer !text-xs !font-semibold !text-white !tracking-wide !text-center"
        >
          Research and Development Section
        </h1>
      </div>

      {/* Desktop Search bar and Font Size Control */}
      <div className="hidden sm:flex items-center gap-3">
        <FontSizeControl />
        <div className="relative">
          <input
            ref={desktopSearchRef}
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            aria-label="Search (Press / to focus)"
            className="py-[0.4rem] px-[0.8rem] border border-white rounded-full text-[0.85rem] bg-white w-[150px] md:w-[180px] transition-all duration-200 focus:outline-none focus:border-white focus:shadow focus:shadow-white/40 focus:w-[200px] placeholder-black text-black"
          />
        </div>
      </div>

      {/* Mobile Font Size Control & Search */}
      <div className="sm:hidden flex items-center gap-2" ref={mobileSearchRef}>
        <FontSizeControl />
        <div className={`flex items-center transition-all duration-300 ${mobileSearchOpen ? 'mr-2' : ''}`}>
          {mobileSearchOpen && (
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              autoFocus
              className="py-1.5 px-3 rounded-full text-sm bg-white w-[140px] transition-all duration-200 focus:outline-none placeholder-gray-500 text-black"
            />
          )}
        </div>
        <button
          onClick={handleMobileSearch}
          className="p-2 rounded-full text-white hover:bg-white/20 transition-colors duration-200"
          aria-label="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </header>
  )
}

export default Topbar