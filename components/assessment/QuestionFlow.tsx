/**
 * @file QuestionFlow.tsx
 * @description Question flow component for the GC-RCP assessment
 * 
 * This component handles the rendering and progression through a series of questions
 * for the risk and compliance assessment, following Canada.ca UI standards.
 * It supports different question types, conditional rendering, and progress tracking.
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import FormSection from '@/components/forms/FormSection';
import QuestionRenderer from './QuestionRenderer';

// Types for question data
interface ChoiceOption {
  value: string;           // Value to be stored when selected
  label: string;           // Display label
  description?: string;    // Optional longer description
  flagValue?: number;      // Value used for flag calculations
  maturityValue?: number;  // Value used for maturity calculations
}

// Different question types supported by the assessment
type QuestionType = 'radio' | 'checkbox' | 'text' | 'textarea' | 'select';

// Definition of a single question
interface Question {
  id: string;              // Unique identifier for the question
  type: QuestionType;      // Type of question
  text: string;            // Question text
  guidance?: string;       // Guidance/help text
  required: boolean;       // Whether an answer is required
  options?: ChoiceOption[]; // Options for radio/checkbox/select questions
  conditionalId?: string;  // If this question depends on another question
  conditionalValue?: string | string[]; // Value(s) that trigger this question
  area: string;            // Assessment area this question belongs to
  flagIf?: string[];       // Values that will raise a flag
  flagText?: string;       // Text to display when flagged
}

// Structure for response to a question
interface QuestionResponse {
  questionId: string;      // ID of the question being answered
  value: string | string[]; // Answer value(s)
  timestamp: string;       // When the answer was provided
}

// Props for the QuestionFlow component
interface QuestionFlowProps {
  questions: Question[];             // All questions to be rendered
  initialResponses?: QuestionResponse[]; // Pre-existing answers (if any)
  currentArea: string;               // Current assessment area
  onSave: (responses: QuestionResponse[]) => void; // Save callback
  onComplete: (responses: QuestionResponse[]) => void; // Completion callback
}

/**
 * QuestionFlow Component
 * Renders a series of questions for a specific assessment area
 * and tracks user responses
 */
