/**
 * @file page.tsx
 * @description Home page for the GC-RCP Lite application
 * 
 * This page serves as the entry point for users to start a new assessment
 * or continue a draft assessment. It follows the Canada.ca WET styling guidelines
 * and provides bilingual support.
 */

'use client'

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import Details from "@/components/wet/Details";

/**
 * Sample draft assessments (would normally come from the database)
 * TODO: Replace with real data from database
 */
const dummyDrafts = [
  { id: 1, fiscalYear: "2025-2026", createdAt: "2025-05-14", updatedAt: "2025-05-14", currentStep: 2 },
];

/**
 * Home page component
 * Displays welcome message and assessment options
 */
export default function Home() {
  // Access the translation system using the useTranslation hook
  // This provides access to current language and translation function
  const { t, language } = useTranslation();
  
  return (
    <>
      {/* Page header with clean white background for better cohesiveness */}
      <div className="w-full border-b border-[#CCCCCC] mb-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gc-blue">
            {t('app.subtitle')}
          </h1>
          
          {/* Notice box with improved styling - softer colors and modern shadow */}
          <div className="bg-blue-50 p-5 border-l-4 border-gc-blue rounded shadow-sm mb-0">
            <p className="mb-2">
              <strong>{t('app.version')}:</strong> GC-RCP Lite (MVP 1)
            </p>
            <p className="text-gc-dark-text">
              {t('app.description')}
            </p>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="max-w-4xl mx-auto px-4">

      {/* Action cards with improved alignment and consistent heights */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* New Assessment Card */}
        <div className="border border-gray-300 rounded bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
          <div className="flex-grow">
            <h2 className="text-xl font-semibold mb-4 text-gc-blue">
              {t('home.newAssessment')}
            </h2>
            <p className="mb-6 text-gc-dark-text">
              {t('home.newAssessment.description')}
            </p>
          </div>
          <div className="mt-auto pt-4 flex justify-end">
            <Link 
              href="/assessment/new"
              className="gc-button gc-button-primary inline-block px-6 py-2 rounded" 
              /* Added explicit styling for better visual consistency */
              aria-label="Start a new risk and compliance assessment"
            >
              {t('home.newAssessment.button')}
            </Link>
          </div>
        </div>

        {/* Continue Draft Card */}
        <div className="border border-gray-300 rounded bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
          <div className="flex-grow">
            <h2 className="text-xl font-semibold mb-4 text-gc-blue">
              {t('home.continueDraft')}
            </h2>
            
            {dummyDrafts.length > 0 ? (
              <>
                <p className="mb-4 text-gc-dark-text">
                  {t('home.continueDraft.description')}
                </p>
                <table className="w-full mb-4 text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">{t('home.table.fiscalYear')}</th>
                      <th className="text-left py-2">{t('home.table.lastUpdated')}</th>
                      <th className="text-left py-2">{t('home.table.progress')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dummyDrafts.map(draft => (
                      <tr key={draft.id} className="border-b">
                        <td className="py-2">{draft.fiscalYear}</td>
                        <td className="py-2">{draft.updatedAt}</td>
                        <td className="py-2">{t('home.table.stepOf', { current: draft.currentStep.toString(), total: '4' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <p className="mb-6 text-gc-dark-text">
                {t('home.noDrafts')}
              </p>
            )}
          </div>
          <div className="mt-auto pt-4 flex justify-end">
            {dummyDrafts.length > 0 ? (
              <Link 
                href={`/assessment/${dummyDrafts[0].id}`}
                className="gc-button gc-button-primary inline-block px-6 py-2 rounded"
                /* Added explicit styling for better visual consistency */
                aria-label="Continue working on your draft assessment"
              >
                {t('home.continueDraft.button')}
              </Link>
            ) : (
              <span className="gc-button-secondary opacity-50 cursor-not-allowed inline-block px-6 py-2 rounded" aria-disabled="true">
                {t('home.noDrafts.button')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Key Benefits - Using GCDS Details Component */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gc-blue">
          {t('home.keyBenefits')}
        </h2>
        
        {/* 
          Details component for Key Benefits
          - Provides expandable/collapsible view of the benefits
          - Improves user experience by organizing information
          - Follows accessibility guidelines with proper labeling
        */}
        <Details 
          summary={t('home.keyBenefits.summary')}
          id="key-benefits-details"
        >
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              {t('home.keyBenefits.calculations')}
            </li>
            <li>
              {t('home.keyBenefits.save')}
            </li>
            <li>
              {t('home.keyBenefits.workflow')}
            </li>
            <li>
              {t('home.keyBenefits.output')}
            </li>
          </ul>
        </Details>
      </div>

      {/* Process Steps - Using GCDS Details Component */}
      <div>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gc-blue">
          {t('home.assessmentProcess')}
        </h2>
        
        {/* 
          Details component for Assessment Process
          - Provides expandable/collapsible view of the process steps
          - Improves user experience by providing information on demand
          - Follows accessibility guidelines with proper labeling
        */}
        <Details 
          summary={t('home.assessmentProcess.summary')} 
          id="assessment-process-details"
          open={true} // Open by default to highlight the process steps
        >
          <ol className="relative border-l border-gc-light-blue ml-3 space-y-6 pb-6 mt-4">
            <li className="mb-6 ml-6">
              <div className="absolute w-4 h-4 bg-gc-light-blue rounded-full -left-2"></div>
              <h3 className="font-semibold text-lg">{t('home.assessmentProcess.step1.title')}</h3>
              <p className="text-gc-dark-text">
                {t('home.assessmentProcess.step1.description')}
              </p>
            </li>
            <li className="mb-6 ml-6">
              <div className="absolute w-4 h-4 bg-gc-light-blue rounded-full -left-2"></div>
              <h3 className="font-semibold text-lg">{t('home.assessmentProcess.step2.title')}</h3>
              <p className="text-gc-dark-text">
                {t('home.assessmentProcess.step2.description')}
              </p>
            </li>
            <li className="mb-6 ml-6">
              <div className="absolute w-4 h-4 bg-gc-light-blue rounded-full -left-2"></div>
              <h3 className="font-semibold text-lg">{t('home.assessmentProcess.step3.title')}</h3>
              <p className="text-gc-dark-text">
                {t('home.assessmentProcess.step3.description')}
              </p>
            </li>
            <li className="ml-6">
              <div className="absolute w-4 h-4 bg-gc-light-blue rounded-full -left-2"></div>
              <h3 className="font-semibold text-lg">{t('home.assessmentProcess.step4.title')}</h3>
              <p className="text-gc-dark-text">
                {t('home.assessmentProcess.step4.description')}
              </p>
            </li>
          </ol>
        </Details>
      </div>

      {/* Developer comments (these won't appear in the UI) */}
      {/* 
        This home page demonstrates key Canada.ca WET features:
        - Follows GC typography standards with proper heading hierarchy
        - Uses GC color palette for visual elements
        - Implements accessible, properly labeled interactive elements
        - Structured content with clear information hierarchy
        - Will implement bilingual support via the language context
      */}
    </div>
    {/* End of main content container */}
  </>  /* End of Fragment */
  );
  /* Note: We're using React Fragment (<></>) to allow multiple top-level elements
     - The gray header area with full width background
     - The main content container with max width */
}
