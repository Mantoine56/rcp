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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Skip to main content link for accessibility */}
      <a className="gc-skip-link" href="#main-content">
        {language === 'en' ? 'Skip to main content' : 'Passer au contenu principal'}
      </a>
      
      {/* Canada.ca standard header */}
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
      
      {/* Canada.ca standard footer */}
      <Footer currentLanguage={language as Language} />
      
      {/* 
        Developer comments:
        - This layout follows Canada.ca Web Experience Toolkit standards
        - It includes all required accessibility features (skip links, proper ARIA roles)
        - The header includes the Government of Canada wordmark and language toggle
        - The footer includes mandatory links and date modified info
      */}
    </div>
  );
};

export default MainLayout;
