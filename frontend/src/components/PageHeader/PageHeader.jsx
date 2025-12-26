import React from 'react';

/**
 * Reusable Page Header Component
 * @param {string} title - Main page title
 * @param {string} subtitle - Optional subtitle/description
 * @param {string} icon - Optional emoji or icon character
 * @param {boolean} gradient - Use gradient background (default: true)
 */
const PageHeader = ({ title, subtitle, icon, gradient = true }) => {
  if (gradient) {
    return (
      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-700 to-purple-900 rounded-lg shadow-lg px-6 py-6 md:py-8">
          <div className="flex items-center justify-center gap-3">
            {icon && <span className="text-2xl md:text-3xl">{icon}</span>}
            <h1 className="text-xl md:text-3xl font-bold text-white text-center">
              {title}
            </h1>
          </div>
          {subtitle && (
            <p className="text-purple-200 text-center mt-2 text-sm md:text-base">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="border-b-2 border-purple-600 pb-4">
        <div className="flex items-center gap-3">
          {icon && <span className="text-2xl md:text-3xl">{icon}</span>}
          <h1 className="text-xl md:text-3xl font-bold text-gray-800">
            {title}
          </h1>
        </div>
        {subtitle && (
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
