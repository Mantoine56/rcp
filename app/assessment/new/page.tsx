/**
 * @file app/assessment/new/page.tsx
 * @description New assessment start page
 * 
 * This page allows users to start a new assessment by entering basic
 * department information and the fiscal year for the assessment.
 * It follows Canada.ca UI standards with proper step indicators
 * and bilingual support.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';

// Import custom components
import FormSection from '@/components/forms/FormSection';
import FormInput from '@/components/forms/FormInput';
import FormSelect from '@/components/forms/FormSelect';
import FormDateInput from '@/components/forms/FormDateInput';
import { useTranslation } from '@/lib/i18n';
import {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperTitle,
  StepperSeparator,
  StepperTrigger
} from '@/components/ui/stepper';

// Import department data
import { getSortedDepartments } from '@/lib/departments';

/**
 * Form validation schema
 * Defines the required fields and validation rules for the form
 */
const formSchema = z.object({
  // Department Information
  departmentId: z.string({
    required_error: "Department selection is required",
  }),
  departmentOther: z.string().optional(),
  fiscalYear: z.string().regex(/^\d{4}-\d{4}$/, 'Fiscal year must be in YYYY-YYYY format'),
  
  // Coordinator Information
  coordinatorName: z.string().min(2, 'Coordinator name is required'),
  coordinatorEmail: z.string().email('Please enter a valid email address'),
  coordinatorPhone: z.string().regex(/^[\d\(\)\-\+\s]+$/, 'Please enter a valid phone number').optional(),
  coordinatorTitle: z.string().optional(),
});

// Type for the form values
type FormValues = z.infer<typeof formSchema>;

/**
 * NewAssessment component
 * Allows users to start a new assessment
 */
