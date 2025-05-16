/**
 * @file app/assessment/[id]/questions/page.tsx
 * @description Assessment questions page
 * 
 * This page renders the assessment questions for a specific area, following
 * Canada.ca UI standards. It handles loading questions by area, saving responses,
 * and navigating between areas.
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

// Import assessment components and question data
import QuestionFlow from '@/components/assessment/QuestionFlow';
import { 
  assessmentQuestions, 
  getQuestionsByArea, 
  getAssessmentAreas,
  AssessmentArea
} from '@/lib/questions';

// Interface for response data
interface QuestionResponse {
  questionId: string;
  value: string | string[];
  timestamp: string;
}

// Interface for assessment data
interface Assessment {
  id: string;
  departmentName: string;
  departmentAcronym: string;
  fiscalYear: string;
  responses: QuestionResponse[];
  currentArea: string;
  progress: {
    [key in AssessmentArea]?: number;
  };
}

/**
 * AssessmentQuestionsPage component
 * Renders the question flow for a specific assessment area
 */
export default function AssessmentQuestionsPage() {
  const params = useParams();
  const router = useRouter();
  const { t, language } = useTranslation();
  
  // Get the assessment ID from URL params
  const assessmentId = params.id as string;
  
  // State for assessment data
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [currentArea, setCurrentArea] = useState<AssessmentArea>(AssessmentArea.GOVERNANCE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get all available assessment areas
  const assessmentAreas = getAssessmentAreas();
  
  /**
   * Load the assessment data when the component mounts
   */
  useEffect(() => {
    const loadAssessment = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real implementation, this would fetch from an API
        // For demo purposes, we're simulating a successful response with mock data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create dummy assessment if not found (for demo)
        const dummyAssessment: Assessment = {
          id: assessmentId,
          departmentName: 'Treasury Board Secretariat',
          departmentAcronym: 'TBS',
          fiscalYear: '2025-2026',
          responses: [],
          currentArea: AssessmentArea.GOVERNANCE,
          progress: {
            [AssessmentArea.GOVERNANCE]: 0,
            [AssessmentArea.PLANNING]: 0,
            [AssessmentArea.SECURITY]: 0,
            [AssessmentArea.DATA]: 0
          }
        };
        
        setAssessment(dummyAssessment);
        setCurrentArea(dummyAssessment.currentArea as AssessmentArea);
      } catch (err) {
        console.error('Error loading assessment:', err);
        setError(t('assessment.loadError'));
      } finally {
        setLoading(false);
      }
    };
    
    loadAssessment();
  }, [assessmentId, t]);
  
  /**
   * Save assessment responses
   * @param responses - The responses to save
   */
  const handleSaveResponses = async (responses: QuestionResponse[]) => {
    if (!assessment) return;
    
    setSaving(true);
    
    try {
      // In a real implementation, this would call an API
      console.log('Saving responses:', responses);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the assessment with the new responses
      setAssessment(prev => {
        if (!prev) return null;
        
        // Merge the new responses with existing ones
        const existingResponseIds = prev.responses.map(r => r.questionId);
        const newResponses = responses.filter(r => !existingResponseIds.includes(r.questionId));
        const updatedExistingResponses = prev.responses.map(existing => {
          const updated = responses.find(r => r.questionId === existing.questionId);
          return updated || existing;
        });
        
        return {
          ...prev,
          responses: [...updatedExistingResponses, ...newResponses],
          // Update progress for current area (simplified calculation for demo)
          progress: {
            ...prev.progress,
            [currentArea]: Math.min(100, (prev.progress[currentArea] || 0) + 10)
          }
        };
      });
    } catch (err) {
      console.error('Error saving responses:', err);
      setError(t('assessment.saveError'));
    } finally {
      setSaving(false);
    }
  };
  
  /**
   * Handle completion of the current area
   * @param responses - The final responses for the area
   */
  const handleAreaComplete = async (responses: QuestionResponse[]) => {
    // First save the responses
    await handleSaveResponses(responses);
    
    // Find the next area
    const currentIndex = assessmentAreas.indexOf(currentArea);
    
    if (currentIndex < assessmentAreas.length - 1) {
      // Move to the next area
      const nextArea = assessmentAreas[currentIndex + 1];
      setCurrentArea(nextArea);
      
      // Update the assessment
      setAssessment(prev => {
        if (!prev) return null;
        return {
          ...prev,
          currentArea: nextArea,
          // Mark the current area as 100% complete
          progress: {
            ...prev.progress,
            [currentArea]: 100
          }
        };
      });
    } else {
      // All areas complete, navigate to the results page
      router.push(`/assessment/${assessmentId}/results`);
    }
  };
  
  /**
   * Handle changing to a different assessment area
   * @param area - The area to switch to
   */
  const handleAreaChange = (area: AssessmentArea) => {
    // Only allow changing to an area if it's the current one or we have some progress
    if (assessment && (area === currentArea || (assessment.progress[area] || 0) > 0)) {
      setCurrentArea(area);
    }
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center">
        <div className="gc-card p-8">
          <h1 className="text-2xl font-bold mb-4">{t('assessment.loading')}</h1>
          <p>{t('assessment.pleaseWait')}</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error || !assessment) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="gc-alert gc-alert-danger">
          <h1 className="text-2xl font-bold mb-4">{t('assessment.error')}</h1>
          <p>{error || t('assessment.genericError')}</p>
          <div className="mt-4">
            <Link href="/" className="gc-button">
              {t('assessment.returnHome')}
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Get questions for the current area
  const areaQuestions = getQuestionsByArea(currentArea);
  
  // Get responses for the current area
  const areaResponses = assessment.responses.filter(
    response => areaQuestions.some(q => q.id === response.questionId)
  );
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gc-blue">
          {t(`area.${currentArea}`)} {t('assessment.questions')}
        </h1>
        
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex text-sm">
            <li className="flex items-center">
              <Link href="/" className="text-gc-blue hover:underline">
                {t('breadcrumb.home')}
              </Link>
              <span className="mx-2" aria-hidden="true">/</span>
            </li>
            <li className="flex items-center">
              <Link href={`/assessment/${assessmentId}`} className="text-gc-blue hover:underline">
                {t('breadcrumb.assessment')}
              </Link>
              <span className="mx-2" aria-hidden="true">/</span>
            </li>
            <li className="text-gc-dark-text font-semibold" aria-current="page">
              {t(`area.${currentArea}`)}
            </li>
          </ol>
        </nav>
        
        {/* Assessment areas tabs */}
        <div className="bg-gc-light-grey p-4 rounded mb-6 overflow-x-auto">
          <div className="flex space-x-2">
            {assessmentAreas.map(area => {
              const progress = assessment.progress[area] || 0;
              const isCurrent = area === currentArea;
              const isStarted = progress > 0;
              
              return (
                <button
                  key={area}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap flex items-center space-x-2 ${
                    isCurrent 
                      ? 'bg-gc-blue text-white' 
                      : isStarted
                        ? 'bg-white text-gc-dark-text hover:bg-gc-highlight'
                        : 'bg-white text-gc-dark-text opacity-60 cursor-not-allowed'
                  }`}
                  onClick={() => handleAreaChange(area)}
                  disabled={!isCurrent && !isStarted}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  <span>{t(`area.${area}`)}</span>
                  {progress > 0 && (
                    <span className="inline-block w-5 h-5 rounded-full bg-gc-light-blue text-white text-xs flex items-center justify-center">
                      {progress === 100 ? '✓' : `${Math.floor(progress / 25) + 1}`}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Assessment description */}
      <div className="gc-alert gc-alert-info mb-6">
        <h2 className="font-bold mb-2">{t(`area.${currentArea}`)}</h2>
        <p>{t(`area.${currentArea}.description`)}</p>
      </div>
      
      {/* Question flow */}
      <QuestionFlow
        questions={areaQuestions}
        initialResponses={areaResponses}
        currentArea={currentArea}
        onSave={handleSaveResponses}
        onComplete={handleAreaComplete}
      />
      
      {/* Save indicator */}
      {saving && (
        <div className="fixed bottom-4 right-4 bg-gc-blue text-white py-2 px-4 rounded-full text-sm shadow-lg">
          {t('assessment.saving')}...
        </div>
      )}
      
      {/* 
        Developer comments:
        - This page component follows Canada.ca UI standards for assessment pages
        - It provides a tab-based navigation between assessment areas
        - Includes progress tracking and visual indicators
        - Handles loading, saving, and error states appropriately
        - Breadcrumb navigation follows WET patterns
        - In a production implementation, API calls would replace the simulated behavior
      */}
    </div>
  );
}
