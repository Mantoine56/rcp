/**
 * @file FormDateInput.tsx
 * @description Date input component based on GC Design System specifications
 * 
 * This component implements the official GC Design System date input
 * with full and compact format options, proper validation, and accessibility features.
 * Follows specifications at: https://design-system.alpha.canada.ca/en/components/date-input/code/
 */

'use client';

import { forwardRef, useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';

// Props interface for the FormDateInput component
interface FormDateInputProps {
  id: string;                     // Unique ID for the input element
  label: string;                  // Label text for the date input
  hint?: string;                  // Optional hint text for additional guidance
  required?: boolean;             // Whether the field is required
  error?: string;                 // Error message if validation fails
  format?: 'full' | 'compact';    // Date format: full (YYYY-MM-DD) or compact (YYYY-MM)
  value?: string;                 // Initial value in YYYY-MM-DD or YYYY-MM format
  onChange?: (value: string) => void; // Callback when date changes
  className?: string;             // Additional CSS classes
  disabled?: boolean;             // Whether the input is disabled
}

/**
 * FormDateInput component
 * Implements the GC Design System date input component
 */
const FormDateInput = forwardRef<HTMLDivElement, FormDateInputProps>(({
  id,
  label,
  hint,
  required = false,
  error,
  format = 'full',
  value = '',
  onChange,
  className = '',
  disabled = false
}, ref) => {
  const { t, language } = useTranslation();
  
  // Parse the initial value into year, month, day
  const [dateValues, setDateValues] = useState(() => {
    // Default to empty values
    const defaultValues = { year: '', month: '', day: '' };
    
    // If value is provided, parse it
    if (value) {
      const parts = value.split('-');
      if (parts.length >= 2) {
        defaultValues.year = parts[0] || '';
        defaultValues.month = parts[1] || '';
        
        if (format === 'full' && parts.length >= 3) {
          defaultValues.day = parts[2] || '';
        }
      }
    }
    
    return defaultValues;
  });
  
  // When values change, update the combined value and call onChange
  useEffect(() => {
    if (onChange) {
      let dateString = '';
      
      if (format === 'full') {
        // Only create a date string if we have all required parts
        if (dateValues.year && dateValues.month && dateValues.day) {
          dateString = `${dateValues.year}-${dateValues.month}-${dateValues.day}`;
        }
      } else {
        // For compact format, only year and month are required
        if (dateValues.year && dateValues.month) {
          dateString = `${dateValues.year}-${dateValues.month}`;
        }
      }
      
      onChange(dateString);
    }
  }, [dateValues, format, onChange]);
  
  // Handle changes to individual date parts
  const handlePartChange = (part: 'year' | 'month' | 'day', value: string) => {
    setDateValues(prev => ({
      ...prev,
      [part]: value
    }));
  };
  
  // Create field IDs
  const yearId = `${id}-year`;
  const monthId = `${id}-month`;
  const dayId = `${id}-day`;
  
  // Error ID for aria-describedby
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;
  
  // Field order based on language
  const showDayFirst = language === 'fr';
  
  return (
    <div ref={ref} className={`gc-date-input mb-4 ${className}`}>
      {/* Fieldset with legend */}
      <fieldset 
        className={`border-0 p-0 m-0 ${error ? 'gc-date-input--error' : ''}`} 
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ')}
      >
        {/* Label matches the style and spacing of other form components */}
        <legend className="block text-sm font-medium mb-1">
          {label}
          {required && <span className="text-[#B10E1E] ml-1" aria-hidden="true">*</span>}
          {required && <span className="sr-only"> ({t('form.required')})</span>}
        </legend>
        
        {/* Hint text - matches FormInput and FormSelect hint style */}
        {hint && (
          <div id={hintId} className="text-sm text-[#5C5C5C] mb-1">
            {hint}
          </div>
        )}
        
        {/* Error message - matches FormInput and FormSelect error style */}
        {error && (
          <div 
            id={errorId} 
            className="text-sm text-[#B10E1E] font-medium mb-2"
            aria-live="polite"
          >
            <span className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-4 h-4 mr-1"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" />
              </svg>
              {error}
            </span>
          </div>
        )}
        
        {/* Date fields container with consistent spacing */}
        <div className="flex flex-wrap gap-2 mt-1">
          {/* Render fields in the appropriate order based on language */}
          {showDayFirst && format === 'full' && (
            <div className="w-20">
              <label htmlFor={dayId} className="block text-sm font-medium mb-1">{t('date.day')}</label>
              <input
                id={dayId}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={2}
                placeholder="DD"
                className={`block w-full px-3 py-2 text-base border rounded-md 
                  ${error ? 'border-[#B10E1E]' : 'border-[#cccccc]'} 
                  focus:outline-none focus:ring-2 focus:ring-[#26374A] focus:border-[#26374A]`}
                value={dateValues.day}
                onChange={(e) => handlePartChange('day', e.target.value)}
                disabled={disabled}
                aria-invalid={!!error}
                aria-describedby={[hintId, errorId].filter(Boolean).join(' ')}
              />
            </div>
          )}
          
          {/* Month field */}
          <div className="w-20">
            <label htmlFor={monthId} className="block text-sm font-medium mb-1">{t('date.month')}</label>
            <input
              id={monthId}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={2}
              placeholder="MM"
              className={`block w-full px-3 py-2 text-base border rounded-md 
                ${error ? 'border-[#B10E1E]' : 'border-[#cccccc]'} 
                focus:outline-none focus:ring-2 focus:ring-[#26374A] focus:border-[#26374A]`}
              value={dateValues.month}
              onChange={(e) => handlePartChange('month', e.target.value)}
              disabled={disabled}
              aria-invalid={!!error}
              aria-describedby={[hintId, errorId].filter(Boolean).join(' ')}
            />
          </div>
          
          {/* Day field (rendered here for English) */}
          {!showDayFirst && format === 'full' && (
            <div className="w-20">
              <label htmlFor={dayId} className="block text-sm font-medium mb-1">{t('date.day')}</label>
              <input
                id={dayId}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={2}
                placeholder="DD"
                className={`block w-full px-3 py-2 text-base border rounded-md 
                  ${error ? 'border-[#B10E1E]' : 'border-[#cccccc]'} 
                  focus:outline-none focus:ring-2 focus:ring-[#26374A] focus:border-[#26374A]`}
                value={dateValues.day}
                onChange={(e) => handlePartChange('day', e.target.value)}
                disabled={disabled}
                aria-invalid={!!error}
                aria-describedby={[hintId, errorId].filter(Boolean).join(' ')}
              />
            </div>
          )}
          
          {/* Year field - always present */}
          <div className="w-24">
            <label htmlFor={yearId} className="block text-sm font-medium mb-1">{t('date.year')}</label>
            <input
              id={yearId}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              placeholder="YYYY"
              className={`block w-full px-3 py-2 text-base border rounded-md 
                ${error ? 'border-[#B10E1E]' : 'border-[#cccccc]'} 
                focus:outline-none focus:ring-2 focus:ring-[#26374A] focus:border-[#26374A]`}
              value={dateValues.year}
              onChange={(e) => handlePartChange('year', e.target.value)}
              disabled={disabled}
              aria-invalid={!!error}
              aria-describedby={[hintId, errorId].filter(Boolean).join(' ')}
            />
          </div>
          
          {/* When in compact mode, add a visual representation of the format */}
          {format === 'compact' && (
            <div className="flex items-end mb-1 text-sm text-gray-500">
              <span className="mb-2 ml-1">({t('date.format.compact')})</span>
            </div>
          )}
        </div>
      </fieldset>
    </div>
  );
});

FormDateInput.displayName = 'FormDateInput';

export default FormDateInput;
