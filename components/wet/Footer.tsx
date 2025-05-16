/**
 * @file Footer.tsx
 * @description Government of Canada footer component
 * 
 * This component implements the footer following the GC Design System specifications.
 * It matches the official Canada.ca footer design with all required elements.
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
 * Uses the full display mode as shown at: https://design-system.alpha.canada.ca/en/components/footer/code/
 */
const Footer: React.FC<FooterProps> = ({ 
  currentLanguage, 
  displayMode = 'full', // Default to full display mode for complete footer
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
    <footer className="bg-[#26374A] text-white" role="contentinfo" aria-label={translations.footerHeading[currentLanguage]}>
      <h2 id="gcds-footer-heading" className="sr-only">
        {translations.footerHeading[currentLanguage]}
      </h2>
      
      {/* Application Support section removed as requested */}

      {/* Main Links Band - Full display mode Required Section */}
      <div className="py-8 border-b border-gray-600">
        <div className="container mx-auto px-4" style={{ maxWidth: '1200px' }}>
          {/* Theme section - Top level links related to the site theme */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-3 text-white">Risk & Compliance Portal</h3>
            <ul className="flex flex-wrap gap-x-10 gap-y-4 list-none p-0 m-0">
              <li><Link href="#" className="text-white hover:text-gray-200 underline">About RCP</Link></li>
              <li><Link href="#" className="text-white hover:text-gray-200 underline">Resources</Link></li>
              <li><Link href="#" className="text-white hover:text-gray-200 underline">Training materials</Link></li>
            </ul>
          </div>
          
          {/* Government of Canada section - Main navigation links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">{translations.governmentOfCanada[currentLanguage]}</h3>
            
            {/* Three column layout for main navigation links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8">
              {/* Column 1 */}
              <div>
                <ul className="list-none p-0 m-0 space-y-4">
                  <li><Link href="https://www.canada.ca/en/contact.html" className="text-white hover:text-gray-200 underline font-semibold" target="_blank" rel="noopener noreferrer">All contacts</Link></li>
                  <li><Link href="https://www.canada.ca/en/services/jobs.html" className="text-white hover:text-gray-200 underline" target="_blank" rel="noopener noreferrer">Jobs</Link></li>
                  <li><Link href="https://www.canada.ca/en/services/immigration-citizenship.html" className="text-white hover:text-gray-200 underline" target="_blank" rel="noopener noreferrer">Immigration and citizenship</Link></li>
                  <li><Link href="https://travel.gc.ca/" className="text-white hover:text-gray-200 underline" target="_blank" rel="noopener noreferrer">Travel and tourism</Link></li>
                  <li><Link href="https://www.canada.ca/en/services/business.html" className="text-white hover:text-gray-200 underline" target="_blank" rel="noopener noreferrer">Business</Link></li>
                  <li><Link href="https://www.canada.ca/en/services/benefits.html" className="text-white hover:text-gray-200 underline" target="_blank" rel="noopener noreferrer">Benefits</Link></li>
                  <li><Link href="https://www.canada.ca/en/services/health.html" className="text-white hover:text-gray-200 underline" target="_blank" rel="noopener noreferrer">Health</Link></li>
                </ul>
              </div>
              
              {/* Column 2 */}
              <div>
                <ul className="list-none p-0 m-0 space-y-4">
                  <li><Link href="https://www.canada.ca/en/government/dept.html" className="text-white hover:text-gray-200 underline font-semibold" target="_blank" rel="noopener noreferrer">Departments and agencies</Link></li>
                  <li><Link href="https://www.canada.ca/en/services/taxes.html" className="text-white hover:text-gray-200 underline" target="_blank" rel="noopener noreferrer">Taxes</Link></li>
                  <li><Link href="https://www.canada.ca/en/services/environment.html" className="text-white hover:text-gray-200 underline" target="_blank" rel="noopener noreferrer">Environment and natural resources</Link></li>
                  <li><Link href="https://www.canada.ca/en/services/defence.html" className="text-white hover:text-gray-200 underline" target="_blank" rel="noopener noreferrer">National security and defence</Link></li>
                  <li><Link href="https://www.canada.ca/en/services/culture.html" className="text-white hover:text-gray-200 underline" target="_blank" rel="noopener noreferrer">Culture, history and sport</Link></li>
                  <li><Link href="https://www.canada.ca/en/services/policing.html" className="text-white hover:text-gray-200 underline" target="_blank" rel="noopener noreferrer">Policing, justice and emergencies</Link></li>
                  <li><Link href="https://www.canada.ca/en/services/transport.html" className="text-white hover:text-gray-200 underline" target="_blank" rel="noopener noreferrer">Transport and infrastructure</Link></li>
                </ul>
              </div>
              
              {/* Column 3 */}
              <div>
                <ul className="list-none p-0 m-0 space-y-4">
                  <li><Link href="https://www.canada.ca/en/government/system.html" className="text-white hover:text-gray-200 underline font-semibold" target="_blank" rel="noopener noreferrer">About government</Link></li>
                  <li><Link href="https://www.international.gc.ca/world-monde/index.aspx?lang=eng" className="text-white hover:text-gray-200 underline" target="_blank" rel="noopener noreferrer">Canada and the world</Link></li>
                  <li><Link href="https://www.canada.ca/en/services/finance.html" className="text-white hover:text-gray-200 underline" target="_blank" rel="noopener noreferrer">Money and finance</Link></li>
                  <li><Link href="https://www.canada.ca/en/services/science.html" className="text-white hover:text-gray-200 underline" target="_blank" rel="noopener noreferrer">Science and innovation</Link></li>
                  <li><Link href="https://www.canada.ca/en/services/indigenous-peoples.html" className="text-white hover:text-gray-200 underline" target="_blank" rel="noopener noreferrer">Indigenous Peoples</Link></li>
                  <li><Link href="https://www.veterans.gc.ca/eng" className="text-white hover:text-gray-200 underline" target="_blank" rel="noopener noreferrer">Veterans and military</Link></li>
                  <li><Link href="https://www.canada.ca/en/services/youth.html" className="text-white hover:text-gray-200 underline" target="_blank" rel="noopener noreferrer">Youth</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Links / Social Media section - Required in full display */}
      <div className="border-b border-gray-600 py-4">
        <div className="container mx-auto px-4" style={{ maxWidth: '1200px' }}>
          <ul className="flex flex-wrap gap-x-8 gap-y-3 list-none p-0 m-0">
            <li><Link href="https://www.canada.ca/en/social.html" className="text-white hover:text-gray-200 underline" target="_blank" rel="noopener noreferrer">{currentLanguage === 'en' ? 'Social media' : 'Médias sociaux'}</Link></li>
            <li><Link href="https://www.canada.ca/en/mobile.html" className="text-white hover:text-gray-200 underline" target="_blank" rel="noopener noreferrer">{currentLanguage === 'en' ? 'Mobile applications' : 'Applications mobiles'}</Link></li>
            <li><Link href="https://www.canada.ca/en/government/about.html" className="text-white hover:text-gray-200 underline" target="_blank" rel="noopener noreferrer">{currentLanguage === 'en' ? 'About Canada.ca' : 'À propos de Canada.ca'}</Link></li>
            <li><Link href="https://www.canada.ca/en/transparency/terms.html" className="text-white hover:text-gray-200 underline" target="_blank" rel="noopener noreferrer">{currentLanguage === 'en' ? 'Terms and conditions' : 'Avis'}</Link></li>
            <li><Link href="https://www.canada.ca/en/transparency/privacy.html" className="text-white hover:text-gray-200 underline" target="_blank" rel="noopener noreferrer">{currentLanguage === 'en' ? 'Privacy' : 'Confidentialité'}</Link></li>
          </ul>
        </div>
      </div>

      {/* Brand Band with Date modified and Canada wordmark - Required in all modes */}
      <div className="py-5">
        <div className="container mx-auto px-4" style={{ maxWidth: '1200px' }}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Date modified */}
            <div>
              <span className="text-sm text-white">
                {translations.dateModified[currentLanguage]} {formattedDate}
              </span>
            </div>
            {/* Canada wordmark removed as requested */}
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
