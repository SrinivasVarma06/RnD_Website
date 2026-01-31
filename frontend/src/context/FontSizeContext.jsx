import React, { createContext, useContext, useState, useEffect } from 'react';

const FontSizeContext = createContext();

// Default font size is 16px (100%), min 12px (75%), max 24px (150%)
const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 24;
const DEFAULT_FONT_SIZE = 16;
const STEP = 2;

export function FontSizeProvider({ children }) {
  const [fontSize, setFontSize] = useState(() => {
    // Load saved font size from localStorage
    const saved = localStorage.getItem('rnd-font-size');
    return saved ? parseInt(saved, 10) : DEFAULT_FONT_SIZE;
  });

  useEffect(() => {
    // Apply font size to root HTML element
    document.documentElement.style.fontSize = `${fontSize}px`;
    // Save to localStorage
    localStorage.setItem('rnd-font-size', fontSize.toString());
  }, [fontSize]);

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + STEP, MAX_FONT_SIZE));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - STEP, MIN_FONT_SIZE));
  };

  const resetFontSize = () => {
    setFontSize(DEFAULT_FONT_SIZE);
  };

  const value = {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    canIncrease: fontSize < MAX_FONT_SIZE,
    canDecrease: fontSize > MIN_FONT_SIZE,
  };

  return (
    <FontSizeContext.Provider value={value}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
}
