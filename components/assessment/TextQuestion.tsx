/**
 * @file TextQuestion.tsx
 * @description Text input question component for assessments
 * 
 * This component renders a text input or textarea question type following Canada.ca UI standards
 * with proper accessibility and bilingual support. It handles both single-line and multi-line
 * text responses for the assessment.
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import FormInput from '@/components/forms/FormInput';

// Props for the TextQuestion component
interface TextQuestionProps {
  id: string;                         // Question ID (for form control)
  value?: string;                     // Current text value (if any)
  required?: boolean;                 // Is this question required?
  onChange: (value: string) => void;  // Callback when text changes
  placeholder?: string;               // Optional placeholder text
  multiline?: boolean;                // Whether to use textarea (true) or input (false)
  rows?: number;                      // Number of rows for textarea
  maxLength?: number;                 // Maximum length of text
  minLength?: number;                 // Minimum length of text
  disabled?: boolean;                 // Is the question disabled?
  label?: string;                     // Optional visible label (separate from question text)
  hint?: string;                      // Additional hint text
  autoSave?: boolean;                 // Whether to automatically save on blur
}

/**
 * TextQuestion Component
 * Renders a text input or textarea for assessment questions
 */
const TextQuestion = ({
  id,
  value = '',
  required = false,
  onChange,
  placeholder,
  multiline = false,
  rows = 4,
  maxLength,
  minLength,
  disabled = false,
  label,
  hint,
  autoSave = true
}: TextQuestionProps) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState<string>(value);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  
  // Update local state when value prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  /**
   * Validate the current input value
   * @returns boolean - True if valid, false otherwise
   */
  const validate = (): boolean => {
    // Required validation
    if (required && !inputValue.trim()) {
      setError(t('error.required'));
      return false;
    }
    
    // Min length validation
    if (minLength && inputValue.length < minLength) {
      setError(t('form.tooShort', { count: minLength.toString() }));
      return false;
    }
    
    // Clear any errors if valid
    setError(undefined);
    return true;
  };
  
  /**
   * Handle input change
   * @param e - Change event from input/textarea
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsDirty(true);
    
    // If we are showing an error, validate as the user types to remove error once fixed
    if (error) {
      validate();
    }
  };
  
  /**
   * Handle blur event (when input loses focus)
   */
  const handleBlur = () => {
    // Always validate on blur
    const isValid = validate();
    
    // Only save if the input is dirty, valid, and autoSave is enabled
    if (isDirty && isValid && autoSave) {
      onChange(inputValue);
      setIsDirty(false);
    }
  };
  
  /**
   * Handle submit/enter key
   * @param e - Keyboard event
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // For single-line inputs, save on Enter key
    if (!multiline && e.key === 'Enter') {
      // Validate first
      const isValid = validate();
      
      // Only save if valid
      if (isValid) {
        onChange(inputValue);
        setIsDirty(false);
      }
    }
  };
  
  // Common props for both input and textarea
  const commonProps = {
    id,
    value: inputValue,
    onChange: handleChange,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
    placeholder,
    disabled,
    required,
    maxLength,
    'aria-invalid': !!error,
    'aria-describedby': hint ? `${id}-hint` : undefined,
    className: `gc-input ${error ? 'border-gc-danger' : ''}`,
  };
  
  return (
    <div className="gc-form-group">
      {/* Label */}
      {label && (
        <label htmlFor={id} className="gc-label mb-2 block">
          {label}
          {required && <span className="text-gc-danger ml-1">*</span>}
        </label>
      )}
      
      {/* Hint text */}
      {hint && (
        <div id={`${id}-hint`} className="text-sm text-gc-dark-text mb-2">
          {hint}
        </div>
      )}
      
      {/* Input or Textarea */}
      {multiline ? (
        <textarea
          {...commonProps}
          rows={rows}
          className={`${commonProps.className} w-full`}
        />
      ) : (
        <input
          type="text"
          {...commonProps}
          className={`${commonProps.className} w-full`}
        />
      )}
      
      {/* Character counter (if max length defined) */}
      {maxLength && (
        <div className={`text-xs text-right mt-1 ${
          inputValue.length > maxLength * 0.9 ? 'text-gc-warning' : 'text-gc-dark-text'
        }`}>
          {inputValue.length}/{maxLength}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="text-gc-danger text-sm mt-2" role="alert">
          {error}
        </div>
      )}
      
      {/* 
        Developer comments:
        - This component follows Canada.ca UI standards for text inputs
        - Handles both single-line and multi-line text inputs
        - Provides real-time validation
        - Includes character counter for inputs with max length
        - Auto-save functionality when focus is lost
        - Proper accessibility attributes for validation and relationships
        - Clear error feedback
      */}
    </div>
  );
};

export default TextQuestion;
