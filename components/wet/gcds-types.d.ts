/**
 * @file gcds-types.d.ts
 * @description Type declarations for GC Design System web components
 * 
 * This file extends the JSX.IntrinsicElements interface to include
 * the custom elements from the GCDS library, resolving TypeScript errors
 * when using these components in TSX files.
 */

// Extend the JSX namespace to include GCDS components
declare namespace JSX {
  interface IntrinsicElements {
    // Add GCDS components here
    'gcds-details': DetailsTags;
    'gcds-button': ButtonTags;
    'gcds-header': HeaderTags;
    'gcds-footer': FooterTags;
    // Add more GCDS components as needed
  }
}

// Type definitions for the details component attributes
interface DetailsTags extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  lang?: string;
  open?: boolean;
  id?: string;
  className?: string;
}

// Type definitions for the button component attributes
interface ButtonTags extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  lang?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'link';
  disabled?: boolean;
}

// Type definitions for the header component attributes
interface HeaderTags extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  lang?: string;
  'skip-to-nav'?: string;
  'skip-to-content'?: string;
}

// Type definitions for the footer component attributes
interface FooterTags extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  lang?: string;
  contextual?: boolean;
}
