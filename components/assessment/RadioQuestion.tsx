/**
 * @file RadioQuestion.tsx
 * @description Radio button question component for assessments
 * 
 * This component renders a radio button question type following Canada.ca UI standards
 * with proper accessibility and bilingual support. It's used within the QuestionFlow
 * component to handle radio-type questions.
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';

// Types for radio question options
interface RadioOption {
  value: string;           // Value to be stored when selected
  label: string;           // Display label
  description?: string;    // Optional longer description
  flagValue?: number;      // Value used for flag calculations
  maturityValue?: number;  // Value used for maturity calculations
}

// Props for the RadioQuestion component
interface RadioQuestionProps {
  id: string;                         // Question ID (for form control)
  options: RadioOption[];             // List of radio options
  value?: string;                     // Current selected value (if any)
  required?: boolean;                 // Is this question required?
  onChange: (value: string) => void;  // Callback when selection changes
  name?: string;                      // Optional name for the radio group
  disabled?: boolean;                 // Is the question disabled?
}

/**
 * RadioQuestion Component
 * Renders a radio button group for assessment questions
 */
const RadioQuestion = ({
  id,
  options,
  value,
  required = false,
  onChange,
  name = id,
  disabled = false
}: RadioQuestionProps) => {
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value);
  
  // Update local state when value prop changes
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);
  
  /**
   * Handle radio selection change
   * @param newValue - The newly selected value
   */
  const handleChange = (newValue: string) => {
    setSelectedValue(newValue);
    onChange(newValue);
  };
  
  return (
    <fieldset className="gc-fieldset" aria-required={required}>
      <legend className="sr-only">{t('form.selectOne')}</legend>
      
      <div className="space-y-3" role="radiogroup">
        {options.map((option) => (
          <div 
            key={option.value}
            className={`border rounded transition-colors p-4 ${
              selectedValue === option.value
                ? 'border-gc-blue bg-gc-highlight'
                : 'border-gc-border hover:bg-gc-light-grey'
            }`}
          >
            <label className="flex items-start cursor-pointer">
              <div className="flex-shrink-0 mt-0.5">
                <input
                  type="radio"
                  id={`${id}-${option.value}`}
                  name={name}
                  value={option.value}
                  checked={selectedValue === option.value}
                  onChange={() => handleChange(option.value)}
                  className="gc-radio"
                  disabled={disabled}
                  required={required}
                  aria-describedby={option.description ? `${id}-${option.value}-desc` : undefined}
                />
              </div>
              
              <div className="ml-3 flex-grow">
                <span className="font-medium block">
                  {option.label}
                </span>
                
                {/* Optional description */}
                {option.description && (
                  <span 
                    id={`${id}-${option.value}-desc`}
                    className="text-sm text-gc-dark-text block mt-1"
                  >
                    {option.description}
                  </span>
                )}
              </div>
            </label>
          </div>
        ))}
      </div>
      
      {/* 
        Developer comments:
        - This component follows Canada.ca UI standards for radio inputs
        - Enhanced styling for better visual indication of selected state
        - Full keyboard accessibility support
        - Proper use of fieldset and legend for screen readers
        - Descriptions tied to inputs via aria-describedby
      */}
    </fieldset>
  );
};

export default RadioQuestion;