const QuestionFlow = ({
  questions,
  initialResponses = [],
  currentArea,
  onSave,
  onComplete
}: QuestionFlowProps) => {
  const { t, language } = useTranslation();
  
  // State for tracking responses
  const [responses, setResponses] = useState<QuestionResponse[]>(initialResponses);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [flags, setFlags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filter questions to only include those for the current area
  const areaQuestions = questions.filter(q => q.area === currentArea);
  
  // Calculate progress whenever responses change
  useEffect(() => {
    if (areaQuestions.length === 0) return;
    
    // Calculate how many required questions have been answered
    const answeredRequired = areaQuestions
      .filter(q => q.required && shouldRenderQuestion(q))
      .filter(q => responses.some(r => r.questionId === q.id))
      .length;
    
    // Count total required questions that should be displayed
    const totalRequired = areaQuestions
      .filter(q => q.required && shouldRenderQuestion(q))
      .length;
    
    // Update progress percentage
    setProgress(totalRequired > 0 ? (answeredRequired / totalRequired) * 100 : 0);
    
    // Check for flags
    updateFlags();
  }, [responses, areaQuestions]);
  
  /**
   * Determine if a question should be rendered based on conditional logic
   * @param question - The question to check
   * @returns boolean - Whether the question should be displayed
   */
  const shouldRenderQuestion = (question: Question): boolean => {
    // If no conditional logic, always show the question
    if (!question.conditionalId) return true;
    
    // Find the response to the conditioning question
    const conditioningResponse = responses.find(
      r => r.questionId === question.conditionalId
    );
    
    // If no response to the conditioning question, don't show
    if (!conditioningResponse) return false;
    
    // Check if the conditioning response matches any of the conditional values
    if (Array.isArray(question.conditionalValue)) {
      if (Array.isArray(conditioningResponse.value)) {
        // If both are arrays, check for any intersection
        return question.conditionalValue.some(v => 
          conditioningResponse.value.includes(v)
        );
      } else {
        // If conditioning response is a single value, check if it's in the conditional values
        return question.conditionalValue.includes(conditioningResponse.value as string);
      }
    } else if (Array.isArray(conditioningResponse.value)) {
      // If conditioning response is an array but conditional value is a single value
      return conditioningResponse.value.includes(question.conditionalValue as string);
    } else {
      // Both are single values, simple comparison
      return conditioningResponse.value === question.conditionalValue;
    }
  };
  
  /**
   * Update the list of flags based on current responses
   */
  const updateFlags = () => {
    const newFlags: string[] = [];
    
    // Check each question for flag conditions
    areaQuestions.forEach(question => {
      // Skip if no flag conditions or no response
      if (!question.flagIf) return;
      
      const response = responses.find(r => r.questionId === question.id);
      if (!response) return;
      
      // Check if the response value matches any flagging condition
      if (Array.isArray(response.value)) {
        // For multi-select questions
        const hasFlag = question.flagIf.some(flagValue => 
          response.value.includes(flagValue)
        );
        
        if (hasFlag) {
          newFlags.push(question.flagText || t('assessment.defaultFlag'));
        }
      } else {
        // For single-value questions
        if (question.flagIf.includes(response.value as string)) {
          newFlags.push(question.flagText || t('assessment.defaultFlag'));
        }
      }
    });
    
    setFlags(newFlags);
  };
  
  /**
   * Handle a response to a question
   * @param questionId - ID of the question being answered
   * @param value - Answer value
   */
  const handleResponse = (questionId: string, value: string | string[]) => {
    // Create a timestamp for the response
    const timestamp = new Date().toISOString();
    
    // Update or create the response
    setResponses(prev => {
      const existingIndex = prev.findIndex(r => r.questionId === questionId);
      
      if (existingIndex >= 0) {
        // Update existing response
        const updated = [...prev];
        updated[existingIndex] = { questionId, value, timestamp };
        return updated;
      } else {
        // Add new response
        return [...prev, { questionId, value, timestamp }];
      }
    });
  };
  
  /**
   * Move to the next question
   */
  const handleNext = () => {
    // Save current progress
    onSave(responses);
    
    // Move to next question if not at the end
    if (currentQuestionIndex < areaQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      
      // Scroll to top of question
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // All questions answered, mark as complete
      onComplete(responses);
    }
  };
  
  /**
   * Move to the previous question
   */
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      
      // Scroll to top of question
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  /**
   * Save current progress
   */
  const handleSave = () => {
    onSave(responses);
  };
  
  // Get the current question to display
  const currentQuestion = areaQuestions[currentQuestionIndex];
  
  // No questions for this area
  if (!currentQuestion) {
    return (
      <div className="text-center py-8">
        <p>{t('assessment.noQuestions')}</p>
      </div>
    );
  }
  
  // Get the response for the current question (if any)
  const currentResponse = responses.find(r => r.questionId === currentQuestion.id);
  
  return (
    <div className="question-flow">
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            {t('assessment.progress')}: {Math.round(progress)}%
          </span>
          <span className="text-sm">
            {t('assessment.question')} {currentQuestionIndex + 1} {t('assessment.of')} {areaQuestions.length}
          </span>
        </div>
        <div className="w-full bg-gc-light-grey rounded-full h-2.5">
          <div 
            className="bg-gc-blue h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Current question */}
      <FormSection
        title={`${t('assessment.question')} ${currentQuestionIndex + 1}`}
        subtitle={currentQuestion.text}
        sectionId={`question-${currentQuestion.id}`}
        helpText={currentQuestion.guidance}
      >
        {/* Render the appropriate question component based on type */}
        <QuestionRenderer 
          question={currentQuestion}
          value={currentResponse?.value}
          onChange={(value: string | string[]) => handleResponse(currentQuestion.id, value)}
          disabled={isSubmitting}
          className="mt-4"
        />
      </FormSection>
      
      {/* Flag warnings (if any) */}
      {flags.length > 0 && (
        <div className="gc-alert gc-alert-warning mb-6">
          <h3 className="font-bold mb-2">{t('assessment.flags')}</h3>
          <ul className="list-disc ml-5">
            {flags.map((flag, index) => (
              <li key={index}>{flag}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        <button
          className="gc-button-secondary"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          {t('common.back')}
        </button>
        
        <div className="flex space-x-3">
          <button
            className="gc-button-secondary"
            onClick={handleSave}
          >
            {t('common.save')}
          </button>
          
          <button
            className="gc-button"
            onClick={handleNext}
            disabled={currentQuestion.required && !currentResponse}
          >
            {currentQuestionIndex === areaQuestions.length - 1 
              ? t('assessment.complete') 
              : t('common.next')
            }
          </button>
        </div>
      </div>
      
      {/* 
        Developer comments:
        - This component follows Canada.ca UI standards for forms and progress indicators
        - It supports complex conditional question logic
        - Features include auto-saving, progress tracking, and flag detection
        - Accessibility features like clear labeling and keyboard navigation
        - In a real implementation, each question type would be a separate component
      */}
    </div>
  );
};

export default QuestionFlow;
