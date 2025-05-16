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
        <div className="bg-[#f5f5f5] p-3 rounded-md mb-6 border border-[#e5e5e5] shadow-sm">
          
          {/* Assessment Stepper Component */}
          <Stepper 
            defaultValue={1} 
            className="py-2 px-2 max-w-4xl mx-auto"
            aria-label="Assessment Progress"
          >
            {/* Step 1: Department Information */}
            <StepperItem 
              step={1} 
              completed={false} 
              className="[&:not(:last-child)]:flex-1"
              aria-label="Department Information Step"
            >
              <StepperTrigger className="flex items-center">
                <StepperIndicator />
                <StepperTitle className="flex items-center">
                  <span className="text-xs font-semibold">{t('assessment.steps.departmentInfo')}</span>
                </StepperTitle>
              </StepperTrigger>
              <StepperSeparator />
            </StepperItem>
            
            {/* Step 2: Risk Assessment */}
            <StepperItem 
              step={1} 
              disabled={true}
              className="[&:not(:last-child)]:flex-1"
              aria-label="Risk Assessment Step"
            >
              <StepperTrigger className="flex items-center">
                <StepperIndicator />
                <StepperTitle className="flex items-center">
                  <span className="text-xs font-semibold">{t('assessment.steps.riskAssessment')}</span>
                </StepperTitle>
              </StepperTrigger>
              <StepperSeparator />
            </StepperItem>
            
            {/* Step 3: Controls Assessment */}
            <StepperItem 
              step={2}
              disabled={true}
              className="[&:not(:last-child)]:flex-1"
              aria-label="Controls Assessment Step"
            >
              <StepperTrigger className="flex items-center">
                <StepperIndicator />
                <StepperTitle className="flex items-center">
                  <span className="text-xs font-semibold">{t('assessment.steps.controlsAssessment')}</span>
                </StepperTitle>
              </StepperTrigger>
              <StepperSeparator />
            </StepperItem>
            
            {/* Step 4: Review & Submit */}
            <StepperItem 
              step={3}
              disabled={true}
              className="flex-1"
              aria-label="Review and Submit Step"
            >
              <StepperTrigger className="flex items-center">
                <StepperIndicator />
                <StepperTitle className="flex items-center">
                  <span className="text-xs font-semibold">{t('assessment.steps.reviewSubmit')}</span>
                </StepperTitle>
              </StepperTrigger>
            </StepperItem>
          </Stepper>
        </div>
      </div>
      
      {/* Department information form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        {/* Department Information Section */}
        <FormSection
          title={t('assessment.departmentInfo.title')}
          subtitle={t('assessment.departmentInfo.subtitle')}
          sectionId="department-info"
          helpText={t('assessment.departmentInfo.helpText')}
        >
          {/* Department selection dropdown */}
          <Controller
            control={control}
            name="departmentId"
            render={({ field }) => (
              <FormSelect
                id="departmentId"
                label={t('assessment.departmentInfo.departmentName')}
                options={departmentOptions}
                emptyOption={t('assessment.departmentInfo.selectDepartment')}
                required
                error={errors.departmentId?.message}
                hint={t('assessment.departmentInfo.departmentHint')}
                {...field}
              />
            )}
          />
          
          {/* "Other" department field - only shown when "Other" is selected */}
          {showOtherDepartment && (
            <FormInput
              id="departmentOther"
              label={t('assessment.departmentInfo.departmentOther')}
              required
              error={errors.departmentOther?.message}
              hint={t('assessment.departmentInfo.departmentOtherHint')}
              {...register('departmentOther')}
            />
          )}
          
          {/* Fiscal year */}
          <FormInput
            id="fiscalYear"
            label={t('assessment.departmentInfo.fiscalYear')}
            required
            hint={t('assessment.departmentInfo.fiscalYearHint')}
            error={errors.fiscalYear?.message}
            {...register('fiscalYear')}
          />
        </FormSection>
        
        {/* Coordinator Information Section */}
        <FormSection
          title={t('assessment.coordinatorInfo.title')}
          subtitle={t('assessment.coordinatorInfo.subtitle')}
          sectionId="coordinator-info"
          helpText={t('assessment.coordinatorInfo.helpText')}
        >
          {/* Coordinator name */}
          <FormInput
            id="coordinatorName"
            label={t('assessment.coordinatorInfo.name')}
            required
            error={errors.coordinatorName?.message}
            {...register('coordinatorName')}
          />
          
          {/* Coordinator job title */}
          <FormInput
            id="coordinatorTitle"
            label={t('assessment.coordinatorInfo.jobTitle')}
            error={errors.coordinatorTitle?.message}
            {...register('coordinatorTitle')}
          />
          
          {/* Coordinator email */}
          <FormInput
            id="coordinatorEmail"
            label={t('assessment.coordinatorInfo.email')}
            type="email"
            required
            error={errors.coordinatorEmail?.message}
            {...register('coordinatorEmail')}
          />
          
          {/* Coordinator phone */}
          <FormInput
            id="coordinatorPhone"
            label={t('assessment.coordinatorInfo.phone')}
            type="tel"
            error={errors.coordinatorPhone?.message}
            hint={t('assessment.coordinatorInfo.phoneHint')}
            {...register('coordinatorPhone')}
          />
        </FormSection>
        
        {/* Form actions */}
        <div className="flex justify-between mt-8 mb-4">
          {/* Updated Cancel button using proper GC Design System styling */}
          <Link href="/" className="px-4 py-2 bg-white text-[#26374A] border border-[#26374A] hover:bg-gray-100 hover:underline hover:text-[#16446C] focus:outline-none focus:ring-4 focus:ring-[#FFBF47] transition rounded">
            {t('common.cancel')}
          </Link>
          
          <button 
            type="submit" 
            className="px-4 py-2 bg-[#26374A] text-white border border-[#26374A] hover:bg-[#1C578A] hover:underline focus:outline-none focus:ring-4 focus:ring-[#FFBF47] transition rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('common.submitting') : t('assessment.continue')}
          </button>
        </div>
        
        {/* Instructions note */}
        <div className="bg-gc-highlight p-4 border-l-4 border-gc-info mt-6">
          <p className="mb-0">
            <strong>{t('common.note')}:</strong> {t('assessment.saveNote')}
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
