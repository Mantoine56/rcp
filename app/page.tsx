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
import { useEffect, useState } from "react";

/**
 * Sample draft assessments (would normally come from the database)
 * TODO: Replace with real data from database
 */
const dummyDrafts = [
  { id: 1, fiscalYear: "2025-2026", createdAt: "2025-05-14", updatedAt: "2025-05-14", currentStep: 2 },
];

/**
 * Interface for assessment progress data
 */
interface AssessmentProgress {
  departmentInfo: number;
  riskAssessment: number;
  controlsAssessment: number;
  review: number;
  currentStep: number;
  // Risk assessment areas progress
  riskAreas: Record<string, number>;
}

/**
 * Home page component
 * Displays welcome message and assessment options
 */
export default function Home() {
  // Access the translation system using the useTranslation hook
  // This provides access to current language and translation function
  const { t, language } = useTranslation();
  
  // State for assessment progress
  const [assessmentProgress, setAssessmentProgress] = useState<AssessmentProgress>({
    departmentInfo: 0,
    riskAssessment: 0,
    controlsAssessment: 0,
    review: 0,
    // Initialize risk areas with sample data
    riskAreas: {
      procurement: 25,
      real_property: 10,
      financial_management: 0,
      grants_contributions: 0,
      values_ethics: 40,
      workplace_health: 0,
      security: 0,
      service: 15,
      technology: 0,
      data: 0,
    },
    currentStep: 0
  });
  
  // Simulate assessment progress retrieval from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if there's current assessment data in localStorage
      const currentStep = localStorage.getItem('rcpAssessmentCurrentStep');
      const formData = localStorage.getItem('rcpAssessmentFormData');
      
      if (currentStep && formData) {
        try {
          const parsedFormData = JSON.parse(formData);
          const step = parseInt(currentStep);
          
          // Calculate progress percentages based on data
          let progressData: AssessmentProgress = {
            departmentInfo: step >= 1 ? 100 : 0,
            riskAssessment: 0,
            controlsAssessment: 0,
            review: 0,
            currentStep: step,
            riskAreas: {
              procurement: 0,
              real_property: 0,
              financial_management: 0,
              grants_contributions: 0,
              values_ethics: 0,
              workplace_health: 0,
              security: 0,
              service: 0,
              technology: 0,
              data: 0,
            }
          };
          
          // Calculate risk assessment progress if applicable
          if (parsedFormData.riskAssessment) {
            // Basic calculation - for a real app this would be more sophisticated
            const totalAreas = 11; // Total number of assessment areas
            const areasWithData = Object.keys(parsedFormData.riskAssessment).length;
            progressData.riskAssessment = Math.min(100, Math.round((areasWithData / totalAreas) * 100));
            
            // Populate individual risk areas progress
            Object.keys(parsedFormData.riskAssessment).forEach(area => {
              if (area in progressData.riskAreas) {
                // Calculate completion percentage for each area
                // This is a simplified calculation for demo purposes
                const areaData = parsedFormData.riskAssessment[area];
                const completedQuestions = Object.keys(areaData).length;
                // Assume each area has approximately 5 questions
                progressData.riskAreas[area] = Math.min(100, Math.round((completedQuestions / 5) * 100));
              }
            });
          }
          
          setAssessmentProgress(progressData);
        } catch (error) {
          console.error('Error parsing assessment data:', error);
          
          // Fall back to mock data if something goes wrong
          setAssessmentProgress({
            departmentInfo: 100, // completed
            riskAssessment: 25,  // in progress
            controlsAssessment: 0,
            review: 0,
            currentStep: 2,      // currently on risk assessment step
            riskAreas: {
              procurement: 25,
              real_property: 10,
              financial_management: 0,
              grants_contributions: 0,
              values_ethics: 40,
              workplace_health: 0,
              security: 0,
              service: 15,
              technology: 0,
              data: 0,
            }
          });
        }
      } else {
        // No existing data, use default mock values
        setAssessmentProgress({
          departmentInfo: 100, // completed
          riskAssessment: 25,  // in progress
          controlsAssessment: 0,
          review: 0,
          currentStep: 2,      // currently on risk assessment step
          riskAreas: {
            procurement: 25,
            real_property: 10,
            financial_management: 0,
            grants_contributions: 0,
            values_ethics: 40,
            workplace_health: 0,
            security: 0,
            service: 15,
            technology: 0,
            data: 0,
          }
        });
      }
    }
  }, []);
  
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
      
      {/* Assessment Progress Card */}
      {assessmentProgress.currentStep > 0 && (
        <div className="border border-gray-300 rounded bg-white p-6 shadow-sm mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gc-blue">
            {language === 'en' ? 'Your Assessment Progress' : 'Progression de votre évaluation'}
          </h2>
          <p className="mb-4 text-gc-dark-text">
            {language === 'en' ? 'Track your progress through each assessment step.' : 'Suivez votre progression à travers chaque étape de l\'évaluation.'}
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full mb-4 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold border-b">{language === 'en' ? 'Assessment Step' : 'Étape d\'évaluation'}</th>
                  <th className="text-left py-3 px-4 font-semibold border-b">{language === 'en' ? 'Status' : 'Statut'}</th>
                  <th className="text-left py-3 px-4 font-semibold border-b">{language === 'en' ? 'Completion' : 'Achèvement'}</th>
                </tr>
              </thead>
              <tbody>
                {/* Department Information */}
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 mr-3">1</span>
                      {language === 'en' ? 'Department Information' : 'Information du département'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {assessmentProgress.departmentInfo === 100 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {language === 'en' ? 'Completed' : 'Terminé'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {language === 'en' ? 'Not Started' : 'Non commencé'}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${assessmentProgress.departmentInfo}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{assessmentProgress.departmentInfo}%</span>
                  </td>
                </tr>
                
                {/* Risk Assessment - Main Row with Dropdown Toggle */}
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center cursor-pointer" 
                         onClick={() => {
                           // Toggle dropdown for risk assessment areas
                           const element = document.getElementById('risk-areas-dropdown');
                           if (element) {
                             element.classList.toggle('hidden');
                           }
                         }}>
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 mr-3">2</span>
                      {language === 'en' ? 'Risk Assessment' : 'Évaluation des risques'}
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {assessmentProgress.riskAssessment === 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {assessmentProgress.currentStep >= 2 ? 
                          (language === 'en' ? 'In Progress' : 'En cours') : 
                          (language === 'en' ? 'Not Started' : 'Non commencé')}
                      </span>
                    ) : assessmentProgress.riskAssessment === 100 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {language === 'en' ? 'Completed' : 'Terminé'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {language === 'en' ? 'In Progress' : 'En cours'}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${assessmentProgress.riskAssessment}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{assessmentProgress.riskAssessment}%</span>
                  </td>
                </tr>
                
                {/* Risk Assessment Areas Dropdown */}
                <tr id="risk-areas-dropdown" className="hidden bg-gray-50">
                  <td colSpan={3} className="p-0">
                    <div className="px-8 py-2 border-l border-blue-100">
                      <table className="w-full text-sm">
                        <tbody>
                          {/* Procurement */}
                          <tr className="border-t border-gray-200">
                            <td className="py-2 px-4 pl-8">
                              <div className="flex items-center">
                                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-50 text-blue-800 mr-3 text-xs">2.1</span>
                                {language === 'en' ? 'Procurement' : 'Approvisionnement'}
                              </div>
                            </td>
                            <td className="py-2 px-4">
                              {assessmentProgress.riskAreas.procurement > 0 ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  {language === 'en' ? 'In Progress' : 'En cours'}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {language === 'en' ? 'Not Started' : 'Non commencé'}
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-4">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${assessmentProgress.riskAreas.procurement}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500 mt-1">{assessmentProgress.riskAreas.procurement}%</span>
                            </td>
                          </tr>
                          
                          {/* Real Property */}
                          <tr className="border-t border-gray-200">
                            <td className="py-2 px-4 pl-8">
                              <div className="flex items-center">
                                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-50 text-blue-800 mr-3 text-xs">2.2</span>
                                {language === 'en' ? 'Real Property' : 'Biens immobiliers'}
                              </div>
                            </td>
                            <td className="py-2 px-4">
                              {assessmentProgress.riskAreas.real_property > 0 ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  {language === 'en' ? 'In Progress' : 'En cours'}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {language === 'en' ? 'Not Started' : 'Non commencé'}
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-4">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${assessmentProgress.riskAreas.real_property}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500 mt-1">{assessmentProgress.riskAreas.real_property}%</span>
                            </td>
                          </tr>
                          
                          {/* Financial Management */}
                          <tr className="border-t border-gray-200">
                            <td className="py-2 px-4 pl-8">
                              <div className="flex items-center">
                                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-50 text-blue-800 mr-3 text-xs">2.3</span>
                                {language === 'en' ? 'Financial Management' : 'Gestion financière'}
                              </div>
                            </td>
                            <td className="py-2 px-4">
                              {assessmentProgress.riskAreas.financial_management > 0 ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  {language === 'en' ? 'In Progress' : 'En cours'}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {language === 'en' ? 'Not Started' : 'Non commencé'}
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-4">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${assessmentProgress.riskAreas.financial_management}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500 mt-1">{assessmentProgress.riskAreas.financial_management}%</span>
                            </td>
                          </tr>
                          
                          {/* Values & Ethics */}
                          <tr className="border-t border-gray-200">
                            <td className="py-2 px-4 pl-8">
                              <div className="flex items-center">
                                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-50 text-blue-800 mr-3 text-xs">2.4</span>
                                {language === 'en' ? 'Values & Ethics' : 'Valeurs et éthique'}
                              </div>
                            </td>
                            <td className="py-2 px-4">
                              {assessmentProgress.riskAreas.values_ethics > 0 ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  {language === 'en' ? 'In Progress' : 'En cours'}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {language === 'en' ? 'Not Started' : 'Non commencé'}
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-4">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${assessmentProgress.riskAreas.values_ethics}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500 mt-1">{assessmentProgress.riskAreas.values_ethics}%</span>
                            </td>
                          </tr>
                          
                          {/* Services */}
                          <tr className="border-t border-gray-200">
                            <td className="py-2 px-4 pl-8">
                              <div className="flex items-center">
                                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-50 text-blue-800 mr-3 text-xs">2.5</span>
                                {language === 'en' ? 'Services' : 'Services'}
                              </div>
                            </td>
                            <td className="py-2 px-4">
                              {assessmentProgress.riskAreas.service > 0 ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  {language === 'en' ? 'In Progress' : 'En cours'}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {language === 'en' ? 'Not Started' : 'Non commencé'}
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-4">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${assessmentProgress.riskAreas.service}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500 mt-1">{assessmentProgress.riskAreas.service}%</span>
                            </td>
                          </tr>
                          
                          {/* More Risk Areas Button */}
                          <tr className="border-t border-gray-200">
                            <td colSpan={3} className="py-2 px-4 text-center">
                              <Link 
                                href="/assessment/risk"
                                className="inline-block text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
                              >
                                {language === 'en' ? 'View All Risk Areas' : 'Voir toutes les zones de risque'}
                              </Link>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
                
                {/* Controls Assessment */}
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 mr-3">3</span>
                      {language === 'en' ? 'Controls Assessment' : 'Évaluation des contrôles'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {assessmentProgress.currentStep >= 3 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {language === 'en' ? 'In Progress' : 'En cours'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {language === 'en' ? 'Not Started' : 'Non commencé'}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${assessmentProgress.controlsAssessment}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{assessmentProgress.controlsAssessment}%</span>
                  </td>
                </tr>
                
                {/* Review & Submit */}
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 mr-3">4</span>
                      {language === 'en' ? 'Review & Submit' : 'Révision et soumission'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {assessmentProgress.currentStep >= 4 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {language === 'en' ? 'In Progress' : 'En cours'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {language === 'en' ? 'Not Started' : 'Non commencé'}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${assessmentProgress.review}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{assessmentProgress.review}%</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-end">
            <Link 
              href={`/assessment/${assessmentProgress.currentStep === 1 ? 'new' : 
                     assessmentProgress.currentStep === 2 ? 'risk' : 
                     assessmentProgress.currentStep === 3 ? 'controls' : 'review'}`}
              className="gc-button gc-button-primary inline-block px-6 py-2 rounded"
              aria-label="Continue assessment"
            >
              {language === 'en' ? 'Continue Assessment' : 'Continuer l\'évaluation'}
            </Link>
          </div>
        </div>
      )}

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
