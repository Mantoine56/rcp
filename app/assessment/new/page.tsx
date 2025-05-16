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

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';

// Import custom components
import FormSection from '@/components/forms/FormSection';
import FormInput from '@/components/forms/FormInput';
import { useTranslation } from '@/lib/i18n';

/**
 * Form validation schema
 * Defines the required fields and validation rules for the form
 */
const formSchema = z.object({
  departmentName: z.string().min(2, 'Department name is required'),
  departmentAcronym: z.string().min(2, 'Department acronym is required'),
  fiscalYear: z.string().regex(/^\d{4}-\d{4}$/, 'Fiscal year must be in YYYY-YYYY format'),
  coordinatorName: z.string().min(2, 'Coordinator name is required'),
  coordinatorEmail: z.string().email('Please enter a valid email address'),
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
  
  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departmentName: '',
      departmentAcronym: '',
      fiscalYear: '2025-2026', // Default to current fiscal year
      coordinatorName: '',
      coordinatorEmail: '',
    },
  });
  
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
        <div className="bg-gc-light-grey p-4 rounded mb-6">
          <p className="font-semibold mb-2">{t('assessment.stepIndicator')}</p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-gc-blue text-white px-3 py-1 rounded-full text-sm">
              {t('assessment.step', { number: '1' })}
            </span>
            <span className="bg-gc-light-text text-gc-dark-text border border-gc-border px-3 py-1 rounded-full text-sm">
              {t('assessment.step', { number: '2' })}
            </span>
            <span className="bg-gc-light-text text-gc-dark-text border border-gc-border px-3 py-1 rounded-full text-sm">
              {t('assessment.step', { number: '3' })}
            </span>
            <span className="bg-gc-light-text text-gc-dark-text border border-gc-border px-3 py-1 rounded-full text-sm">
              {t('assessment.step', { number: '4' })}
            </span>
          </div>
        </div>
      </div>
      
      {/* Department information form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormSection
          title={t('assessment.departmentInfo.title')}
          subtitle={t('assessment.departmentInfo.subtitle')}
          sectionId="department-info"
          helpText={t('assessment.departmentInfo.helpText')}
        >
          {/* Department name */}
          <FormInput
            id="departmentName"
            label={t('assessment.departmentInfo.departmentName')}
            required
            error={errors.departmentName?.message}
            {...register('departmentName')}
          />
          
          {/* Department acronym */}
          <FormInput
            id="departmentAcronym"
            label={t('assessment.departmentInfo.departmentAcronym')}
            required
            maxLength={10}
            showCharacterCount
            error={errors.departmentAcronym?.message}
            {...register('departmentAcronym')}
          />
          
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
        
        {/* Coordinator information */}
        <FormSection
          title={t('assessment.coordinatorInfo.title')}
          sectionId="coordinator-info"
        >
          {/* Coordinator name */}
          <FormInput
            id="coordinatorName"
            label={t('assessment.coordinatorInfo.name')}
            required
            error={errors.coordinatorName?.message}
            {...register('coordinatorName')}
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
        </FormSection>
        
        {/* Form actions */}
        <div className="flex justify-between mt-8 mb-4">
          <Link href="/" className="gc-button-secondary">
            {t('common.cancel')}
          </Link>
          
          <button 
            type="submit" 
            className="gc-button"
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
