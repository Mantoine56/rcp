/**
 * @file FormSelect.tsx
 * @description Standardized form select component following Canada.ca UI standards
 * 
 * This component provides consistent dropdown selects with appropriate
 * validation, error handling, and accessibility features following
 * GC Design System standards.
 */

'use client';

import { forwardRef } from 'react';
import { useTranslation } from '@/lib/i18n';

// Props interface for the FormSelect component
interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;                      // Select label text
  id: string;                         // Unique ID for the select element
  error?: string;                     // Error message if validation fails
  hint?: string;                      // Optional hint text for additional guidance
  required?: boolean;                 // Whether the field is required
  inlineLabel?: boolean;              // Whether to display the label inline with select
  labelClassName?: string;            // Additional CSS classes for the label
  hideLabel?: boolean;                // Option to visually hide the label (still accessible)
  options: { value: string; label: string }[]; // Options for the select dropdown
  emptyOption?: string;               // Text for empty option (e.g., "Please select...")
}

/**
 * FormSelect component
 * Standardized select element following Canada.ca UI guidelines
 */
const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(({
  label,
  id,
  error,
  hint,
  required = false,
  inlineLabel = false,
  labelClassName = '',
  hideLabel = false,
  className = '',
  options = [],
  emptyOption,
  ...props
}, ref) => {
  const { t } = useTranslation();
  
  // Determine select class based on validation state with appearance:none to prevent browser default arrow
  const selectClassName = `block w-full px-3 py-2 text-base border rounded-md outline-none 
    ${error ? 'border-[#B10E1E] focus:border-[#B10E1E] focus:ring-[#B10E1E]' : 'border-[#cccccc] focus:border-[#26374A] focus:ring-[#26374A]'} 
    focus:outline-none focus:ring-2 appearance-none ${className}`;
  
  return (
    <div className={`mb-4 ${inlineLabel ? 'sm:flex sm:items-center' : ''}`}>
      {/* Label */}
      <label 
        htmlFor={id}
        className={`block text-sm font-medium mb-1 
          ${inlineLabel ? 'sm:w-1/3 sm:mb-0 sm:mr-4' : ''} 
          ${hideLabel ? 'sr-only' : ''} 
          ${labelClassName}`}
      >
        {label}
        {required && <span className="text-[#B10E1E] ml-1" aria-hidden="true">*</span>}
        {required && <span className="sr-only"> ({t('form.required')})</span>}
      </label>
      
      <div className={`${inlineLabel ? 'sm:w-2/3' : ''}`}>
        {/* Hint text */}
        {hint && (
          <div id={`${id}-hint`} className="text-sm text-[#5C5C5C] mb-1">
            {hint}
          </div>
        )}
        
        {/* Select element */}
        <div className="relative">
          <select
            id={id}
            ref={ref}
            className={selectClassName}
            aria-invalid={!!error}
            aria-describedby={`${hint ? `${id}-hint` : ''} ${error ? `${id}-error` : ''}`}
            aria-required={required}
            {...props}
          >
            {/* Empty option if provided */}
            {emptyOption && (
              <option value="">{emptyOption}</option>
            )}
            
            {/* Render options from props */}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Custom dropdown icon (SVG triangle) */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div id={`${id}-error`} className="text-sm text-[#B10E1E] mt-1" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
});

FormSelect.displayName = 'FormSelect';

export default FormSelect;
