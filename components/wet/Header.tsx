/**
 * @file Header.tsx
 * @description Standard Government of Canada header component
 * 
 * This component implements the Canada.ca header with language toggle
 * following the Web Experience Toolkit (WET) design standards.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Language } from '@/lib/i18n';
// Remove GC design system imports as they're causing issues
// We'll style using our custom CSS instead

interface HeaderProps {
  currentLanguage: 'en' | 'fr';
  onLanguageToggle: () => void;
  appTitle: {
    en: string;
    fr: string;
  };
}

const Header: React.FC<HeaderProps> = ({ 
  currentLanguage, 
  onLanguageToggle,
  appTitle 
}) => {
  // Translations
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

  return (
    <header className="gc-header">
      {/* Accessibility Skip Link */}
      <a className="gc-skip-link" href="#main-content">
        {translations.skipToMain[currentLanguage]}
      </a>

      {/* Canada.ca FIP Header - Language toggle section */}
      <div className="bg-gc-blue py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/wet-assets/wmms-blk.svg" 
                width={40} 
                height={40} 
                alt={translations.governmentOfCanada[currentLanguage]}
                className="mr-2" 
              />
              <span className="text-white text-sm md:text-base font-bold">
                {translations.governmentOfCanada[currentLanguage]}
              </span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <button 
              onClick={onLanguageToggle}
              className="text-white hover:underline text-sm"
              aria-label={translations.languageSelection[currentLanguage]}
            >
              {translations.otherLanguage[currentLanguage]}
            </button>
          </div>
        </div>
      </div>

      {/* Application title band */}
      <div className="bg-white border-b border-gray-300">
        <div className="container mx-auto px-4 py-3">
          <h1 className="text-xl md:text-2xl font-semibold text-gc-dark-text">
            <Link href="/" className="no-underline hover:underline text-gc-dark-text">
              {appTitle[currentLanguage]}
            </Link>
          </h1>
        </div>
      </div>

      {/* Add comments for developers */}
      {/* 
        This header follows the Canada.ca WET design system:
        - Top section: GC signature (Government of Canada)
        - Language toggle (English/French)
        - Application title in second band
      */}
    </header>
  );
};

export default Header;
