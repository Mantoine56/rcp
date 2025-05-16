/**
 * @file QuestionRenderer.tsx
 * @description Component that renders the appropriate question type based on question data
 * 
 * This component serves as a factory for rendering different question types in the
 * assessment flow. It selects the appropriate question component based on the question type
 * and handles passing props correctly.
 */

'use client';

import { ReactNode } from 'react';
import RadioQuestion from './RadioQuestion';
import CheckboxQuestion from './CheckboxQuestion';
import TextQuestion from './TextQuestion';
import { useTranslation } from '@/lib/i18n';

// Types for question options
interface QuestionOption {
  value: string;
  label: string;
  description?: string;
  flagValue?: number;
  maturityValue?: number;
}

// Types of questions supported
type QuestionType = 'radio' | 'checkbox' | 'text' | 'textarea' | 'select';

// Base question interface
interface Question {
  id: string;
  type: QuestionType;
  text: string;
  guidance?: string;
  required: boolean;
  options?: QuestionOption[];
  minSelections?: number;
  maxSelections?: number;
  maxLength?: number;
  minLength?: number;
  placeholder?: string;
  area: string;
  flagIf?: string[];
  flagText?: string;
}

// Props for the QuestionRenderer component
interface QuestionRendererProps {
  question: Question;
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * QuestionRenderer Component
 * Decides which question component to render based on the question type
 */
const QuestionRenderer = ({
  question,
  value,
  onChange,
  disabled = false,
  className = ''
}: QuestionRendererProps) => {
  const { t } = useTranslation();
  
  /**
   * Renders the appropriate question component based on question type
   * @returns ReactNode with the rendered question component
   */
  const renderQuestionByType = (): ReactNode => {
    // Extract common props for all question types
    const commonProps = {
      id: question.id,
      required: question.required,
      disabled
    };
    
    switch (question.type) {
      case 'radio':
        // For radio buttons, we need options and single value handling
        if (!question.options?.length) {
          return <div className="text-gc-danger">{t('assessment.missingOptions')}</div>;
        }
        
        return (
          <RadioQuestion
            {...commonProps}
            options={question.options}
            value={value as string}
            onChange={(newValue: string) => onChange(newValue)}
          />
        );
        
      case 'checkbox':
        // For checkboxes, we need options and multi-value handling
        if (!question.options?.length) {
          return <div className="text-gc-danger">{t('assessment.missingOptions')}</div>;
        }
        
        return (
          <CheckboxQuestion
            {...commonProps}
            options={question.options}
            value={value as string[]}
            onChange={(newValues: string[]) => onChange(newValues)}
            minSelections={question.minSelections}
            maxSelections={question.maxSelections}
          />
        );
        
      case 'textarea':
        // For textarea, handle a text area with multiple rows
        return (
          <TextQuestion
            {...commonProps}
            value={value as string}
            onChange={(newValue: string) => onChange(newValue)}
            multiline={true}
            maxLength={question.maxLength}
            minLength={question.minLength}
            placeholder={question.placeholder}
            hint={question.guidance}
          />
        );
        
      case 'text':
        // For text input, handle a single line of text
        return (
          <TextQuestion
            {...commonProps}
            value={value as string}
            onChange={(newValue: string) => onChange(newValue)}
            multiline={false}
            maxLength={question.maxLength}
            minLength={question.minLength}
            placeholder={question.placeholder}
            hint={question.guidance}
          />
        );
        
      case 'select':
        // For select, we need options and single value handling
        // NOTE: Currently rendering as radio buttons until a Select component is created
        if (!question.options?.length) {
          return <div className="text-gc-danger">{t('assessment.missingOptions')}</div>;
        }
        
        return (
          <RadioQuestion
            {...commonProps}
            options={question.options}
            value={value as string}
            onChange={(newValue: string) => onChange(newValue)}
          />
        );
        
      default:
        // Fallback for unknown question types
        return (
          <div className="text-gc-danger">
            {t('assessment.unsupportedQuestionType', { type: question.type })}
          </div>
        );
    }
  };
  
  return (
    <div className={`question-renderer ${className}`}>
      {renderQuestionByType()}
      
      {/* 
        Developer comments:
        - This component serves as a factory for question rendering
        - It intelligently selects the appropriate component based on question type
        - Handles all the prop transformations necessary for each component
        - Provides fallbacks and error states for edge cases
        - Follows Canada.ca UI standards across all question types
      */}
    </div>
  );
};

export default QuestionRenderer;
