import { useEffect, useCallback } from 'react';

/**
 * Global keyboard shortcuts hook
 * - / : Focus search input
 * - Escape : Close modals/menus, blur search
 */
export function useKeyboardShortcuts({ onFocusSearch, onEscape }) {
  const handleKeyDown = useCallback((event) => {
    // Don't trigger if user is typing in an input/textarea
    const activeElement = document.activeElement;
    const isTyping = activeElement?.tagName === 'INPUT' || 
                     activeElement?.tagName === 'TEXTAREA' ||
                     activeElement?.isContentEditable;

    // "/" key - focus search (only if not already typing)
    if (event.key === '/' && !isTyping) {
      event.preventDefault();
      onFocusSearch?.();
    }

    // Escape key - close menus, blur inputs
    if (event.key === 'Escape') {
      onEscape?.();
      // Blur any focused input
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
