/**
 * @file Footer.tsx
 * @description Government of Canada footer component
 * 
 * This component implements the footer following the GC Design System specifications.
 * It supports both compact and full display modes with all required elements.
 * Reference: https://design-system.alpha.canada.ca/en/components/footer/code/
 */

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Footer component props interface
 * @property {string} currentLanguage - Current language ('en' or 'fr')
 * @property {string} [displayMode='compact'] - Footer display mode ('compact' or 'full')
 * @property {boolean} [showContextualBand=false] - Whether to show the contextual band
 */
interface FooterProps {
  currentLanguage: 'en' | 'fr';
  displayMode?: 'compact' | 'full';
  showContextualBand?: boolean;
}

/**
 * Government of Canada standard footer component
 * Follows the GC Design System specifications
 */
const Footer: React.FC<FooterProps> = ({ 
  currentLanguage, 
  displayMode = 'compact',
  showContextualBand = false
}) => {
  // Footer translations for bilingual support
  const translations = {
    aboutGovernment: {
      en: 'About government',
      fr: 'Au sujet du gouvernement',
    },
    aboutThisSite: {
      en: 'About this site',
      fr: 'À propos de ce site',
    },
    contactUs: {
      en: 'Contact us',
      fr: 'Contactez-nous',
    },
    departments: {
      en: 'Departments and agencies',
      fr: 'Ministères et organismes',
    },
    publicService: {
      en: 'Public service and military',
      fr: 'Fonction publique et force militaire',
    },
    news: {
      en: 'News',
      fr: 'Nouvelles',
    },
    treaties: {
      en: 'Treaties, laws and regulations',
      fr: 'Traités, lois et règlements',
    },
    governmentWide: {
      en: 'Government-wide reporting',
      fr: 'Rapports à l\'échelle du gouvernement',
    },
    primeMinister: {
      en: 'Prime Minister',
      fr: 'Premier ministre',
    },
    howGovernmentWorks: {
      en: 'How government works',
      fr: 'Comment le gouvernement fonctionne',
    },
    openGovernment: {
      en: 'Open government',
      fr: 'Gouvernement ouvert',
    },
    socialMedia: {
      en: 'Social media',
      fr: 'Médias sociaux',
    },
    mobileApps: {
      en: 'Mobile applications',
      fr: 'Applications mobiles',
    },
    termsAndConditions: {
      en: 'Terms and conditions',
      fr: 'Avis',
    },
    privacy: {
      en: 'Privacy',
      fr: 'Confidentialité',
    },
    governmentOfCanada: {
      en: 'Government of Canada',
      fr: 'Gouvernement du Canada',
    },
    symbol: {
      en: 'Symbol of the Government of Canada',
      fr: 'Symbole du gouvernement du Canada',
    },
    dateModified: {
      en: 'Date modified:',
      fr: 'Date de modification :',
    },
    footerHeading: {
      en: 'Government of Canada footer',
      fr: 'Pied de page du gouvernement du Canada',
    },
    helpfulLinks: {
      en: 'Helpful links',
      fr: 'Liens utiles',
    },
    appSupport: {
      en: 'Application Support',
      fr: 'Soutien à l\'application',
    },
  };

  // Current date for the date modified section 
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

  // Contextual links - application specific links
  const contextualLinks = [
    { 
      href: '#', 
      text: {
        en: 'Help',
        fr: 'Aide',
      }
    },
    { 
      href: '#', 
      text: {
        en: 'Contact RCP Support',
        fr: 'Contactez le soutien RCP',
      }
    },
    { 
      href: '#', 
      text: {
        en: 'FAQs',
        fr: 'FAQs',
      }
    },
  ];

  // Get the correct wordmark based on current language
  // Using the language-specific wordmark for better compliance with GC standards
  const wordmarkSrc = currentLanguage === 'en' 
    ? '/wet-assets/wmms-blk.svg'
    : '/wet-assets/wmms-fip-fr.svg';
  
  return (
    <footer className="gcds-footer" role="contentinfo" aria-label={translations.footerHeading[currentLanguage]}>
      <h2 id="gcds-footer-heading" className="sr-only">
        {translations.footerHeading[currentLanguage]}
      </h2>

      {/* Contextual Band - Application specific links */}
      {showContextualBand && (
        <div className="gcds-footer__contextual-band">
          <div className="container mx-auto px-4 py-6" style={{ maxWidth: '1200px' }}>
            <div className="gcds-footer__contextual-content">
              <h3 className="gcds-footer__contextual-heading" style={{ 
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-4)'
              }}>
                {translations.appSupport[currentLanguage]}
              </h3>
              <nav className="gcds-footer__contextual-nav" aria-labelledby="gcds-footer-contextual-nav">
                <h4 id="gcds-footer-contextual-nav" className="sr-only">
                  {translations.helpfulLinks[currentLanguage]}
                </h4>
                <ul className="gcds-footer__contextual-links" style={{ 
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--space-5)'
                }}>
                  {contextualLinks.map((link, index) => (
                    <li key={index} className="gcds-footer__contextual-link-item">
                      <Link 
                        href={link.href} 
                        className="gcds-footer__link"
                        style={{
                          color: 'var(--text-link)',
                          textDecoration: 'underline',
                          fontSize: 'var(--text-base)',
                          fontWeight: 'var(--font-normal)',
                          transition: 'color 0.2s ease'
                        }}
                      >
                        {link.text[currentLanguage]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Links Band - Only for full display */}
      {displayMode === 'full' && (
        <div className="gcds-footer__main-band">
          <div className="container mx-auto px-4 py-8" style={{ maxWidth: '1200px' }}>
            <nav className="gcds-footer__main-nav" aria-labelledby="gcds-footer-main-nav">
              <h3 id="gcds-footer-main-nav" className="sr-only">
                {translations.aboutGovernment[currentLanguage]}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ marginTop: 'var(--space-4)' }}>
                {/* First column */}
                <div>
                  <ul className="gcds-footer__main-links" style={{ 
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-3)'
                  }}>
                    <li className="gcds-footer__main-link-item">
                      <Link 
                        href={`https://www.canada.ca/${currentLanguage}/contact.html`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="gcds-footer__link"
                      >
                        {translations.contactUs[currentLanguage]}
                      </Link>
                    </li>
                    <li className="gcds-footer__main-link-item">
                      <Link 
                        href={`https://www.canada.ca/${currentLanguage}/government/dept.html`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="gcds-footer__link"
                      >
                        {translations.departments[currentLanguage]}
                      </Link>
                    </li>
                    <li className="gcds-footer__main-link-item">
                      <Link 
                        href={`https://www.canada.ca/${currentLanguage}/government/publicservice.html`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="gcds-footer__link"
                      >
                        {translations.publicService[currentLanguage]}
                      </Link>
                    </li>
                  </ul>
                </div>
                {/* Second column */}
                <div>
                  <ul className="gcds-footer__main-links" style={{ 
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-3)'
                  }}>
                    <li className="gcds-footer__main-link-item">
                      <Link 
                        href={`https://www.canada.ca/${currentLanguage}/news.html`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="gcds-footer__link"
                      >
                        {translations.news[currentLanguage]}
                      </Link>
                    </li>
                    <li className="gcds-footer__main-link-item">
                      <Link 
                        href={`https://www.canada.ca/${currentLanguage}/government/system/laws.html`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="gcds-footer__link"
                      >
                        {translations.treaties[currentLanguage]}
                      </Link>
                    </li>
                    <li className="gcds-footer__main-link-item">
                      <Link 
                        href={`https://www.canada.ca/${currentLanguage}/transparency/reporting.html`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="gcds-footer__link"
                      >
                        {translations.governmentWide[currentLanguage]}
                      </Link>
                    </li>
                  </ul>
                </div>
                {/* Third column */}
                <div>
                  <ul className="gcds-footer__main-links" style={{ 
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-3)'
                  }}>
                    <li className="gcds-footer__main-link-item">
                      <Link 
                        href={`https://pm.gc.ca/${currentLanguage}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="gcds-footer__link"
                      >
                        {translations.primeMinister[currentLanguage]}
                      </Link>
                    </li>
                    <li className="gcds-footer__main-link-item">
                      <Link 
                        href={`https://www.canada.ca/${currentLanguage}/government/system.html`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="gcds-footer__link"
                      >
                        {translations.howGovernmentWorks[currentLanguage]}
                      </Link>
                    </li>
                    <li className="gcds-footer__main-link-item">
                      <Link 
                        href={`https://open.canada.ca/${currentLanguage}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="gcds-footer__link"
                      >
                        {translations.openGovernment[currentLanguage]}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Sub Links Band - Required for all modes */}
      <div className="gcds-footer__sub-band">
        <div className="container mx-auto px-4 py-4" style={{ maxWidth: '1200px' }}>
          <div className="gcds-footer__sub-content">
            {/* Footer links */}
            <nav className="gcds-footer__sub-nav" aria-labelledby="gcds-footer-sub-nav">
              <h3 id="gcds-footer-sub-nav" className="sr-only">
                {translations.aboutThisSite[currentLanguage]}
              </h3>
              <ul className="gcds-footer__sub-links" style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-5)'
              }}>
                <li className="gcds-footer__sub-link-item">
                  <Link 
                    href={`https://www.canada.ca/${currentLanguage}/social.html`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="gcds-footer__link"
                    aria-label={translations.socialMedia[currentLanguage]}
                  >
                    {translations.socialMedia[currentLanguage]}
                  </Link>
                </li>
                <li className="gcds-footer__sub-link-item">
                  <Link 
                    href={`https://www.canada.ca/${currentLanguage}/mobile.html`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="gcds-footer__link"
                    aria-label={translations.mobileApps[currentLanguage]}
                  >
                    {translations.mobileApps[currentLanguage]}
                  </Link>
                </li>
                <li className="gcds-footer__sub-link-item">
                  <Link 
                    href={`https://www.canada.ca/${currentLanguage}/transparency/terms.html`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="gcds-footer__link"
                    aria-label={translations.termsAndConditions[currentLanguage]}
                  >
                    {translations.termsAndConditions[currentLanguage]}
                  </Link>
                </li>
                <li className="gcds-footer__sub-link-item">
                  <Link 
                    href={`https://www.canada.ca/${currentLanguage}/transparency/privacy.html`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="gcds-footer__link"
                    aria-label={translations.privacy[currentLanguage]}
                  >
                    {translations.privacy[currentLanguage]}
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Government of Canada wordmark */}
            <div className="gcds-footer__brand">
              <Image 
                src={wordmarkSrc}
                width={150} 
                height={40} 
                alt={translations.symbol[currentLanguage]} 
                className="gcds-footer__wordmark"
              />
            </div>
          </div>
          
          {/* Date modified section */}
          <div className="gcds-footer__modified-date" style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            paddingTop: 'var(--space-4)',
            marginTop: 'var(--space-4)'
          }}>
            <dl style={{
              display: 'flex',
              gap: 'var(--space-2)',
              margin: 0,
              color: 'var(--text-inverse)',
              fontSize: 'var(--text-sm)'
            }}>
              <dt>
                {translations.dateModified[currentLanguage]}
              </dt>
              <dd>
                {formattedDate}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      {/* 
        Important developer notes:
        
        1. Footer structure:
          - The footer has three potential bands: contextual, main, and sub
          - The sub band is always required and contains the mandatory links and wordmark
          - The main band is used in 'full' display mode and contains gov links in 3 columns
          - The contextual band is optional and contains application-specific links
          
        2. Required elements:
          - Government of Canada wordmark must be included
          - Terms and Conditions and Privacy links are mandatory
          - Date modified section is required
          - All links to external sites should open in a new tab
          
        3. Accessibility features:
          - Each navigation section has proper aria labels and headings
          - Skip links and screen reader text are included
          - Focus states are styled appropriately
          
        4. Bilingual support:
          - All text and links must be available in both English and French
          - URLs should point to the appropriate language version based on currentLanguage
        
        Reference: https://design-system.alpha.canada.ca/en/components/footer/code/
      */}
    </footer>
  );
};

export default Footer;
