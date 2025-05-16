/**
 * @file Header.tsx
 * @description Government of Canada header component
 * 
 * This component implements the GC Design System header with language toggle and search
 * following the official Canada.ca design standards.
 * Reference: https://design-system.alpha.canada.ca/en/components/header/
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';

// Header component props interface
interface HeaderProps {
  currentLanguage: 'en' | 'fr';
  onLanguageToggle: () => void;
  appTitle: {
    en: string;
    fr: string;
  };
}

/**
 * Canada.ca standard header component with GC signature, language toggle, and search
 * Based on the GC Design System specs: https://design-system.alpha.canada.ca/en/components/header/
 */
const Header: React.FC<HeaderProps> = ({ 
  currentLanguage, 
  onLanguageToggle,
  appTitle 
}) => {
  // Search functionality state
  const [searchTerm, setSearchTerm] = useState('');

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Replace with actual search functionality when implemented
    console.log('Search submitted:', searchTerm);
    alert(`Search initiated for: ${searchTerm}`);
  };

  // Translations for accessibility and UI elements
  const translations = {
    skipToMain: {
      en: 'Skip to main content',
      fr: 'Passer au contenu principal',
    },
    languageSelection: {
      en: 'Language selection',
      fr: 'Sélection de la langue',
    },
    search: {
      en: 'Search',
      fr: 'Recherche',
    },
    searchPlaceholder: {
      en: 'Search GC-RCP Lite',
      fr: 'Rechercher GC-RCP Lite',
    },
    governmentOfCanada: {
      en: 'Government of Canada',
      fr: 'Gouvernement du Canada',
    },
    toggleMenu: {
      en: 'Menu',
      fr: 'Menu',
    },
    otherLanguage: {
      en: 'Français',
      fr: 'English',
    },
  };

  // Get the correct signature SVG based on current language
  const signatureSrc = currentLanguage === 'en' 
    ? '/wet-assets/sig-blk-en.svg' 
    : '/wet-assets/sig-blk-fr.svg';

  return (
    <header className="gcds-header" role="banner">
      {/* Accessibility Skip Link */}
      <div className="gcds-header__skip-container">
        <a className="gcds-header__skip-link" href="#main-content">
          {translations.skipToMain[currentLanguage]}
        </a>
      </div>

      {/* Main Header Container */}
      <div className="gcds-header__container">
        {/* Top Section: GC Signature, Search, and Language Toggle */}
        <div className="gcds-header__top-section">
          <div className="gcds-header__top-content container mx-auto">
            {/* Government of Canada Signature */}
            <div className="gcds-header__logo">
              <Link href="https://www.canada.ca/" className="gcds-header__logo-link">
                {currentLanguage === 'en' ? (
                  // English signature SVG
                  <div 
                    className="gcds-header__signature"
                    dangerouslySetInnerHTML={{
                      __html: `<object type="image/svg+xml" data="/wet-assets/sig-blk-en.svg" width="300" height="32" role="img" aria-label="${translations.governmentOfCanada[currentLanguage]}" class="gcds-header__logo-img"></object>`
                    }}
                  />
                ) : (
                  // French signature SVG
                  <div 
                    className="gcds-header__signature"
                    dangerouslySetInnerHTML={{
                      __html: `<object type="image/svg+xml" data="/wet-assets/sig-blk-fr.svg" width="300" height="32" role="img" aria-label="${translations.governmentOfCanada[currentLanguage]}" class="gcds-header__logo-img"></object>`
                    }}
                  />
                )}
              </Link>
            </div>
            
            {/* Search and Language Toggle Section */}
            <div className="gcds-header__actions">
              {/* Search Form */}
              <div className="gcds-header__search">
                <form onSubmit={handleSearchSubmit} role="search" className="gcds-header__search-form">
                  <label htmlFor="header-search" className="sr-only">
                    {translations.search[currentLanguage]}
                  </label>
                  <div className="gcds-header__search-wrapper">
                    <input
                      id="header-search"
                      type="search"
                      name="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={translations.searchPlaceholder[currentLanguage]}
                      className="gcds-header__search-input"
                    />
                    <button type="submit" className="gcds-header__search-btn">
                      <Search className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">{translations.search[currentLanguage]}</span>
                    </button>
                  </div>
                </form>
              </div>
              
              {/* Language Toggle Section */}
              <div className="gcds-header__lang">
                <button 
                  onClick={onLanguageToggle}
                  className="gcds-header__lang-btn"
                  aria-label={translations.languageSelection[currentLanguage]}
                  lang={currentLanguage === 'en' ? 'fr' : 'en'}
                >
                  {translations.otherLanguage[currentLanguage]}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Application Title Section */}
        <div className="gcds-header__app-bar">
          <div className="container mx-auto px-4 md:px-8 py-4">
            <h1 className="gcds-header__app-title">
              <Link href="/" className="gcds-header__app-link">
                {appTitle[currentLanguage]}
              </Link>
            </h1>
          </div>
        </div>
      </div>

      {/* 
        This header follows the GC Design System specifications:
        - Accessibility skip link
        - GC signature (Government of Canada)
        - Search functionality
        - Language toggle (English/French)
        - Application title in secondary bar
        
        Reference: https://design-system.alpha.canada.ca/en/components/header/
      */}
    </header>
  );
};

export default Header;
