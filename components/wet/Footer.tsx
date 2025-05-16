/**
 * @file Footer.tsx
 * @description Standard Government of Canada footer component
 * 
 * This component implements the Canada.ca footer with required links and copyright
 * following the Web Experience Toolkit (WET) design standards.
 */

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface FooterProps {
  currentLanguage: 'en' | 'fr';
}

const Footer: React.FC<FooterProps> = ({ currentLanguage }) => {
  // Footer translations for bilingual support
  const translations = {
    aboutThisSite: {
      en: 'About this site',
      fr: 'À propos de ce site',
    },
    contactUs: {
      en: 'Contact us',
      fr: 'Contactez-nous',
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
  };

  // Current date for the date modified section 
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

  return (
    <footer className="gc-footer bg-gc-footer-bg mt-8">
      {/* Date modified section */}
      <div className="border-t border-b border-gray-300">
        <div className="container mx-auto px-4 py-3">
          <dl className="flex items-center text-sm">
            <dt className="mr-2 font-semibold text-gc-footer-text">
              {translations.dateModified[currentLanguage]}
            </dt>
            <dd className="text-gc-footer-text">
              {formattedDate}
            </dd>
          </dl>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          {/* Footer links */}
          <nav className="mb-4 md:mb-0">
            <h2 className="sr-only">{translations.aboutThisSite[currentLanguage]}</h2>
            <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-sm">
              <li>
                <Link 
                  href="#" 
                  className="text-gc-footer-text hover:underline"
                >
                  {translations.contactUs[currentLanguage]}
                </Link>
              </li>
              <li>
                <Link 
                  href="https://www.canada.ca/en/transparency/terms.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gc-footer-text hover:underline"
                >
                  {translations.termsAndConditions[currentLanguage]}
                </Link>
              </li>
              <li>
                <Link 
                  href="https://www.canada.ca/en/transparency/privacy.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gc-footer-text hover:underline"
                >
                  {translations.privacy[currentLanguage]}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Government of Canada wordmark */}
          <div>
            <Image 
              src="/wet-assets/wmms-blk.svg"
              width={100} 
              height={24} 
              alt={translations.symbol[currentLanguage]} 
            />
          </div>
        </div>
      </div>

      {/* 
        Important developer notes:
        - The footer must include the date modified section
        - The Canada.ca wordmark must be positioned properly
        - All links should open in a new tab when linking to external sites
        - Always maintain the required links (Terms and Conditions, Privacy)
        - All text and links must be available in both English and French
      */}
    </footer>
  );
};

export default Footer;
