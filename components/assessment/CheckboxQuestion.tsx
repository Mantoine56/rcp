/**
 * @file CheckboxQuestion.tsx
 * @description Checkbox question component for assessments
 * 
 * This component renders a checkbox group question type following Canada.ca UI standards
 * with proper accessibility and bilingual support. It allows users to select multiple
 * options for a single question.
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';

// Types for checkbox question options
interface CheckboxOption {
  value: string;           // Value to be stored when selected
  label: string;           // Display label
  description?: string;    // Optional longer description
  flagValue?: number;      // Value used for flag calculations
  maturityValue?: number;  // Value used for maturity calculations
}

// Props for the CheckboxQuestion component
interface CheckboxQuestionProps {
  id: string;                                // Question ID (for form control)
  options: CheckboxOption[];                 // List of checkbox options
  value?: string[];                          // Currently selected values (if any)
  required?: boolean;                        // Is this question required?
  onChange: (values: string[]) => void;      // Callback when selection changes
  name?: string;                             // Optional name for the checkbox group
  disabled?: boolean;                        // Is the question disabled?
  minSelections?: number;                    // Minimum number of selections required
  maxSelections?: number;                    // Maximum number of selections allowed
}

/**
 * CheckboxQuestion Component
 * Renders a checkbox group for assessment questions
 */
const CheckboxQuestion = ({
  id,
  options,
  value = [],
  required = false,
  onChange,
  name = id,
  disabled = false,
  minSelections = required ? 1 : 0,
  maxSelections
}: CheckboxQuestionProps) => {
  const { t } = useTranslation();
  const [selectedValues, setSelectedValues] = useState<string[]>(value);
  
  // Update local state when value prop changes
  useEffect(() => {
    setSelectedValues(value);
  }, [value]);
  
  /**
   * Handle checkbox selection change
   * @param checkboxValue - The value of the checkbox being toggled
   * @param isChecked - Whether the checkbox is being checked or unchecked
   */
  const handleChange = (checkboxValue: string, isChecked: boolean) => {
    let newValues: string[];
    
    if (isChecked) {
      // Add the value to the selected values
      newValues = [...selectedValues, checkboxValue];
      
      // If max selections is defined and exceeded, remove the earliest selection
      if (maxSelections !== undefined && newValues.length > maxSelections) {
        newValues.shift(); // Remove the first item
      }
    } else {
      // Remove the value from selected values
      newValues = selectedValues.filter(val => val !== checkboxValue);
    }
    
    setSelectedValues(newValues);
    onChange(newValues);
  };
  
  /**
   * Check if the option can be selected based on current selection state
   * @param optionValue - The value to check
   * @returns boolean - Whether the option can be selected
   */
  const canSelect = (optionValue: string): boolean => {
    if (disabled) return false;
    
    const isCurrentlySelected = selectedValues.includes(optionValue);
    
    // If already selected, always allow unselecting
    if (isCurrentlySelected) return true;
    
    // If max selections defined and reached, prevent additional selections
    if (maxSelections !== undefined && selectedValues.length >= maxSelections) {
      return false;
    }
    
    return true;
  };
  
  // Determine if the required criteria have been met
  const requiredMet = !required || (minSelections > 0 && selectedValues.length >= minSelections);
  
  return (
    <fieldset className="gc-fieldset" aria-required={required}>
      <legend className="sr-only">
        {minSelections > 0 
          ? t('form.selectAtLeast', { count: minSelections.toString() })
          : t('form.selectMultiple')
        }
      </legend>
      
      {/* Selection counter (if applicable) */}
      {(minSelections > 0 || maxSelections !== undefined) && (
        <div className="text-sm mb-3 text-gc-dark-text">
          {t('form.selected', { count: selectedValues.length.toString() })}
          {maxSelections !== undefined && (
            <span> {t('form.maxAllowed', { count: maxSelections.toString() })}</span>
          )}
        </div>
      )}
      
      <div className="space-y-3" role="group">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          const canSelectOption = canSelect(option.value);
          
          return (
            <div 
              key={option.value}
              className={`border rounded transition-colors p-4 ${
                isSelected
                  ? 'border-gc-blue bg-gc-highlight'
                  : canSelectOption
                    ? 'border-gc-border hover:bg-gc-light-grey'
                    : 'border-gc-border opacity-60 cursor-not-allowed'
              }`}
            >
              <label className="flex items-start cursor-pointer">
                <div className="flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    id={`${id}-${option.value}`}
                    name={name}
                    value={option.value}
                    checked={isSelected}
                    onChange={(e) => handleChange(option.value, e.target.checked)}
                    className="gc-checkbox"
                    disabled={disabled || (!isSelected && !canSelectOption)}
                    required={required && selectedValues.length === 0}
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
          );
        })}
      </div>
      
      {/* Required indicator (visual feedback) */}
      {required && !requiredMet && (
        <div className="text-gc-danger text-sm mt-2">
          {t('form.selectionRequired', { count: minSelections.toString() })}
        </div>
      )}
      
      {/* 
        Developer comments:
        - This component follows Canada.ca UI standards for checkbox inputs
        - Provides visual indication of selected state
        - Handles complex selection rules (min/max selections)
        - Full keyboard accessibility support
        - Proper use of fieldset and legend for screen readers
        - Clear validation feedback
      */}
    </fieldset>
  );
};

export default CheckboxQuestion;
