/**
 * @file LanguageProvider.tsx
 * @description Context provider for language switching
 * 
 * This component provides a context for language selection (English/French)
 * throughout the application. It handles language state management
 * and provides a translation function to all child components.
 */

'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { LanguageContext, translate, Language, toggleLanguage } from '@/lib/i18n';

interface LanguageProviderProps {
  children: ReactNode;
}

const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Initialize with default language (English) or from localStorage if available
  const [language, setLanguageState] = useState<Language>('en');
  
  // Load saved language preference on initial render
  useEffect(() => {
    // Check if we're in a browser environment (not SSR)
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('gc-rcp-language') as Language | null;
      
      // Only set if it's a valid language option
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
        setLanguageState(savedLanguage);
      } else {
        // Default to browser language if available and supported
        const browserLang = navigator.language.substring(0, 2);
        if (browserLang === 'fr') {
          setLanguageState('fr');
        }
        // Otherwise default is already 'en'
      }
    }
  }, []);
  
  // Function to change the language and save to localStorage
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    
    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('gc-rcp-language', newLanguage);
    }
    
    // Update document lang attribute for accessibility
    document.documentElement.lang = newLanguage;
  };
  
  // Shorthand function for getting translations
  const t = (key: string, placeholders?: Record<string, string>) => {
    return translate(key, language, placeholders);
  };
  
  // Handler for toggling between English and French
  const handleToggleLanguage = () => {
    const newLanguage = toggleLanguage(language);
    setLanguage(newLanguage);
  };
  
  // Create context value with current language, setter, and translation function
  const contextValue = {
    language,
    setLanguage,
    t,
    // Add the toggle handler as a convenience
    toggleLanguage: handleToggleLanguage,
  };
  
  // Provide language context to all child components
  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
