import React from 'react';
import { useFontSize } from '../../context/FontSizeContext';

function FontSizeControl() {
  const { increaseFontSize, decreaseFontSize, canIncrease, canDecrease } = useFontSize();

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={decreaseFontSize}
        disabled={!canDecrease}
        className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-all duration-200 ${
          canDecrease
            ? 'bg-white/20 text-white hover:bg-white/30 cursor-pointer'
            : 'bg-white/10 text-white/50 cursor-not-allowed'
        }`}
        aria-label="Decrease font size"
        title="Decrease font size (A-)"
      >
        A-
      </button>
      <button
        onClick={increaseFontSize}
        disabled={!canIncrease}
        className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-all duration-200 ${
          canIncrease
            ? 'bg-white/20 text-white hover:bg-white/30 cursor-pointer'
            : 'bg-white/10 text-white/50 cursor-not-allowed'
        }`}
        aria-label="Increase font size"
        title="Increase font size (A+)"
      >
        A+
      </button>
    </div>
  );
}

export default FontSizeControl;
