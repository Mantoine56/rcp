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
import { QuestionType } from '@/lib/questions';
import { AssessmentQuestion } from '@/lib/questionBank';
import { Assignment, User, userStore } from '@/lib/assignments';

/**
 * Extended options to support both our simple string options and
 * the more complex QuestionOption format from the original component
 */
type ExtendedOption = string | {
  value: string;
  label: string;
  description?: string;
  flagValue?: number;
  maturityValue?: number;
};

// Props for the QuestionRenderer component
interface QuestionRendererProps {
  question: AssessmentQuestion;
  value?: string | string[];
  onChange: (id: string, value: any) => void;
  disabled?: boolean;
  className?: string;
  assignment?: Assignment | null;
}

/**
 * QuestionRenderer Component
 * Decides which question component to render based on the question type
 */
function QuestionRenderer({
  question,
  value,
  onChange,
  disabled = false,
  className = '',
  assignment = null
}: QuestionRendererProps) {
  const { t } = useTranslation();
  
  // Format options to match the expected format for the sub-components
  const formatOptions = (options?: string[]) => {
    if (!options) return [];
    
    return options.map(option => ({
      value: option,
      label: option
    }));
  };
  
  // Get assignee information
  const getAssigneeInfo = () => {
    if (!assignment) return null;
    
    const assignee = userStore.getUserByEmail(assignment.assignee);
    if (!assignee) return assignment.assignee;
    
    return assignee.name;
  };
  
  // Determine which question component to render based on type
  const renderQuestionByType = () => {
    switch (question.type) {
      case 'radio':
        return (
          <RadioQuestion
            id={question.id}
            options={formatOptions(question.options)}
            value={value as string}
            onChange={(value) => onChange(question.id, value)}
            required={question.required}
            disabled={disabled}
            // Add the question text and guidance as a wrapper for accessibility
            aria-label={`${question.number}. ${question.text}`}
          />
        );
        
      case 'checkbox':
        return (
          <CheckboxQuestion
            id={question.id}
            options={formatOptions(question.options)}
            value={Array.isArray(value) ? value : []}
            onChange={(values) => onChange(question.id, values)}
            required={question.required}
            disabled={disabled}
            // Add the question text and guidance as a wrapper for accessibility
            aria-label={`${question.number}. ${question.text}`}
          />
        );
        
      case 'text':
      case 'textarea':
        return (
          <div>
            {/* Add question text and guidance manually */}
            <div className="mb-2">
              <h3 className="font-semibold text-lg">{question.number}. {question.text}</h3>
              {question.guidance && (
                <p className="text-sm text-gray-600 mt-1">{question.guidance}</p>
              )}
            </div>
            <TextQuestion
              id={question.id}
              value={value as string || ''}
              onChange={(value) => onChange(question.id, value)}
              required={question.required}
              multiline={question.type === 'textarea'}
              disabled={disabled}
              hint={question.guidance}
            />
          </div>
        );
        
      case 'select':
        // Fallback to text input if select is not implemented
        return (
          <div>
            {/* Add question text and guidance manually */}
            <div className="mb-2">
              <h3 className="font-semibold text-lg">{question.number}. {question.text}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {question.guidance || t('Select not implemented, using text input instead')}
              </p>
            </div>
            <TextQuestion
              id={question.id}
              value={value as string || ''}
              onChange={(value) => onChange(question.id, value)}
              required={question.required}
              disabled={disabled}
              hint={question.guidance}
            />
          </div>
        );
        
      default:
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800">
              {t('Unknown question type')}: {question.type}
            </p>
          </div>
        );
    }
  };
  
  return (
    <div className={`mb-8 ${className}`}>
      {renderQuestionByType()}
      
      {/* Show assignment information if assigned */}
      {assignment && (
        <div className="mt-4 text-sm text-gray-600">
          <span className="font-semibold">Assigned to:</span> {getAssigneeInfo()}
        </div>
      )}
    </div>
  );
};

export default QuestionRenderer;
