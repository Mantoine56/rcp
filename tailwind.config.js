/** 
 * @file tailwind.config.js
 * @description Tailwind CSS configuration with Canada.ca color palette and typography
 * This configuration extends Tailwind with Government of Canada Web Experience Toolkit (WET)
 * color schemes and design tokens
 */

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Official Government of Canada FIP colors
        'gc-red': '#B1001C',                // Main GC brand red
        'gc-blue': '#26374A',               // Main GC brand blue
        'gc-nav-blue': '#284162',           // Navigation blue
        'gc-light-blue': '#335075',         // Light blue variation
        'gc-visited-link': '#7834BC',       // Visited link color
        'gc-dark-text': '#333333',          // Default text color
        'gc-footer-bg': '#F8F8F8',          // Footer background
        'gc-footer-text': '#284162',        // Footer text
        'gc-highlight': '#FFFCEA',          // Information highlight
        'gc-success': '#278400',            // Success green
        'gc-info': '#269ABC',               // Information blue
        'gc-warning': '#EE7100',            // Warning orange
        'gc-error': '#D3080C',              // Error/danger red
        'gc-disabled': '#CCCCCC',           // Disabled element color
        'gc-primary-accent': '#333333',     // Primary accent color
        'gc-primary-button': '#335075',     // Primary button color
      },
      fontFamily: {
        // GC Web standard fonts
        'sans': ['Noto Sans', 'Helvetica', 'Arial', 'sans-serif'],
        'serif': ['Lato', 'serif'],
      },
      spacing: {
        'gc-header': '198px',               // Standard GC header height
        'gc-footer': '100px',               // Standard GC footer height
        'gc-container': '1200px',           // Standard GC container width
      },
      borderRadius: {
        'gc-standard': '4px',               // Standard GC border radius
      },
      boxShadow: {
        'gc-standard': '0 2px 3px rgba(0, 0, 0, 0.1)',  // Standard GC shadow
      },
    },
  },
  plugins: [],
}