export default function NewAssessment() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  /**
   * Get departments for dropdown selection
   * Sorted alphabetically by English name
   */
  const departments = getSortedDepartments();
  const departmentOptions = departments.map(dept => ({
    value: dept.acronym,
    label: language === 'en' ? dept.nameEn : dept.nameFr
  }));
  
  // Add "Other" option to the end
  departmentOptions.push({
    value: 'OTHER',
    label: language === 'en' ? 'Other (please specify)' : 'Autre (veuillez préciser)'
  });
  
  // State to track if "Other" department is selected
  const [showOtherDepartment, setShowOtherDepartment] = useState(false);
  
  // Initialize react-hook-form with Controller for select dropdown
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departmentId: '',
      departmentOther: '',
      fiscalYear: '2025-2026', // Default to current fiscal year
      coordinatorName: '',
      coordinatorEmail: '',
      coordinatorPhone: '',
      coordinatorTitle: '',
    },
  });
  
  // Watch the departmentId field to show/hide the "Other" input
  const departmentId = watch('departmentId');
  
  // Update the "Other" department visibility when departmentId changes
  useEffect(() => {
    setShowOtherDepartment(departmentId === 'OTHER');
  }, [departmentId]);
  
  /**
   * Handle form submission
   * Validates the form and creates a new assessment
   * @param values - Form values
   */
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // TODO: In a real implementation, this would call an API to create the assessment
      console.log('Creating new assessment:', values);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to the first question page
      // In a real implementation, we would redirect to the first section
      // with the newly created assessment ID
      router.push('/assessment/1/questions');
    } catch (error) {
      console.error('Error creating assessment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gc-blue">
          {t('assessment.new.title')}
        </h1>
        
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex text-sm">
            <li className="flex items-center">
              <Link href="/" className="text-gc-blue hover:underline">
                {t('breadcrumb.home')}
              </Link>
              <span className="mx-2" aria-hidden="true">/</span>
            </li>
            <li className="text-gc-dark-text font-semibold" aria-current="page">
              {t('assessment.new.breadcrumb')}
            </li>
          </ol>
        </nav>
        
        {/* Step indicator */}
        <div className="bg-[#f5f5f5] p-4 rounded-md mb-8 border border-[#e5e5e5] shadow-sm" id="assessment-stepper">
          
          {/* Assessment Stepper Component */}
          <Stepper 
            defaultValue={1} 
            className="py-2 max-w-4xl mx-auto"
            aria-label="Assessment Progress"
          >
            {/* Step 1: Department Information */}
            <StepperItem 
              step={1} 
              completed={false} 
              className="[&:not(:last-child)]:flex-1"
              aria-label="Department Information Step"
            >
              <StepperTrigger className="flex items-center gap-2">
                <StepperIndicator className="flex-shrink-0 mt-0 mx-0" />
                <StepperTitle className="flex items-center mt-0">
                  <span className="text-xs md:text-sm font-semibold whitespace-nowrap">Department Information</span>
                </StepperTitle>
              </StepperTrigger>
              <StepperSeparator />
            </StepperItem>
            
            {/* Step 2: Risk Assessment */}
            <StepperItem 
              step={1} 
              disabled={true}
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
              step={2}
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
              step={3}
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
      
      {/* Department information form - More compact and cohesive layout */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8 bg-white p-6 border border-gray-200 rounded-md">
        {/* Department Information Section */}
        <FormSection
          title={t('assessment.departmentInfo.title')}
          subtitle={t('assessment.departmentInfo.subtitle')}
          sectionId="department-info"
          helpText={t('assessment.departmentInfo.helpText')}
        >
          {/* Grid layout with consistent alignment for form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Department selection dropdown - takes first column */}
            <div className="md:col-span-1 flex flex-col">
              {/* Consistent height for form field labels to ensure alignment */}
              <div className="h-7">  {/* Fixed height for label container */}
                <label htmlFor="departmentId" className="block text-sm font-medium text-gc-dark-text mb-1">
                  {t('assessment.departmentInfo.departmentName')}<span className="text-red-600">*</span>
                </label>
              </div>
              
              <Controller
                control={control}
                name="departmentId"
                render={({ field }) => (
                  <FormSelect
                    id="departmentId"
                    label="" /* Empty label as we're using custom label above */
                    options={departmentOptions}
                    emptyOption={t('assessment.departmentInfo.selectDepartment')}
                    required
                    error={errors.departmentId?.message}
                    hint={t('assessment.departmentInfo.departmentHint')}
                    className="w-full"
                    hideLabel={true} /* Hide the default label */
                    {...field}
                  />
                )}
              />
              
              {/* "Other" department field - only shown when "Other" is selected */}
              {showOtherDepartment && (
                <div className="mt-4">
                  <FormInput
                    id="departmentOther"
                    label={t('assessment.departmentInfo.departmentOther')}
                    required
                    error={errors.departmentOther?.message}
                    hint={t('assessment.departmentInfo.departmentOtherHint')}
                    className="w-full"
                    {...register('departmentOther')}
                  />
                </div>
              )}
            </div>
            
            {/* Fiscal year using the GC Design System date input component */}
            <div className="md:col-span-1">
              {/* Using the FormDateInput component with compact format for fiscal year */}
              <Controller
                control={control}
                name="fiscalYear"
                render={({ field: { onChange, value } }) => (
                  <FormDateInput
                    id="fiscalYear"
                    label={t('assessment.departmentInfo.fiscalYear')}
                    required
                    hint={t('assessment.departmentInfo.fiscalYearHint')}
                    error={errors.fiscalYear?.message}
                    format="compact" /* Only need year and month for fiscal year */
                    value={value}
                    onChange={onChange}
                    className="w-full"
                  />
                )}
              />
            </div>
          </div>
        </FormSection>
        
        {/* Divider between sections */}
        <hr className="my-6 border-gray-200" />
        
        {/* Coordinator Information Section - Using 2-column layout */}
        <FormSection
          title={t('assessment.coordinatorInfo.title')}
          subtitle={t('assessment.coordinatorInfo.subtitle')}
          sectionId="coordinator-info"
          helpText={t('assessment.coordinatorInfo.helpText')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Left Column - Name and Job Title */}
            <div className="flex flex-col">
              {/* Coordinator name with fixed height label container */}
              <div className="h-7">
                <label htmlFor="coordinatorName" className="block text-sm font-medium text-gc-dark-text mb-1">
                  {t('assessment.coordinatorInfo.name')}<span className="text-red-600">*</span>
                </label>
              </div>
              <FormInput
                id="coordinatorName"
                label=""
                hideLabel={true}
                required
                error={errors.coordinatorName?.message}
                className="w-full"
                {...register('coordinatorName')}
              />
              
              {/* Coordinator job title with fixed height label container */}
              <div className="h-7 mt-6">
                <label htmlFor="coordinatorTitle" className="block text-sm font-medium text-gc-dark-text mb-1">
                  {t('assessment.coordinatorInfo.jobTitle')}
                </label>
              </div>
              <FormInput
                id="coordinatorTitle"
                label=""
                hideLabel={true}
                error={errors.coordinatorTitle?.message}
                className="w-full"
                {...register('coordinatorTitle')}
              />
            </div>
            
            {/* Right Column - Contact Details */}
            <div className="flex flex-col">
              {/* Coordinator email with fixed height label container */}
              <div className="h-7">
                <label htmlFor="coordinatorEmail" className="block text-sm font-medium text-gc-dark-text mb-1">
                  {t('assessment.coordinatorInfo.email')}<span className="text-red-600">*</span>
                </label>
              </div>
              <FormInput
                id="coordinatorEmail"
                label=""
                hideLabel={true}
                type="email"
                required
                error={errors.coordinatorEmail?.message}
                className="w-full"
                {...register('coordinatorEmail')}
              />
              
              {/* Coordinator phone with fixed height label container */}
              <div className="h-7 mt-6">
                <label htmlFor="coordinatorPhone" className="block text-sm font-medium text-gc-dark-text mb-1">
                  {t('assessment.coordinatorInfo.phone')}
                </label>
              </div>
              <div className="relative">
                <FormInput
                  id="coordinatorPhone"
                  label=""
                  hideLabel={true}
                  type="tel"
                  error={errors.coordinatorPhone?.message}
                  className="w-full"
                  {...register('coordinatorPhone')}
                />
                <div className="text-sm text-[#5C5C5C] mt-1">
                  {t('assessment.coordinatorInfo.phoneHint')}
                </div>
              </div>
            </div>
          </div>
        </FormSection>
        
        {/* Form actions - Styled according to GC Design System */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-between mt-8 space-y-4 space-y-reverse sm:space-y-0 sm:space-x-4">
          {/* Left side - Cancel button */}
          <div>
            <Link 
              href="/" 
              className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 bg-white text-[#26374A] border border-[#26374A] hover:bg-gray-100 hover:underline hover:text-[#16446C] focus:outline-none focus:ring-4 focus:ring-[#FFBF47] transition rounded text-base font-normal"
            >
              {t('common.cancel')}
            </Link>
          </div>
          
          {/* Right side - Submit button */}
          <div>
            <button 
              type="submit" 
              className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 bg-[#26374A] text-white border border-[#26374A] hover:bg-[#1C578A] hover:underline focus:outline-none focus:ring-4 focus:ring-[#FFBF47] transition rounded text-base font-normal"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('common.submitting') : t('assessment.continue')}
            </button>
          </div>
        </div>
        
        {/* Instructions note with improved styling */}
        <div className="bg-[#F5F5F5] p-4 border-l-4 border-[#2B8CC4] mt-6 rounded-sm">
          <p className="mb-0 text-sm flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-[#2B8CC4] flex-shrink-0 mt-0.5">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
            <span>
              <strong>{t('common.note')}:</strong> {t('assessment.saveNote')}
            </span>
          </p>
        </div>
      </form>
      
      {/* 
        Developer comments:
        - This form follows Canada.ca Web Experience Toolkit standards
        - It includes comprehensive validation using zod schema
        - Proper form layout with section grouping
        - All fields include accessibility attributes
        - Breadcrumb and step indicators follow WET patterns
      */}
    </div>
  );
}
