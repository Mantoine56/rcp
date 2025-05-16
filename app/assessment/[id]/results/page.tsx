/**
 * @file app/assessment/[id]/results/page.tsx
 * @description Assessment results page
 * 
 * This page displays the results of a completed assessment, including
 * maturity scores, compliance flags, and options for exporting the results
 * as a PDF. It follows Canada.ca UI standards for data presentation.
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import FormSection from '@/components/forms/FormSection';

// Import assessment data utilities
import { 
  AssessmentArea, 
  getAssessmentAreas, 
  getQuestionsByArea, 
  assessmentQuestions 
} from '@/lib/questions';

// Interface for assessment response
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
  completedAt?: string;
}

// Interface for area assessment results
interface AreaResult {
  area: AssessmentArea;
  maturityScore: number; // 1-5 scale
  complianceScore: number; // 0-100% scale
  flags: string[];
  questionCount: number;
  answeredCount: number;
}

/**
 * Calculate area results based on responses
 * @param assessment - The assessment data with responses
 * @param currentLanguage - The current UI language ('en' or 'fr')
 * @returns Object with results for each area
 */
const calculateResults = (assessment: Assessment, currentLanguage: 'en' | 'fr'): Record<AssessmentArea, AreaResult> => {
  const areas = getAssessmentAreas();
  const results: Record<AssessmentArea, AreaResult> = {} as Record<AssessmentArea, AreaResult>;
  
  // Initialize results for each area
  areas.forEach(area => {
    results[area] = {
      area,
      maturityScore: 0,
      complianceScore: 0,
      flags: [],
      questionCount: 0,
      answeredCount: 0
    };
  });
  
  // Process each area
  areas.forEach(area => {
    const areaQuestions = getQuestionsByArea(area);
    let maturityTotal = 0;
    let maturityCount = 0;
    let complianceTotal = 0;
    let complianceCount = 0;
    
    // Count questions and answers
    results[area].questionCount = areaQuestions.length;
    
    // Process each question in this area
    areaQuestions.forEach(question => {
      // Find response for this question
      const response = assessment.responses.find(r => r.questionId === question.id);
      
      // Skip if no response
      if (!response) return;
      
      // Count as answered
      results[area].answeredCount++;
      
      // Process flag conditions
      if (question.flagIf && question.flagText) {
        let shouldFlag = false;
        
        // Check if the response value matches any flagging condition
        if (Array.isArray(response.value)) {
          // For multi-select questions
          const hasFlag = question.flagIf.some(flagValue => 
            (response.value as string[]).includes(flagValue)
          );
          shouldFlag = hasFlag;
        } else {
          // For single-value questions
          shouldFlag = question.flagIf.includes(response.value as string);
        }
        
        // Add flag if condition met
        if (shouldFlag) {
          results[area].flags.push(
            currentLanguage === 'en' ? question.flagText.en : question.flagText.fr
          );
        }
      }
      
      // Process maturity scores (for radio questions with maturity options)
      if (question.type === 'radio' && question.options) {
        const selectedOption = question.options.find(
          opt => opt.value === response.value
        );
        
        if (selectedOption && selectedOption.maturityValue) {
          maturityTotal += selectedOption.maturityValue;
          maturityCount++;
        }
      }
      
      // Process compliance scores (simplified for demo)
      // In a real implementation, this would be more sophisticated
      complianceTotal += question.flagIf && 
        (Array.isArray(response.value) 
          ? question.flagIf.some(f => (response.value as string[]).includes(f))
          : question.flagIf.includes(response.value as string)
        ) ? 0 : 100;
      complianceCount++;
    });
    
    // Calculate averages
    if (maturityCount > 0) {
      results[area].maturityScore = Math.round((maturityTotal / maturityCount) * 10) / 10;
    }
    
    if (complianceCount > 0) {
      results[area].complianceScore = Math.round(complianceTotal / complianceCount);
    }
  });
  
  return results;
};

/**
 * Get color class based on maturity score
 * @param score - Maturity score (1-5)
 * @returns Tailwind CSS color class
 */
const getMaturityColor = (score: number): string => {
  if (score < 2) return 'text-gc-danger';
  if (score < 3) return 'text-gc-warning';
  if (score < 4) return 'text-gc-light-blue';
  return 'text-gc-success';
};

/**
 * Get color class based on compliance score
 * @param score - Compliance score (0-100)
 * @returns Tailwind CSS color class
 */
const getComplianceColor = (score: number): string => {
  if (score < 60) return 'text-gc-danger';
  if (score < 80) return 'text-gc-warning';
  if (score < 90) return 'text-gc-light-blue';
  return 'text-gc-success';
};

/**
 * AssessmentResultsPage component
 * Displays the results of a completed assessment
 */
