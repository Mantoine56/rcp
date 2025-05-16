/**
 * @file app/assessment/controls/page.tsx
 * @description Controls Assessment page
 * 
 * This page allows users to complete the controls assessment portion
 * of the self-assessment. It follows Canada.ca UI standards with
 * proper step indicators and bilingual support.
 * 
 * For the MVP version, this demonstrates navigation flow using localStorage
 * to persist state between steps of the assessment process.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

/**
 * ControlsAssessment component
 * Allows users to complete the controls assessment portion
 */
export default function ControlsAssessment() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [currentSection, setCurrentSection] = useState('financialManagement');
  
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
    localStorage.setItem('rcpAssessmentCurrentStep', '3');
  }, [router]);
  
  /**
   * Handle form submission to proceed to next step
   */
  const handleContinue = () => {
    setIsSubmitting(true);
    
    try {
      // Save current step to localStorage
      localStorage.setItem('rcpAssessmentCurrentStep', '4'); // Move to step 4
      
      // For MVP, just redirect to next step (review page)
      router.push('/assessment/review');
    } catch (error) {
      console.error('Error saving progress:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  /**
   * Handle navigation to the previous step
   */
  const handleGoBack = () => {
    // Navigate back to risk assessment
    router.push('/assessment/risk');
  };
  
  /**
   * Save controls assessment data to localStorage
   * @param sectionId - The identifier for the section being saved
   * @param data - The data to be saved for this section
   */
  const saveControlsData = (sectionId: string, data: any) => {
    const existingData = localStorage.getItem('rcpAssessmentFormData');
    const formData = existingData ? JSON.parse(existingData) : {};
    
    // Update with controls assessment data
    formData.controlsAssessment = {
      ...formData.controlsAssessment,
      [sectionId]: data
    };
    
    localStorage.setItem('rcpAssessmentFormData', JSON.stringify(formData));
  };
  
  /**
   * Reset assessment and clear data
   */
  const handleReset = () => {
    // Clear localStorage data
    localStorage.removeItem('rcpAssessmentFormData');
    localStorage.removeItem('rcpAssessmentCurrentStep');
    
    // Redirect to home
    router.push('/');
  };
  
  // If form data is still loading, show loading indicator
  if (!formData) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p>Loading assessment data...</p>
      </div>
    );
  }
  
  // Define the sections for the controls assessment
  // These would typically align with risk assessment sections
  const sections = [
    { id: 'financialManagement', label: 'Financial Management Controls' },
    { id: 'procurement', label: 'Procurement Controls' },
    { id: 'security', label: 'Security Controls' },
    { id: 'dataManagement', label: 'Data Management Controls' },
    { id: 'serviceDelivery', label: 'Service Delivery Controls' },
    { id: 'itGovernance', label: 'IT Governance Controls' }
  ];
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gc-blue">
          {t('assessment.controls.title', 'Controls Assessment')}
        </h1>
        
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex text-sm">
            <li className="flex items-center">
              <Link href="/" className="text-gc-blue hover:underline">
                {t('breadcrumb.home', 'Home')}
              </Link>
              <span className="mx-2" aria-hidden="true">/</span>
            </li>
            <li className="flex items-center">
              <Link href="/assessment/new" className="text-gc-blue hover:underline">
                {t('assessment.new.breadcrumb', 'Start New Assessment')}
              </Link>
              <span className="mx-2" aria-hidden="true">/</span>
            </li>
            <li className="flex items-center">
              <Link href="/assessment/risk" className="text-gc-blue hover:underline">
                {t('assessment.risk.breadcrumb', 'Risk Assessment')}
              </Link>
              <span className="mx-2" aria-hidden="true">/</span>
            </li>
            <li className="text-gc-dark-text font-semibold" aria-current="page">
              {t('assessment.controls.breadcrumb', 'Controls Assessment')}
            </li>
          </ol>
        </nav>
        
        {/* Step indicator */}
        <div className="bg-[#f5f5f5] p-4 rounded-md mb-8 border border-[#e5e5e5] shadow-sm" id="assessment-stepper">
          
          {/* Assessment Stepper Component */}
          <Stepper 
            defaultValue={3} 
            className="py-2 max-w-4xl mx-auto"
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
              completed={true} 
              className="[&:not(:last-child)]:flex-1"
              aria-label="Risk Assessment"
            >
              <StepperTrigger className="flex items-center gap-2" onClick={() => router.push('/assessment/risk')}>
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
              completed={false}
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
      
      {/* Controls Assessment Sections */}
      <div className="mb-8 bg-white p-6 border border-gray-200 rounded-md">
        <FormSection
          title="Controls Assessment"
          subtitle="Select a section to begin your controls assessment"
          sectionId="controls-assessment-sections"
          helpText="For MVP version, we're just demonstrating section navigation without actual control assessment questions."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setCurrentSection(section.id)}
                className={`p-4 text-left rounded-md border ${
                  currentSection === section.id
                    ? 'bg-[#E6F5FF] border-[#2B8CC4]'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <h3 className="font-semibold">{section.label}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {formData.controlsAssessment?.[section.id]
                    ? 'In progress'
                    : 'Not started'}
                </p>
              </button>
            ))}
          </div>
        </FormSection>
        
        {/* Placeholder for actual controls assessment questions */}
        <div className="mt-8 p-4 bg-[#F5F5F5] rounded-md">
          <p className="text-center text-gray-600 italic">
            In this MVP version, we're just demonstrating the navigation between steps.
            <br />
            The actual control assessment components would be loaded here based on the selected section.
          </p>
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
            {t('common.back', 'Back')}
          </button>
        </div>
        
        {/* Middle - Reset button */}
        <div>
          <button 
            type="button" 
            onClick={handleReset}
            className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 bg-white text-red-600 border border-red-600 hover:bg-red-50 hover:underline focus:outline-none focus:ring-4 focus:ring-[#FFBF47] transition rounded text-base font-normal"
          >
            {t('common.reset', 'Reset Assessment')}
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
            {isSubmitting ? t('common.submitting', 'Processing...') : t('assessment.continue', 'Continue')}
          </button>
        </div>
      </div>
      
      {/* Instructions note */}
      <div className="bg-[#F5F5F5] p-4 border-l-4 border-[#2B8CC4] mt-6 mb-12 rounded-sm">
        <p className="mb-0 text-sm flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-[#2B8CC4] flex-shrink-0 mt-0.5">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
          <span>
            <strong>Note:</strong> For this MVP version, all assessment data is saved in your browser's local storage. You can continue your assessment later as long as you use the same browser.
          </span>
        </p>
      </div>
      
      {/* 
        Developer comments:
        - This page follows Canada.ca Web Experience Toolkit standards
        - It demonstrates step navigation in the controls assessment process
        - For a full implementation, we would load actual control questions for each section
        - All data is persisted in localStorage for this MVP
        - This complements the risk assessment process with appropriate controls evaluation
      */}
    </div>
  );
}
