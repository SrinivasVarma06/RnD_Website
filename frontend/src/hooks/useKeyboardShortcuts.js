import { useEffect, useCallback } from 'react';

export function useKeyboardShortcuts({ onFocusSearch, onEscape }) {
  const handleKeyDown = useCallback((event) => {
    const activeElement = document.activeElement;
    const isTyping = activeElement?.tagName === 'INPUT' || 
                     activeElement?.tagName === 'TEXTAREA' ||
                     activeElement?.isContentEditable;

    if (event.key === '/' && !isTyping) {
      event.preventDefault();
      onFocusSearch?.();
    }

    if (event.key === 'Escape') {
      onEscape?.();
      if (isTyping) {
        activeElement.blur();
      }
    }
  }, [onFocusSearch, onEscape]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export default useKeyboardShortcuts;