export default function AssessmentResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { t, language } = useTranslation();
  
  // Get the assessment ID from URL params
  const assessmentId = params.id as string;
  
  // State for assessment data and results
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [results, setResults] = useState<Record<AssessmentArea, AreaResult> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  
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
        
        // Create dummy assessment with various responses
        // In a real implementation, this would come from the database
        const dummyAssessment: Assessment = {
          id: assessmentId,
          departmentName: 'Treasury Board Secretariat',
          departmentAcronym: 'TBS',
          fiscalYear: '2025-2026',
          responses: [
            // Governance area responses
            { questionId: 'gov_1', value: 'yes', timestamp: '2025-05-15T12:00:00Z' },
            { questionId: 'gov_2', value: 'defined', timestamp: '2025-05-15T12:01:00Z' },
            { questionId: 'gov_3', value: 'quarterly', timestamp: '2025-05-15T12:02:00Z' },
            { questionId: 'gov_4', value: 'Our IT governance decisions are documented in meeting minutes and communicated via department-wide emails.', timestamp: '2025-05-15T12:03:00Z' },
            
            // Security area responses
            { questionId: 'sec_1', value: 'yes', timestamp: '2025-05-15T12:10:00Z' },
            { questionId: 'sec_2', value: ['mfa', 'encryption', 'logging'], timestamp: '2025-05-15T12:11:00Z' },
            { questionId: 'sec_3', value: 'defined', timestamp: '2025-05-15T12:12:00Z' },
            
            // Data area responses
            { questionId: 'data_1', value: 'no', timestamp: '2025-05-15T12:20:00Z' },
            { questionId: 'data_2', value: 'semi_annually', timestamp: '2025-05-15T12:21:00Z' },
            { questionId: 'data_3', value: 'yes', timestamp: '2025-05-15T12:22:00Z' },
          ],
          currentArea: 'compliance',
          progress: {
            [AssessmentArea.GOVERNANCE]: 100,
            [AssessmentArea.PLANNING]: 100,
            [AssessmentArea.INVESTMENT]: 100,
            [AssessmentArea.SECURITY]: 100,
            [AssessmentArea.OPERATIONS]: 100,
            [AssessmentArea.DATA]: 100,
            [AssessmentArea.SERVICE]: 100,
            [AssessmentArea.PEOPLE]: 100,
            [AssessmentArea.TECHNOLOGY]: 100,
            [AssessmentArea.INTEGRATION]: 100,
            [AssessmentArea.COMPLIANCE]: 100
          },
          completedAt: '2025-05-15T13:00:00Z'
        };
        
        setAssessment(dummyAssessment);
        
        // Calculate results
        const calculatedResults = calculateResults(dummyAssessment, language);
        setResults(calculatedResults);
      } catch (err) {
        console.error('Error loading assessment:', err);
        setError(t('assessment.loadError'));
      } finally {
        setLoading(false);
      }
    };
    
    loadAssessment();
  }, [assessmentId, t, language]);
  
  /**
   * Handle exporting results as PDF
   */
  const handleExportPdf = async () => {
    if (!assessment || !results) return;
    
    setGeneratingPdf(true);
    
    try {
      // In a real implementation, this would call an API to generate a PDF
      console.log('Generating PDF for assessment:', assessmentId);
      
      // Simulate PDF generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Display success message
      alert(t('assessment.pdfSuccess'));
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert(t('assessment.pdfError'));
    } finally {
      setGeneratingPdf(false);
    }
  };
  
  // Count total flags across all areas
  const totalFlags = results 
    ? Object.values(results).reduce((count, area) => count + area.flags.length, 0)
    : 0;
  
  // Calculate overall maturity score (average across areas)
  const overallMaturity = results
    ? Number((Object.values(results)
        .filter(area => area.maturityScore > 0)
        .reduce((sum, area) => sum + area.maturityScore, 0) / 
        Object.values(results).filter(area => area.maturityScore > 0).length
      ).toFixed(1))
    : 0;
  
  // Calculate overall compliance score (average across areas)
  const overallCompliance = results
    ? Math.round(Object.values(results)
        .filter(area => area.complianceScore > 0)
        .reduce((sum, area) => sum + area.complianceScore, 0) / 
        Object.values(results).filter(area => area.complianceScore > 0).length
      )
    : 0;
  
  // Show loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center">
        <div className="gc-card p-8">
          <h1 className="text-2xl font-bold mb-4">{t('assessment.loadingResults')}</h1>
          <p>{t('assessment.pleaseWait')}</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error || !assessment || !results) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="gc-alert gc-alert-danger">
          <h1 className="text-2xl font-bold mb-4">{t('assessment.error')}</h1>
          <p>{error || t('assessment.resultsError')}</p>
          <div className="mt-4">
            <Link href="/" className="gc-button">
              {t('assessment.returnHome')}
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gc-blue">
          {t('assessment.results')}
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
              {t('breadcrumb.results')}
            </li>
          </ol>
        </nav>
      </div>
      
      {/* Assessment overview */}
      <FormSection
        title={t('assessment.overview')}
        subtitle={`${assessment.departmentName} (${assessment.departmentAcronym}) - ${assessment.fiscalYear}`}
        sectionId="assessment-overview"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Overall maturity */}
          <div className="bg-gc-highlight p-4 rounded text-center">
            <h3 className="font-semibold text-gc-dark-text mb-2">{t('assessment.overallMaturity')}</h3>
            <div className={`text-4xl font-bold ${getMaturityColor(overallMaturity)}`}>
              {overallMaturity}
              <span className="text-sm text-gc-dark-text font-normal ml-1">/ 5</span>
            </div>
          </div>
          
          {/* Overall compliance */}
          <div className="bg-gc-highlight p-4 rounded text-center">
            <h3 className="font-semibold text-gc-dark-text mb-2">{t('assessment.overallCompliance')}</h3>
            <div className={`text-4xl font-bold ${getComplianceColor(overallCompliance)}`}>
              {overallCompliance}%
            </div>
          </div>
          
          {/* Total flags */}
          <div className="bg-gc-highlight p-4 rounded text-center">
            <h3 className="font-semibold text-gc-dark-text mb-2">{t('assessment.totalFlags')}</h3>
            <div className={`text-4xl font-bold ${totalFlags > 0 ? 'text-gc-danger' : 'text-gc-success'}`}>
              {totalFlags}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <p className="italic text-sm text-gc-dark-text">
            {t('assessment.completedOn')} {new Date(assessment.completedAt || '').toLocaleDateString()}
          </p>
        </div>
      </FormSection>
      
      {/* Area breakdown */}
      <FormSection
        title={t('assessment.areaBreakdown')}
        sectionId="assessment-areas"
        className="mt-8"
      >
        <div className="overflow-x-auto">
          <table className="gc-table w-full">
            <thead>
              <tr>
                <th>{t('assessment.area')}</th>
                <th>{t('assessment.maturity')}</th>
                <th>{t('assessment.compliance')}</th>
                <th>{t('assessment.flags')}</th>
                <th>{t('assessment.completion')}</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(results).map(area => (
                <tr key={area.area}>
                  <td className="font-medium">{t(`area.${area.area}`)}</td>
                  <td className={getMaturityColor(area.maturityScore)}>
                    {area.maturityScore > 0 ? area.maturityScore : '-'}
                  </td>
                  <td className={getComplianceColor(area.complianceScore)}>
                    {area.complianceScore > 0 ? `${area.complianceScore}%` : '-'}
                  </td>
                  <td className={area.flags.length > 0 ? 'text-gc-danger font-semibold' : ''}>
                    {area.flags.length}
                  </td>
                  <td>
                    {area.answeredCount}/{area.questionCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormSection>
      
      {/* Flags */}
      <FormSection
        title={t('assessment.complianceFlags')}
        sectionId="assessment-flags"
        className="mt-8"
      >
        {totalFlags > 0 ? (
          <div>
            <p className="mb-4">{t('assessment.flagsDescription')}</p>
            
            <div className="space-y-4">
              {Object.values(results).map(area => {
                if (area.flags.length === 0) return null;
                
                return (
                  <div key={area.area} className="gc-alert gc-alert-warning">
                    <h3 className="font-bold mb-2">{t(`area.${area.area}`)}</h3>
                    <ul className="list-disc ml-5">
                      {area.flags.map((flag, index) => (
                        <li key={index}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="gc-alert gc-alert-success">
            <p className="font-semibold">
              {t('assessment.noFlags')}
            </p>
          </div>
        )}
      </FormSection>
      
      {/* Action buttons */}
      <div className="mt-8 flex justify-between">
        <Link href="/" className="gc-button-secondary">
          {t('assessment.returnHome')}
        </Link>
        
        <button
          className="gc-button flex items-center"
          onClick={handleExportPdf}
          disabled={generatingPdf}
        >
          {generatingPdf ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('assessment.generatingPdf')}
            </>
          ) : (
            <>
              {t('assessment.exportPdf')}
            </>
          )}
        </button>
      </div>
      
      {/* 
        Developer comments:
        - This results page follows Canada.ca UI standards for data presentation
        - It provides both overall and area-specific assessment scores
        - Clear visual indication of flags and areas requiring attention
        - Proper accessibility with semantic HTML and ARIA attributes
        - Color-coded scores for quick visual assessment
        - Includes PDF export functionality (simulated for demo)
        - In a production implementation, API calls would replace the simulated data
      */}
    </div>
  );
}
