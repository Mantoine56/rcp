/**
 * @file app/assessment/risk/page.tsx
 * @description Risk Assessment page
 * 
 * This page allows users to complete the risk assessment portion
 * of the self-assessment. It follows Canada.ca UI standards with
 * proper step indicators and bilingual support.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import QuestionRenderer from '@/components/assessment/QuestionRenderer';

// Import custom components
import FormSection from '@/components/forms/FormSection';
import { useTranslation } from '@/lib/i18n';
import {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperTitle,
  StepperSeparator,
  StepperTrigger
} from '@/components/ui/stepper';

// Import question and assignment modules
import { AssessmentArea } from '@/lib/questions';
import { 
  AssessmentQuestion, 
  getQuestionsByArea, 
  getAllAreas, 
  AreaMetadata 
} from '@/lib/questionBank';
import { 
  assignmentStore, 
  userStore, 
  Assignment, 
  User, 
  AssignmentStatus, 
  assignArea,
  updateAssignmentStatus 
} from '@/lib/assignments';

/**
 * RiskAssessment component
 * Allows users to complete the risk assessment portion
 */
export default function RiskAssessment() {
  const router = useRouter();
  const { t, language } = useTranslation();
  
  // Type-safe translation utility functions
  
  // For translating based on keys in the translations dictionary
  const translateKey = useCallback((key: string, fallback: string): string => {
    try {
      const translation = t(key);
      return typeof translation === 'string' ? translation : fallback;
    } catch (error) {
      console.warn(`Translation key not found: ${key}`);
      return fallback;
    }
  }, [t]);
  
  // For translating directly from {en, fr} objects
  const translateObj = useCallback((content: { en: string; fr: string }): string => {
    return content[language] || content.en; // Fallback to English if the language version doesn't exist
  }, [language]);
  
  // Calculate completion percentage for each area
  const getAreaCompletionPercentage = useCallback((area: AssessmentArea): number => {
    const areaQuestions = getQuestionsByArea(area);
    if (areaQuestions.length === 0) return 0;
    
    const savedFormData = localStorage.getItem('rcpAssessmentFormData');
    if (!savedFormData) return 0;
    
    const formData = JSON.parse(savedFormData);
    if (!formData.riskAssessment || !formData.riskAssessment[area]) return 0;
    
    const answeredCount = Object.keys(formData.riskAssessment[area]).length;
    return Math.round((answeredCount / areaQuestions.length) * 100);
  }, []);
  

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  
  // State for question handling
  const [currentArea, setCurrentArea] = useState<AssessmentArea>(AssessmentArea.PROCUREMENT);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [showAssignPanel, setShowAssignPanel] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState<string>('');
  const [assignmentNote, setAssignmentNote] = useState<string>('');
  const [areaMetadata, setAreaMetadata] = useState<AreaMetadata[]>([]);
  
  // Load saved form data from localStorage on initial load
  useEffect(() => {
    const savedFormData = localStorage.getItem('rcpAssessmentFormData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    } else {
      // If no form data exists, redirect back to the first step
      router.push('/assessment/new');
    }
    
    // Set current step in localStorage
    localStorage.setItem('rcpAssessmentCurrentStep', '2');
    
    // Initialize area metadata
    setAreaMetadata(getAllAreas());
    
    // Initialize the user store (makes sure we have demo users)
    userStore.initializeDefaultUsers();
    
    // Load all available users
    setAvailableUsers(userStore.getAllUsers().filter(user => user.role === 'contributor'));
  }, [router]);
  
  // Load questions for the selected assessment area
  useEffect(() => {
    // Get questions for the current area
    const areaQuestions = getQuestionsByArea(currentArea);
    setQuestions(areaQuestions);
    
    // Get assignment for the area
    const areaAssignments = assignmentStore.getAssignmentsByArea(currentArea);
    setAssignments(areaAssignments);
    
    if (areaAssignments.length > 0) {
      setCurrentAssignment(areaAssignments[0]);
    } else {
      setCurrentAssignment(null);
    }
    
    // Load saved answers for this area if they exist
    const savedFormData = localStorage.getItem('rcpAssessmentFormData');
    if (savedFormData) {
      const formData = JSON.parse(savedFormData);
      if (formData.riskAssessment && formData.riskAssessment[currentArea]) {
        setAnswers(formData.riskAssessment[currentArea]);
      } else {
        setAnswers({});
      }
    }
  }, [currentArea]);
  
  /**
   * Handle form submission to proceed to next step
   */
  const handleContinue = () => {
    setIsSubmitting(true);
    
    try {
      // Save current step to localStorage
      localStorage.setItem('rcpAssessmentCurrentStep', '3'); // Move to step 3
      
      // For MVP, just redirect to next step
      router.push('/assessment/controls');
    } catch (error) {
      console.error('Error saving progress:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  /**
   * Handle navigation to a previous section
   */
  const handleGoBack = () => {
    // Navigate back to department information
    router.push('/assessment/new');
  };
  
  /**
   * Save risk assessment data to localStorage
   * @param area - The assessment area being saved
   * @param data - The answer data to be saved for this area
   */
  const saveRiskData = useCallback((area: AssessmentArea, data: any) => {
    // Save to localStorage
    try {
      const existingData = localStorage.getItem('rcpAssessmentFormData');
      const formData = existingData ? JSON.parse(existingData) : {};
      
      // Initialize riskAssessment if it doesn't exist
      if (!formData.riskAssessment) {
        formData.riskAssessment = {};
      }
      
      // Update with risk assessment data
      formData.riskAssessment[area] = data;
      
      localStorage.setItem('rcpAssessmentFormData', JSON.stringify(formData));
      
      // Also update local state
      setAnswers(data);
      
      // Update assignment status if this area is assigned
      if (currentAssignment) {
        // If all questions have answers, mark as in_progress
        const areaQuestions = getQuestionsByArea(area);
        const answeredQuestions = Object.keys(data).length;
        
        if (answeredQuestions > 0) {
          // Mark as in_progress if started but not all questions answered
          const newStatus: AssignmentStatus = 
            answeredQuestions === areaQuestions.length ? 'completed' : 'in_progress';
          
          if (currentAssignment.status !== newStatus) {
            updateAssignmentStatus(
              currentAssignment.id, 
              newStatus, 
              `Status automatically updated to ${newStatus} based on question completion`
            );
            
            // Refresh assignments
            const areaAssignments = assignmentStore.getAssignmentsByArea(area);
            setAssignments(areaAssignments);
            
            if (areaAssignments.length > 0) {
              setCurrentAssignment(areaAssignments[0]);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error saving risk assessment data:', error);
    }
  }, [currentAssignment]);
  
  /**
   * Handle answer change for a question
   * @param questionId - The ID of the question being answered
   * @param value - The answer value
   */
  const handleAnswerChange = (questionId: string, value: any) => {
    const updatedAnswers = {
      ...answers,
      [questionId]: value
    };
    
    // Save the updated answers
    saveRiskData(currentArea, updatedAnswers);
  };
  
  /**
   * Create a new assignment for the current area
   */
  const handleCreateAssignment = () => {
    if (!selectedAssignee) {
      alert('Please select an assignee');
      return;
    }
    
    try {
      // Get current user (for demo, we'll use the coordinator)
      const currentUser = userStore.getUsersByRole('coordinator')[0];
      
      // Create assignment
      const assignment = assignArea(
        currentArea,
        selectedAssignee,
        currentUser.email,
        undefined, // Due date
        assignmentNote || undefined
      );
      
      // Update assignments state
      setAssignments([...assignments, assignment]);
      setCurrentAssignment(assignment);
      
      // Reset form
      setSelectedAssignee('');
      setAssignmentNote('');
      setShowAssignPanel(false);
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert(`Failed to create assignment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  /**
   * Reset assessment and clear data
   */
  const handleReset = useCallback(() => {
    // Clear localStorage data
    localStorage.removeItem('rcpAssessmentFormData');
    localStorage.removeItem('rcpAssessmentCurrentStep');
    
    // Clear assignment data for demo purposes
    
    // Reset assignment data for demo purposes
    return 0;
  }, []);
  
  // Get status label for an area
  const getAreaStatusLabel = useCallback((area: AssessmentArea): string => {
    const percentage = getAreaCompletionPercentage(area);
    
    if (percentage === 0) return 'Not started';
    if (percentage === 100) return 'Completed';
    return `In progress (${percentage}%)`;
  }, [getAreaCompletionPercentage]);
  
  // Get assignment status for display
  const getAssignmentStatusLabel = useCallback((assignment: Assignment | null): string => {
    if (!assignment) return 'Not assigned';
    
    switch (assignment.status) {
      case 'not_started':
        return 'Assigned, not started';
      case 'in_progress':
        return 'In progress';
      case 'completed':
        return 'Completed, awaiting review';
      case 'reviewed':
        return 'Reviewed and approved';
      default:
        return 'Unknown status';
    }
  }, []);

  // Render a question using our reusable component
  const renderQuestion = useCallback((question: AssessmentQuestion) => {
    const value = answers[question.id] || '';

    return (
      <QuestionRenderer
        key={question.id}
        question={question}
        value={value}
        onChange={handleAnswerChange}
        assignment={currentAssignment || undefined}
        className="mb-6 p-4 bg-white border border-gray-200 rounded-md"
      />
    );
  }, [answers, currentAssignment, handleAnswerChange]);

  if (!formData) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p>Loading assessment data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gc-blue">
          {translateObj({ en: 'Risk Assessment', fr: 'Évaluation des risques' })}
        </h1>

        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex text-sm">
            <li className="flex items-center">
              <Link href="/" className="text-gc-blue hover:underline">
                {translateKey('breadcrumb.home', 'Home')}
              </Link>
              <span className="mx-2" aria-hidden="true">/</span>
            </li>
            <li className="flex items-center">
              <Link href="/assessment/new" className="text-gc-blue hover:underline">
                {translateKey('assessment.new.breadcrumb', 'Start New Assessment')}
              </Link>
              <span className="mx-2" aria-hidden="true">/</span>
            </li>
            <li className="text-gc-dark-text font-semibold" aria-current="page">
              {translateKey('assessment.risk.breadcrumb', 'Risk Assessment')}
            </li>
          </ol>
        </nav>
        
        {/* Assessment Progress Stepper */}
        <div className="mb-6">
          <Stepper
            // The Stepper component doesn't accept currentStep, the active step is determined by the StepperItem's props
            aria-label="Assessment Progress"
          >
            {/* Step 1: Department Information */}
            <StepperItem
              step={1}
              completed={true}
              className="[&:not(:last-child)]:flex-1"
              aria-label="Department Information Step"
            >
              <StepperTrigger className="flex items-center gap-2" onClick={() => router.push('/assessment/new')}>
                <StepperIndicator className="flex-shrink-0 mt-0 mx-0" />
                <StepperTitle className="flex items-center mt-0">
                  <span className="text-xs md:text-sm font-semibold whitespace-nowrap">Department Information</span>
                </StepperTitle>
              </StepperTrigger>
              <StepperSeparator />
            </StepperItem>

            {/* Step 2: Risk Assessment */}
            <StepperItem
              step={2}
              completed={false}
              className="[&:not(:last-child)]:flex-1"
              aria-label="Risk Assessment"
            >
              <StepperTrigger className="flex items-center gap-2">
                <StepperIndicator className="flex-shrink-0 mt-0 mx-0" />
                <StepperTitle className="flex items-center mt-0">
                  <span className="text-xs md:text-sm font-semibold whitespace-nowrap">Risk Assessment</span>
                </StepperTitle>
              </StepperTrigger>
              <StepperSeparator />
            </StepperItem>

            {/* Step 3: Controls Assessment */}
            <StepperItem
              step={3}
              disabled={true}
              className="[&:not(:last-child)]:flex-1"
              aria-label="Controls Assessment"
            >
              <StepperTrigger className="flex items-center gap-2">
                <StepperIndicator className="flex-shrink-0 mt-0 mx-0" />
                <StepperTitle className="flex items-center mt-0">
                  <span className="text-xs md:text-sm font-semibold whitespace-nowrap">Controls Assessment</span>
                </StepperTitle>
              </StepperTrigger>
              <StepperSeparator />
            </StepperItem>

            {/* Step 4: Review & Submit */}
            <StepperItem
              step={4}
              disabled={true}
              className="flex-1"
              aria-label="Review and Submit"
            >
              <StepperTrigger className="flex items-center gap-2">
                <StepperIndicator className="flex-shrink-0 mt-0 mx-0" />
                <StepperTitle className="flex items-center mt-0">
                  <span className="text-xs md:text-sm font-semibold whitespace-nowrap">Review & Submit</span>
                </StepperTitle>
              </StepperTrigger>
            </StepperItem>
          </Stepper>
        </div>
      </div>

      {/* Department information summary */}
      <div className="mb-8 bg-white p-6 border border-gray-200 rounded-md">
        <h2 className="text-xl font-bold mb-4 text-gc-blue">
          Department Information Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold">Department/Agency:</p>
            <p className="text-base">
              {formData.departmentId === 'OTHER'
                ? formData.departmentOther
                : formData.departmentId}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold">Fiscal Year:</p>
            <p className="text-base">{formData.fiscalYear}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Coordinator:</p>
            <p className="text-base">{formData.coordinatorName}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Contact:</p>
            <p className="text-base">{formData.coordinatorEmail}</p>
          </div>
        </div>
      </div>

      {/* Risk Assessment Sections */}
      <div className="mb-8 bg-white p-6 border border-gray-200 rounded-md">
        <FormSection
          title="Risk Assessment"
          subtitle="Select a section to begin your risk assessment"
          sectionId="risk-assessment-sections"
          helpText="Each section contains a set of risk assessment questions that can be assigned to subject matter experts."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {areaMetadata.map((area) => (
              <button
                key={area.id}
                onClick={() => setCurrentArea(area.id as AssessmentArea)}
                className={`p-4 text-left rounded-md border ${
                  currentArea === area.id
                    ? 'bg-[#E6F5FF] border-[#2B8CC4]'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <h3 className="font-semibold">{area.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {getAreaStatusLabel(area.id as AssessmentArea)}
                </p>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full"
                    style={{ width: `${getAreaCompletionPercentage(area.id as AssessmentArea)}%` }}
                  ></div>
                </div>
                <div className="mb-4">
                  <p>{translateKey('assessment.risk.instructions.title', 'Instructions')}:</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {translateKey('assessment.risk.instructions.text', 'Please answer the following questions to assess risk in this area.')}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </FormSection>

        {/* Selected section questions and assignment panel */}
        <div className="mt-8">
          {/* Assignment status banner */}
          <div className={`rounded-t-md p-4 flex justify-between items-center ${currentAssignment ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}>
            <div>
              <h2 className="text-lg font-semibold">
                {areaMetadata.find(a => a.id === currentArea)?.title || 'Selected Area'}
              </h2>
              <p className="text-sm mt-1">
                {currentAssignment ? (
                  <span className="flex items-center">
                    <span className="mr-2">Status: {getAssignmentStatusLabel(currentAssignment)}</span>
                    {currentAssignment.assignee && (
                      <span className="text-gray-600">
                        • Assigned to: {userStore.getUserByEmail(currentAssignment.assignee)?.name || currentAssignment.assignee}
                      </span>
                    )}
                  </span>
                ) : (
                  <span>{translateKey('assessment.risk.section.notAssigned', 'Not assigned to anyone')}</span>
                )}
              </p>
            </div>

            {!currentAssignment && (
              <button
                onClick={() => setShowAssignPanel(!showAssignPanel)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
              >
                Assign Section
              </button>
            )}
          </div>

          {/* Assignment panel */}
          {showAssignPanel && (
            <div className="p-4 bg-gray-50 border-l border-r border-gray-200">
              <h3 className="text-md font-semibold mb-3">Assign this section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">
                    Assignee
                  </label>
                  <select
                    id="assignee"
                    value={selectedAssignee}
                    onChange={(e) => setSelectedAssignee(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                  >
                    <option value="">Select a user</option>
                    {availableUsers.map(user => (
                      <option key={user.email} value={user.email}>
                        {user.name} ({user.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                    Note (optional)
                  </label>
                  <input
                    type="text"
                    id="note"
                    value={assignmentNote}
                    onChange={(e) => setAssignmentNote(e.target.value)}
                    placeholder="Add a note for the assignee"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4 space-x-3">
                <button
                  onClick={() => setShowAssignPanel(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAssignment}
                  className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Assign Section
                </button>
              </div>
            </div>
          )}

          {/* Questions for the selected area */}
          <div className="p-6 bg-gray-50 border-l border-r border-b border-gray-200 rounded-b-md">
            {questions.length > 0 ? (
              <div className="space-y-4">
                {questions.map(question => renderQuestion(question))}
              </div>
            ) : (
              <div className="text-center text-gray-600 py-12">
                <p className="mb-2">No questions available for this section yet.</p>
                <p className="text-sm italic">This is a demo version with limited question sets.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between mt-8 space-y-4 space-y-reverse sm:space-y-0 sm:space-x-4 mb-12">
        {/* Left side - Back button */}
        <div>
          <button
            type="button"
            onClick={handleGoBack}
            className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 bg-white text-[#26374A] border border-[#26374A] hover:bg-gray-100 hover:underline hover:text-[#16446C] focus:outline-none focus:ring-4 focus:ring-[#FFBF47] transition rounded text-base font-normal"
          >
            {translateKey('common.back', 'Back')}
          </button>
        </div>

        {/* Middle - Reset button */}
        <div>
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 bg-white text-red-600 border border-red-600 hover:bg-red-50 hover:underline focus:outline-none focus:ring-4 focus:ring-[#FFBF47] transition rounded text-base font-normal"
          >
            {translateKey('common.reset', 'Reset Assessment')}
          </button>
        </div>

        {/* Right side - Continue button */}
        <div>
          <button
            type="button"
            onClick={handleContinue}
            className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 bg-[#26374A] text-white border border-[#26374A] hover:bg-[#1C578A] hover:underline focus:outline-none focus:ring-4 focus:ring-[#FFBF47] transition rounded text-base font-normal"
            disabled={isSubmitting}
          >
            {isSubmitting ? translateKey('common.submitting', 'Processing...') : translateKey('assessment.continue', 'Continue')}
          </button>
        </div>
      </div>

      {/* Instructions note */}
      <div className="bg-[#F5F5F5] p-4 border-l-4 border-[#2B8CC4] mt-6 mb-12 rounded-sm">
        <p className="mb-0 text-sm flex items-start">
          <span className="mr-2 text-[#2B8CC4] flex-shrink-0 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
          </span>
          <span>
            <strong>Note:</strong> {translateKey('assessment.risk.instructions', 'This is the Risk Assessment section where you will evaluate your department\'s risk areas. You can assign sections to subject matter experts who can complete their assigned questions.')}
          </span>
        </p>
      </div>
    </div>
  );
}
