'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import clsx from 'clsx';

interface AccessibilityContextType {
  prefersReducedMotion: boolean;
  highContrastMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  announceMessage: (message: string) => void;
  focusManagement: {
    trapFocus: (container: HTMLElement) => () => void;
    restoreFocus: (element: HTMLElement | null) => void;
  };
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [announcements, setAnnouncements] = useState<string[]>([]);

  // Detect user preferences
  useEffect(() => {
    // Reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    motionQuery.addEventListener('change', (e) => setPrefersReducedMotion(e.matches));

    // High contrast
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    setHighContrastMode(contrastQuery.matches);
    contrastQuery.addEventListener('change', (e) => setHighContrastMode(e.matches));

    // Font size preference
    const savedFontSize = localStorage.getItem('fontSize') as 'small' | 'medium' | 'large';
    if (savedFontSize) {
      setFontSize(savedFontSize);
    }

    return () => {
      motionQuery.removeEventListener('change', (e) => setPrefersReducedMotion(e.matches));
      contrastQuery.removeEventListener('change', (e) => setHighContrastMode(e.matches));
    };
  }, []);

  // Apply font size to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-sm', 'text-base', 'text-lg');
    
    switch (fontSize) {
      case 'small':
        root.classList.add('text-sm');
        break;
      case 'large':
        root.classList.add('text-lg');
        break;
      default:
        root.classList.add('text-base');
    }
    
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  const announceMessage = (message: string) => {
    setAnnouncements(prev => [...prev, message]);
    
    // Clear announcement after a delay
    setTimeout(() => {
      setAnnouncements(prev => prev.slice(1));
    }, 5000);
  };

  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  };

  const restoreFocus = (element: HTMLElement | null) => {
    if (element && element.focus) {
      element.focus();
    }
  };

  const contextValue: AccessibilityContextType = {
    prefersReducedMotion,
    highContrastMode,
    fontSize,
    announceMessage,
    focusManagement: {
      trapFocus,
      restoreFocus,
    },
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {/* Live region for announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcements.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      
      {/* Accessibility controls panel */}
      <div className="fixed bottom-4 right-4 z-40">
        <details className="group">
          <summary className="p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 list-none">
            <span className="sr-only">Accessibility options</span>
            <span role="img" aria-label="Accessibility" className="text-lg">♿</span>
          </summary>
          
          <div className="absolute bottom-full right-0 mb-2 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl min-w-64">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Options d'accessibilité
            </h3>
            
            <div className="space-y-3">
              {/* Font size control */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Taille du texte
                </label>
                <div className="flex space-x-2">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={clsx(
                        'px-3 py-1 text-sm rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
                        fontSize === size
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      )}
                    >
                      {size === 'small' ? 'S' : size === 'medium' ? 'M' : 'L'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preference indicators */}
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p>Mouvement réduit: {prefersReducedMotion ? 'Activé' : 'Désactivé'}</p>
                <p>Contraste élevé: {highContrastMode ? 'Activé' : 'Désactivé'}</p>
              </div>
            </div>
          </div>
        </details>
      </div>

      {children}
    </AccessibilityContext.Provider>
  );
}