/**
 * @file FormSection.tsx
 * @description Base form section component that follows Canada.ca UI standards
 * 
 * This component provides a standardized layout for form sections
 * with proper accessibility, validation, and bilingual support.
 */

'use client';

import { ReactNode } from 'react';
import { useTranslation } from '@/lib/i18n';

// Types for form section props
interface FormSectionProps {
  title: string;                  // Section title
  subtitle?: string;              // Optional subtitle
  children: ReactNode;            // Form fields
  helpText?: string;              // Optional help text
  infoMessage?: string;           // Optional information message
  warningMessage?: string;        // Optional warning message
  errorMessage?: string;          // Optional error message
  sectionId: string;              // Unique ID for the section (for accessibility)
  className?: string;             // Optional additional CSS classes
}

/**
 * FormSection component
 * Provides a consistent layout for form sections across the application
 */
const FormSection = ({
  title,
  subtitle,
  children,
  helpText,
  infoMessage,
  warningMessage,
  errorMessage,
  sectionId,
  className = ''
}: FormSectionProps) => {
  const { t } = useTranslation();
  
  return (
    <section 
      id={sectionId}
      className={`gc-card mb-8 ${className}`}
      aria-labelledby={`${sectionId}-title`}
    >
      {/* Section header */}
      <div className="gc-card-header">
        <h2 
          id={`${sectionId}-title`}
          className="text-xl font-semibold mb-0"
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-gc-dark-text mt-1 mb-0">{subtitle}</p>
        )}
      </div>
      
      {/* Section body */}
      <div className="gc-card-body">
        {/* Help text */}
        {helpText && (
          <div className="text-sm text-gc-dark-text mb-4">
            <p>{helpText}</p>
          </div>
        )}
        
        {/* Information message */}
        {infoMessage && (
          <div className="gc-alert gc-alert-info mb-4">
            <p className="m-0">{infoMessage}</p>
          </div>
        )}
        
        {/* Warning message */}
        {warningMessage && (
          <div className="gc-alert gc-alert-warning mb-4">
            <p className="m-0">{warningMessage}</p>
          </div>
        )}
        
        {/* Error message */}
        {errorMessage && (
          <div className="gc-alert gc-alert-danger mb-4" role="alert">
            <p className="m-0 font-semibold">{t('error.label')}</p>
            <p className="m-0">{errorMessage}</p>
          </div>
        )}
        
        {/* Form content */}
        <div className="space-y-4">
          {children}
        </div>
      </div>
      
      {/* 
        Developer comments:
        - This component follows Canada.ca Web Experience Toolkit standards
        - It includes proper aria roles and labeling for accessibility
        - Messages use the standard GC alert styling  
        - The layout adapts to various content types
      */}
    </section>
  );
};

export default FormSection;
