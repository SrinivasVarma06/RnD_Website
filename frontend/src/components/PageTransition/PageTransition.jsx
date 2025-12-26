import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Wrapper component for smooth page transitions
 * Uses CSS transitions for fade effect without additional dependencies
 */
const PageTransition = ({ children }) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState('fadeIn');

  useEffect(() => {
    if (children !== displayChildren) {
      setTransitionStage('fadeOut');
    }
  }, [children, displayChildren]);

  const handleTransitionEnd = () => {
    if (transitionStage === 'fadeOut') {
      setDisplayChildren(children);
      setTransitionStage('fadeIn');
    }
  };

  return (
    <div
      onTransitionEnd={handleTransitionEnd}
      className={`transition-all duration-200 ease-out ${
        transitionStage === 'fadeIn' 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-2'
      }`}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;
