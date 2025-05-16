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
  // In a client component, we would use the useTranslation hook
  // For server component, we'll demonstrate the structure but without the hook functionality
  // const { t, language } = useTranslation();
  
  return (
    <>
      {/* Page header with gray background area - matching GC Design System */}
      <div className="bg-[#F5F5F5] w-full border-b border-[#CCCCCC] mb-8">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gc-blue">
            Risk & Compliance Self-Assessment Portal
          </h1>
          
          <div className="bg-[#FFFCEA] p-5 border-l-4 border-[#EE7100] mb-0">
            <p className="mb-2">
              <strong>Version:</strong> GC-RCP Lite (MVP 1)
            </p>
            <p>
              This portal allows Department Coordinators to complete the Treasury Board Secretariat (TBS) 
              Risk & Compliance Process assessment digitally, replacing the previous 60-page Word workbook.
            </p>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="max-w-4xl mx-auto px-4">

      {/* Action cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* New Assessment Card */}
        <div className="border border-gray-300 rounded bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-4 text-gc-blue">
            New Assessment
          </h2>
          <p className="mb-6">
            Start a new Risk & Compliance Self-Assessment for your department.
          </p>
          <div className="flex justify-end">
            <Link 
              href="/assessment/new"
              className="gc-button gc-button-primary" 
              /* Explicitly adding primary class for consistency with GC Design System */
              aria-label="Start a new risk and compliance assessment"
            >
              Start New Assessment
            </Link>
          </div>
        </div>

        {/* Continue Draft Card */}
        <div className="border border-gray-300 rounded bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-4 text-gc-blue">
            Continue Draft
          </h2>
          
          {dummyDrafts.length > 0 ? (
            <>
              <p className="mb-4 text-gc-dark-text">
                You have a draft assessment in progress. Continue where you left off.
              </p>
              <table className="w-full mb-4 text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Fiscal Year</th>
                    <th className="text-left py-2">Last Updated</th>
                    <th className="text-left py-2">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyDrafts.map(draft => (
                    <tr key={draft.id} className="border-b">
                      <td className="py-2">{draft.fiscalYear}</td>
                      <td className="py-2">{draft.updatedAt}</td>
                      <td className="py-2">Step {draft.currentStep} of 4</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end">
                <Link 
                  href={`/assessment/${dummyDrafts[0].id}`}
                  className="gc-button gc-button-primary"
                  /* Explicitly adding primary class for consistency with GC Design System */
                  aria-label="Continue working on your draft assessment"
                >
                  Continue Draft
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="mb-6 text-gc-dark-text">
                You don't have any draft assessments. Start a new assessment to begin.
              </p>
              <div className="flex justify-end">
                <span className="gc-button-secondary opacity-50 cursor-not-allowed" aria-disabled="true">
                  No Drafts Available
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Key Benefits */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gc-blue">
          Key Benefits
        </h2>
        
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Instant Calculations:</strong> Flags, maturity scores, and residual risks are calculated automatically
          </li>
          <li>
            <strong>Save & Resume:</strong> Draft capability allows you to save progress and resume later
          </li>
          <li>
            <strong>Visual Workflow:</strong> Sliding overview lets you see progress through all assessment steps
          </li>
          <li>
            <strong>Standard Output:</strong> Produces a Deputy-Head-ready PDF in the same format as the Word template
          </li>
        </ul>
      </div>

      {/* Process Steps */}
      <div>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gc-blue">
          Assessment Process
        </h2>
        
        <ol className="relative border-l border-gc-light-blue ml-3 space-y-6 pb-6">
          <li className="mb-6 ml-6">
            <div className="absolute w-4 h-4 bg-gc-light-blue rounded-full -left-2"></div>
            <h3 className="font-semibold text-lg">Answer Questions</h3>
            <p className="text-gc-dark-text">
              Complete the assessment questions across all 11 areas of focus
            </p>
          </li>
          <li className="mb-6 ml-6">
            <div className="absolute w-4 h-4 bg-gc-light-blue rounded-full -left-2"></div>
            <h3 className="font-semibold text-lg">Review Flags</h3>
            <p className="text-gc-dark-text">
              Review compliance flags and average maturity scores by area
            </p>
          </li>
          <li className="mb-6 ml-6">
            <div className="absolute w-4 h-4 bg-gc-light-blue rounded-full -left-2"></div>
            <h3 className="font-semibold text-lg">Enter Risks</h3>
            <p className="text-gc-dark-text">
              Document corporate and area-specific risks in the risk register
            </p>
          </li>
          <li className="ml-6">
            <div className="absolute w-4 h-4 bg-gc-light-blue rounded-full -left-2"></div>
            <h3 className="font-semibold text-lg">Export PDF</h3>
            <p className="text-gc-dark-text">
              Generate bilingual PDF report for Deputy Head review
            </p>
          </li>
        </ol>
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
