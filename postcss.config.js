/**
 * @file postcss.config.js
 * @description PostCSS configuration for the GC-RCP Lite application
 * 
 * This file configures PostCSS to properly process TailwindCSS and
 * related CSS directives like @apply.
 */

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
