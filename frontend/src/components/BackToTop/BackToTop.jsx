import React, { useState, useEffect } from 'react';

/**
 * Improved Back to Top Button
 * - Only shows after scrolling down
 * - Smooth animation on appear/disappear
 * - Nice hover effect with icon
 */
const BackToTop = ({ targetId = 'top', offset = -100 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 group transition-all duration-300 ease-in-out
        ${isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      aria-label="Back to top"
    >
      <div className="relative flex items-center justify-center w-12 h-12 bg-purple-600 rounded-full shadow-lg 
        hover:bg-purple-700 hover:shadow-xl hover:scale-110 transition-all duration-200">
        {/* Arrow Icon */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-white transform group-hover:-translate-y-0.5 transition-transform duration-200" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
        </svg>
        
        {/* Tooltip */}
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded 
          opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Back to top
        </span>
      </div>
      
      {/* Ripple effect ring */}
      <div className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-20 group-hover:opacity-30" 
        style={{ animationDuration: '2s' }} 
      />
    </button>
  );
};

export default BackToTop;
