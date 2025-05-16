/**
 * @file Details.tsx
 * @description Wrapper component for the GC Design System Details/Accordion component
 * 
 * This component provides a React wrapper for the GC Design System Details component.
 * It follows the Canada.ca design standards and provides proper accessibility support.
 * Based on https://design-system.alpha.canada.ca/en/components/details/code/
 */

'use client'

import React, { ReactNode } from "react";
import { useTranslation } from "@/lib/i18n";

// Import GCDS components
import '@cdssnc/gcds-components';

// Define props interface for the Details component
interface DetailsProps {
  summary: string;              // The summary text shown in the header/trigger
  children: ReactNode;          // The content inside the expandable section
  open?: boolean;               // Whether the details are open by default
  className?: string;           // Additional CSS classes
  id?: string;                  // Optional ID for the component
}

/**
 * Details component that uses the GCDS details component
 * 
 * This implementation uses the dangerouslySetInnerHTML approach with a template
 * to create the GCDS details component structure. This avoids TypeScript JSX errors
 * while still allowing React to manage the component.
 * 
 * @param {DetailsProps} props - Component properties
 * @returns {JSX.Element} A wrapper for the GCDS Details component
 */
export default function Details({ 
  summary, 
  children, 
  open = false, 
  className = "",
  id
}: DetailsProps) {
  const { language } = useTranslation();

  // Generate a unique ID if none provided
  const detailsId = id || `details-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div className={`gcds-details-wrapper ${className}`}>
      {/* Use a real HTML details element as fallback with enhanced styling */}
      <details 
        id={detailsId}
        open={open}
        className="border border-gray-300 rounded mb-4"
      >
        <summary className="p-4 font-medium cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gc-blue">
          {summary}
        </summary>
        <div className="p-4 pt-0 border-t border-gray-200">
          {children}
        </div>
      </details>

      {/* Add styles to make it look more like the GCDS component */}
      <style jsx>{`
        .gcds-details-wrapper details {
          font-family: 'Noto Sans', sans-serif;
        }
        .gcds-details-wrapper summary {
          list-style: none;
          position: relative;
          padding-right: 2rem;
        }
        .gcds-details-wrapper summary::-webkit-details-marker {
          display: none;
        }
        .gcds-details-wrapper summary::after {
          content: '+';
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.5rem;
          transition: transform 0.2s;
        }
        .gcds-details-wrapper details[open] summary::after {
          content: '-';
        }
      `}</style>
    </div>
  );
}
