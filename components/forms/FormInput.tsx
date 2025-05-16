/**
 * @file FormInput.tsx
 * @description Standardized form input component following Canada.ca UI standards
 * 
 * This component provides consistent form inputs with appropriate
 * validation, error handling, and accessibility features.
 */

'use client';

import { forwardRef, useState } from 'react';
import { useTranslation } from '@/lib/i18n';

// Props interface for the FormInput component
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;                      // Input label text
  id: string;                         // Unique ID for the input element
  error?: string;                     // Error message if validation fails
  hint?: string;                      // Optional hint text for additional guidance
  required?: boolean;                 // Whether the field is required
  inlineLabel?: boolean;              // Whether to display the label inline with input
  maxLength?: number;                 // Maximum length for input
  showCharacterCount?: boolean;       // Whether to show character count
  labelClassName?: string;            // Additional CSS classes for the label
  hideLabel?: boolean;                // Option to visually hide the label (still accessible)
}

/**
 * FormInput component
 * Standardized input element following Canada.ca UI guidelines
 */
const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
  label,
  id,
  error,
  hint,
  required = false,
  inlineLabel = false,
  maxLength,
  showCharacterCount = false,
  labelClassName = '',
  hideLabel = false,
  className = '',
  onChange,
  value = '',
  ...props
}, ref) => {
  const { t } = useTranslation();
  const [charCount, setCharCount] = useState<number>(value?.toString().length || 0);
  
  // Handle input changes and update character count if needed
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (showCharacterCount) {
      setCharCount(e.target.value.length);
    }
    
    if (onChange) {
      onChange(e);
    }
  };
  
  // Determine input class based on validation state
  const inputClassName = `block w-full px-3 py-2 text-base border rounded-md outline-none
    ${error ? 'border-[#B10E1E] focus:border-[#B10E1E] focus:ring-[#B10E1E]' : 'border-[#cccccc] focus:border-[#26374A] focus:ring-[#26374A]'} 
    focus:outline-none focus:ring-2 ${className}`;
  
  // Determine if we should show the character count
  const shouldShowCharCount = showCharacterCount && maxLength;
  
  return (
    <div className={`gc-form-group ${inlineLabel ? 'sm:flex sm:items-center' : ''}`}>
      {/* Label */}
      <label 
        htmlFor={id}
        className={`gc-label ${inlineLabel ? 'sm:w-1/3 sm:mb-0 sm:mr-4' : ''} ${hideLabel ? 'sr-only' : ''} ${labelClassName}`}
      >
        {label}
        {required && <span className="text-gc-danger ml-1" aria-hidden="true">*</span>}
        {required && <span className="sr-only"> ({t('form.required')})</span>}
      </label>
      
      <div className={`${inlineLabel ? 'sm:w-2/3' : ''}`}>
        {/* Hint text */}
        {hint && (
          <div id={`${id}-hint`} className="text-sm text-gc-dark-text mb-1">
            {hint}
          </div>
        )}
        
        {/* Input element */}
        <div className="relative">
          <input
            id={id}
            ref={ref}
            className={inputClassName}
            aria-invalid={!!error}
            aria-describedby={`${hint ? `${id}-hint` : ''} ${error ? `${id}-error` : ''} ${shouldShowCharCount ? `${id}-count` : ''}`}
            aria-required={required}
            onChange={handleChange}
            value={value}
            maxLength={maxLength}
            {...props}
          />
          
          {/* Character counter */}
          {shouldShowCharCount && (
            <div 
              id={`${id}-count`} 
              className={`text-xs text-right mt-1 ${charCount > (maxLength as number) * 0.9 ? 'text-gc-warning' : 'text-gc-dark-text'}`}
              aria-live="polite"
            >
              {charCount}/{maxLength}
            </div>
          )}
        </div>
        
        {/* Error message */}
        {error && (
          <div 
            id={`${id}-error`} 
            className="text-gc-danger text-sm mt-1" 
            aria-live="polite"
          >
            {error}
          </div>
        )}
      </div>
      
      {/* 
        Developer comments:
        - This component follows Canada.ca Web Experience Toolkit standards
        - Features full accessibility support with aria attributes
        - Supports multiple layouts (stacked or inline)
        - Includes validation states and feedback
        - Character counter with visual feedback
      */}
    </div>
  );
});

// Set display name for debugging
FormInput.displayName = 'FormInput';

export default FormInput;
