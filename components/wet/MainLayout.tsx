/**
 * @file MainLayout.tsx
 * @description Main layout component with Canada.ca header and footer
 * 
 * This component provides the standard Government of Canada web layout
 * including accessibility features, responsive design, and bilingual support.
 * It wraps all pages in the application with the WET theme components.
 */

'use client';

import { ReactNode, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useTranslation, Language } from '@/lib/i18n';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { language, toggleLanguage, t } = useTranslation();
  
  // Application title in both languages
  const appTitle = {
    en: 'GC-RCP Lite - Risk & Compliance Self-Assessment Portal',
    fr: 'GC-RCP Lite - Portail d\'auto-évaluation des risques et de la conformité'
  };

  // Determine which display mode to use for the footer (compact is default, full shows more links)
  // For smaller applications, compact is recommended
  // For larger applications or those closely tied to Canada.ca, full mode is preferred
  const footerDisplayMode = 'compact'; // Options: 'compact' | 'full'
  
  // Whether to show the contextual band with application-specific links in the footer
  // Useful for application-specific support or help links
  const showContextualBand = true;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Skip to main content link for accessibility */}
      <a className="gc-skip-link" href="#main-content">
        {language === 'en' ? 'Skip to main content' : 'Passer au contenu principal'}
      </a>
      
      {/* GC Design System header with language toggle and search */}
      <Header 
        currentLanguage={language as Language} 
        onLanguageToggle={toggleLanguage}
        appTitle={appTitle}
      />
      
      {/* Main content area */}
      <main 
        id="main-content" 
        className="flex-grow container mx-auto px-4 py-6"
        role="main"
        tabIndex={-1} // Makes the element focusable for skip link
      >
        {children}
      </main>
      
      {/* GC Design System footer with configurable display modes */}
      <Footer 
        currentLanguage={language as Language}
        displayMode={footerDisplayMode}
        showContextualBand={showContextualBand}
      />
      
      {/* 
        Developer Notes:
        
        1. Layout Structure:
          - This layout follows the GC Design System standards for Government of Canada applications
          - The structure consists of header, main content area, and footer components
          - The layout is responsive and works on all device sizes
        
        2. Header Implementation:
          - Includes the mandatory Government of Canada signature
          - Provides language toggle between English and French
          - Contains search functionality for the application
          - Displays the application title in a secondary bar
        
        3. Footer Implementation:
          - Supports two display modes: 'compact' and 'full'
          - The 'compact' mode includes just the required links and Government of Canada wordmark
          - The 'full' mode adds three columns of Government of Canada links
          - The contextual band can be enabled to show application-specific support links
        
        4. Accessibility Features:
          - Skip link to main content for keyboard and screen reader users
          - Proper ARIA roles and labels on all sections
          - Tabindex on main content to make it focusable by skip link
          - High contrast elements following WCAG 2.1 AA standards
        
        5. Bilingual Support:
          - All UI elements support both English and French
          - Language toggle persists language selection
          - Content is dynamically rendered in the selected language
      */}
    </div>
  );
};

export default MainLayout;
