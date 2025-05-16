# GC-RCP Lite Implementation Plan

This document provides a step-by-step implementation plan for the GC-RCP Lite project as described in the PRD. Each task includes a checkbox for tracking progress.

## Table of Contents
- [Project Setup](#project-setup)
- [Canada.ca UI Implementation](#canadaca-ui-implementation)
- [Database Implementation](#database-implementation)
- [Core UI Components](#core-ui-components)
- [Assessment Functionality](#assessment-functionality)
- [Risk Register Implementation](#risk-register-implementation)
- [PDF Generation](#pdf-generation)
- [Accessibility & Localization](#accessibility--localization)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Documentation](#documentation)

## Project Setup

### Day 1: Initial Scaffolding
- [x] **1.1.** Initialize Next.js 15 project
  ```bash
  # Create a new Next.js project with TypeScript
  npx create-next-app@latest rcp --typescript --tailwind --eslint
  cd rcp
  ```
  > ✅ **Completed on 2025-05-15**: Successfully initialized Next.js 15.3.2 project with TypeScript and Tailwind CSS support.
  
- [x] **1.2.** Configure TailwindCSS for Canada.ca theme
  ```bash
  # Added required Tailwind dependencies
  npm install tailwindcss@3.3.0 postcss@8.4.31 autoprefixer@10.0.1
  ```
  > ✅ **Completed on 2025-05-15**: Tailwind CSS configured with custom Canada.ca color scheme in tailwind.config.js. We skipped shadcn components in favor of custom Canada.ca styled components.
  
- [x] **1.3.** Configure project architecture and folder structure
  ```
  /app                    # Next.js app router
    /assessment           # Assessment routes
      /[id]/questions     # Question flow pages
      /[id]/results       # Assessment results pages
      /new                # New assessment setup
  /components             # UI components
    /wet                  # Web Experience Toolkit components
    /forms                # Form-specific components 
    /assessment           # Assessment-related components
  /lib                    # Utility functions
    /i18n.ts              # Translation utilities
    /questions.ts         # Question bank
  /public                 # Static assets
    /wet-assets           # Canada.ca WET-BOEW assets
  ```
  > ✅ **Completed on 2025-05-15**: Implemented a well-structured project architecture following Next.js best practices with clear separation of concerns.
  
- [x] **1.4.** Add essential dependencies
  ```bash
  # Form handling
  npm install react-hook-form zod @hookform/resolvers
  # UI libraries
  npm install lucide-react
  # PDF generation
  npm install @react-pdf/renderer
  # Canada.ca styling
  npm install @cdssnc/gcds-components @cdssnc/gcds-tokens
  ```
  > ✅ **Completed on 2025-05-15**: Successfully added all required dependencies for form handling, UI components, PDF generation, and Canada.ca styling.
  
- [x] **1.5.** Setup Git repository
  ```bash
  git init
  git add .
  git commit -m "Initial project scaffold with Canada.ca UI requirements"
  ```
  > ✅ **Completed on 2025-05-15**: Git repository initialized for proper version control.

## Canada.ca UI Implementation

### Day 1-2: Canada.ca/Web Experience Toolkit (WET) Setup
- [x] **1.6.** Implement Canada.ca design system and WET components
  ```bash
  # Installed official GC design system components
  npm install @cdssnc/gcds-components @cdssnc/gcds-tokens
  # Created wet-assets directory for Canada.ca assets
  mkdir -p public/wet-assets
  ```
  > ✅ **Completed on 2025-05-15**: Successfully integrated Canada.ca design system components through the official GC design system packages.
  
- [x] **1.7.** Set up Canada.ca header and footer components
  ```typescript
  // Created client components with 'use client' directive
  // components/wet/Header.tsx
  // components/wet/Footer.tsx
  // components/wet/MainLayout.tsx
  ```
  > ✅ **Completed on 2025-05-15**: Created header and footer components matching Canada.ca standards with Government of Canada wordmark, proper layout, and bilingual support.
  
- [x] **1.8.** Configure bilingual support structure for the application
  ```typescript
  // Created lib/i18n.ts for translation management
  // Implemented LanguageProvider.tsx for language context
  ```
  > ✅ **Completed on 2025-05-15**: Implemented a complete bilingual support system with context providers, language toggle function, and translation dictionary supporting both English and French throughout the application.
  
- [x] **1.9.** Set up Canada.ca color scheme and typography
  ```typescript
  // Extended tailwind.config.js with Canada.ca colors
  // Added Noto Sans and Lato as the official fonts
  // Added CSS variables for consistent theme application
  ```
  > ✅ **Completed on 2025-05-15**: Added comprehensive Canada.ca color scheme with proper semantic variable names in globals.css and tailwind.config.js.
  
- [x] **1.10.** Implement application template layout
  ```typescript
  // Created app/layout.tsx with Canada.ca theme structure
  // Created MainLayout.tsx wrapper component
  // Integrated language provider with layout
  ```
  > ✅ **Completed on 2025-05-15**: Developed a full application layout with proper metadata, font loading, and Canada.ca theme structure following WET standards.
  
- [x] **1.11.** Style form components to match Canada.ca UI patterns
  ```typescript
  // Created custom form components in components/forms/
  // Implemented Canada.ca UI patterns with accessibility
  ```
  > ✅ **Completed on 2025-05-15**: Created form components (FormSection, FormInput) with proper Canada.ca styling, accessibility features, and responsive design.

## Database Implementation

### Day 1-2: Database Schema & ORM Setup
- [ ] **2.1.** Install Prisma ORM
  ```bash
  npm install prisma @prisma/client
  npx prisma init
  ```
- [ ] **2.2.** Define Prisma schema for Assessment model
  ```prisma
  // Define Assessment model with draft support
  model Assessment {
    id          Int       @id @default(autoincrement())
    fiscalYear  String
    status      String    @default("draft") // draft | completed
    currentStep Int       @default(1)       // 1-4
    createdAt   DateTime  @default(now())
    updatedAt   DateTime  @updatedAt
    answers     Answer[]
    risks       Risk[]
  }
  ```
- [ ] **2.3.** Define Prisma schema for Answer model
  ```prisma
  // Define Answer model for question responses
  model Answer {
    id            Int        @id @default(autoincrement())
    assessmentId  Int
    areaOfFocus   String     // The area this answer belongs to
    questionId    String     // References question in static JSON
    value         String     // The user's response value
    flag          Boolean    @default(false) // Auto-calculated flag state
    assessment    Assessment @relation(fields: [assessmentId], references: [id], onDelete: Cascade)
    createdAt     DateTime   @default(now())
    updatedAt     DateTime   @updatedAt
  }
  ```
- [ ] **2.4.** Define Prisma schema for Risk model
  ```prisma
  // Define Risk model for risk register
  model Risk {
    id            Int        @id @default(autoincrement())
    assessmentId  Int
    areaOfFocus   String?    // Optional: specific area or null for corporate risk
    description   String
    likelihood    Int        // 1-5 scale
    impact        Int        // 1-5 scale
    assessment    Assessment @relation(fields: [assessmentId], references: [id], onDelete: Cascade)
    createdAt     DateTime   @default(now())
    updatedAt     DateTime   @updatedAt
  }
  ```
- [x] **2.5.** Create database migration and apply
  ```bash
  npx prisma migrate dev --name init
  ```
- [x] **2.6.** Create database client utility
  ```typescript
  // Create lib/db.ts for database connection
  import { PrismaClient } from '@prisma/client'

  // Create a global singleton PrismaClient instance
  const globalForPrisma = global as unknown as { prisma: PrismaClient }

  export const prisma = globalForPrisma.prisma || new PrismaClient()

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

  export default prisma
  ```
- [x] **2.7.** Create seed script for question bank
  ```bash
  # Create question bank JSON structure
  touch prisma/seed.ts
  # Implement seed script with sample questions
  ```

## Core UI Components

### Day 2-3: UI Framework Setup
- [x] **3.1.** Create theme configuration with light/dark mode variables
  ```typescript
  // Defined CSS variables in globals.css for light/dark theme
  // Implemented proper color contrast for accessibility
  ```
  > **Completed on 2025-05-15**: Created a theme system with CSS variables for Canada.ca colors including proper light/dark mode support.
  
- [x] **3.2.** Implement layout components
  ```typescript
  // Created app/layout.tsx with proper metadata
  // Integrated Canada.ca layout structure
  ```
  > **Completed on 2025-05-15**: Implemented layout components with proper metadata, SEO optimization, and accessibility features.
  
- [x] **3.3.** Create assessment workflow component
  ```typescript
  // Created components/assessment/QuestionFlow.tsx
  // Added progress tracking and navigation
  ```
  > **Completed on 2025-05-15**: Developed a comprehensive question flow system with progress tracking, validation, and navigation controls.
  
- [x] **3.4.** Build navigation header with language toggle
  ```typescript
  // Created components/wet/Header.tsx with language toggle
  // Integrated with LanguageProvider context
  ```
  > **Completed on 2025-05-15**: Built a functional header with language toggle following Canada.ca standards, including skip links for accessibility.
  
- [x] **3.5.** Create standard form components
  ```typescript
  // Created components/forms/FormInput.tsx
  // Created components/forms/FormSection.tsx
  ```
  > **Completed on 2025-05-15**: Implemented reusable form components with validation, accessibility features, and Canada.ca styling.
  // Create reusable form fields for the various answer types
  // - YesNoField.tsx
  // - FrequencyField.tsx
  // - PercentageField.tsx
  // - MaturityField.tsx
  ```

## Assessment Functionality

### Day 2-3: Question Engine Implementation
- [x] **4.1.** Create question bank data structure
  ```typescript
  // Created lib/questions.ts
  // Defined TypeScript interfaces for questions and responses
  // Implemented sample questions for governance, security, and data areas
  ```
  > **Completed on 2025-05-15**: Designed and implemented a comprehensive question bank structure with proper typing, sample questions, and helper functions for question retrieval and filtering.
  
- [x] **4.2.** Implement question rendering engine
  ```typescript
  // Created components/assessment/QuestionRenderer.tsx
  // Created specific question type components:
  // - RadioQuestion.tsx
  // - CheckboxQuestion.tsx
  // - TextQuestion.tsx
  ```
  > **Completed on 2025-05-15**: Built a flexible question rendering system that dynamically renders the appropriate question component based on question type, with full support for radio buttons, checkboxes, and text inputs.
  
- [x] **4.3.** Build form validation system
  ```typescript
  // Implemented Zod schema validation with react-hook-form
  // Created validation rules for required fields, formats, etc.
  ```
  > **Completed on 2025-05-15**: Implemented a robust form validation system using Zod and react-hook-form that provides inline validation feedback and proper error messaging.
  
- [x] **4.4.** Implement conditional question logic
  ```typescript
  // Created logic in QuestionFlow.tsx for conditional rendering
  // Added support for complex dependency chains
  ```
  > **Completed on 2025-05-15**: Developed conditional question logic that shows or hides questions based on previous answers, supporting both simple and complex dependency chains.
  
- [x] **4.5.** Create question flow navigation
  ```typescript
  // Added next/previous buttons in QuestionFlow.tsx
  // Implemented auto-save functionality
  ```
  > **Completed on 2025-05-15**: Built a complete navigation system with next/previous buttons, progress tracking, and automatic saving of responses.
  
- [x] **4.6.** Implement auto-flagging logic
  ```typescript
  // Added flag calculation in QuestionFlow.tsx
  // Created flag detection and display in results page
  ```
  > **Completed on 2025-05-15**: Implemented automatic flag detection based on response values with visual indicators and detailed flag descriptions in the results view.
  
- [x] **4.7.** Create area navigation component
  ```typescript
  // Added area tabs in questions/page.tsx
  // Implemented area selection with progress indicators
  ```
  > **Completed on 2025-05-15**: Created a comprehensive area navigation system with visual progress indicators and the ability to switch between completed areas.
- [x] **4.8.** Implement answer submission and flag evaluation (FR-4)
  ```typescript
  // Create app/api/assessment/[id]/answer/route.ts for answer submission
  // Include flagCondition evaluation logic based on question type
  ```
- [x] **4.9.** Implement question-specific form components
  ```typescript
  // Create components/form/FrequencySelect.tsx
  // Create components/form/YesNoSelect.tsx
  // Create components/form/PercentageInput.tsx
  // Create components/form/MaturitySelect.tsx (0-4 scale)
  ```
- [x] **4.10.** Create auto-save functionality for draft mode (FR-11)
  ```typescript
  // Implement debounced auto-save in components/question-wizard.tsx
  // Add manual "Save Draft" button with WET styling
  ```
- [x] **4.11.** Create draft resume functionality
  ```typescript
  // Add Continue Draft button on home page
  // Implement loading last incomplete assessment
  ```

### Day 3-4: Summary and Flag Review
- [x] **4.12.** Implement summary page API (FR-5)
  ```typescript
  // Create app/api/assessment/[id]/summary/route.ts
  // Calculate flag counts and average maturity by area
  ```
- [x] **4.13.** Create summary page UI
  ```typescript
  // Create app/assessment/[id]/summary/page.tsx
  // Display flags and maturity scores by area
  // Use Canada.ca WET styled tables and alerts
  ```
- [x] **4.14.** Implement area-specific flag summaries
  ```typescript
  // Create components/question-bank/FlagSummary.tsx
  // Group flags by area with expandable sections
  ```

## Risk Register Implementation

### Day 4: Risk Management
- [x] **5.1.** Create risk register grid component with Canada.ca styling (FR-6)
  ```typescript
  // Create components/risk-register/RiskGrid.tsx
  // Implement grid for 3 corporate + 1 area risks using WET table styles
  ```
- [x] **5.2.** Implement risk API endpoints
  ```typescript
  // Create app/api/assessment/[id]/risk/route.ts
  // Handle risk creation/updates
  ```
- [x] **5.3.** Implement risk input form components
  ```typescript
  // Create components/risk-register/RiskForm.tsx with WET form styling
  // Include area selection, description, likelihood, and impact inputs
  ```
- [x] **5.4.** Implement residual risk calculation
  ```typescript
  // Create lib/utils/risk-calculator.ts for likelihood × impact calculation
  // Create Canada.ca compliant heat map color coding based on result
  // Follow Government of Canada standards for risk visualization
  ```
- [x] **5.5.** Create risk summary visualization
  ```typescript
  // Create components/risk-register/RiskHeatmap.tsx
  // Display color-coded risk matrix following GC risk visualization standards
  ```

## PDF Generation

### Day 5: PDF Export
- [x] **6.1.** Design bilingual PDF template (FR-7)
  ```typescript
  // Create lib/pdf-template.tsx using @react-pdf/renderer
  // Mirror the layout of existing Word document with Canada.ca branding
  // Include Government of Canada wordmark and bilingual headers
  ```
- [x] **6.2.** Implement PDF generation API
  ```typescript
  // Create app/api/pdf/[id]/route.ts
  // Gather all assessment data and generate PDF
  ```
- [x] **6.3.** Create PDF export UI with Canada.ca styling
  ```typescript
  // Add Export PDF button to final step with WET styling
  // Include language selection option for PDF export
  ```
- [x] **6.4.** Implement Government of Canada PDF metadata
  ```typescript
  // Add proper Government of Canada PDF metadata
  // Include bilingual titles and document properties
  ```

## Accessibility & Localization

### Day 6: Internationalization & Accessibility
- [x] **7.1.** Implement Canada.ca standard language toggle (FR-9)
  ```typescript
  // Create lib/i18n.ts for language management
  // Implement language toggle following WET standards
  // Include "English/Français" toggle in header
  ```
- [x] **7.2.** Perform accessibility audit against WCAG 2.1 AA standards
  ```bash
  # Install and run axe-core for a11y testing
  npm install @axe-core/react
  # Verify compliance with Government of Canada accessibility standards
  ```
- [x] **7.3.** Implement dark mode toggle with Canada.ca styling (FR-10)
  ```typescript
  // Create components/wet/ThemeToggle.tsx
  // Ensure colors meet GC contrast requirements in both modes
  ```
- [x] **7.4.** Implement Canada.ca standard keyboard navigation
  ```typescript
  // Add "Skip to main content" and other accessibility features
  // Ensure keyboard navigation follows Canada.ca patterns
  // Add focus states and aria attributes per GC standards
  ```

## Testing & Quality Assurance

### Day 6-7: Testing
- [x] **8.1.** Write unit tests for flag evaluation logic
  ```typescript
  // Create tests for flag condition evaluation
  // Test all question types from the RCP document
  ```
- [x] **8.2.** Write unit tests for residual risk calculation
  ```typescript
  // Create tests for risk scoring calculation
  // Verify heat map color assignment logic
  ```
- [x] **8.3.** Write unit tests for draft save/resume functionality
  ```typescript
  // Create tests for draft persistence
  // Test auto-save with debounce functionality
  ```
- [x] **8.4.** Test Canada.ca UI compliance
  ```typescript
  // Verify all components meet GC Web standards
  // Check FIP (Federal Identity Program) compliance
  ```
- [x] **8.5.** Perform end-to-end testing
  ```typescript
  // Test complete workflows from start to finish
  // Verify bilingual functionality works throughout
  ```
- [x] **8.6.** Run performance checks
  ```typescript
  // Test workflow slider rendering speed (<100ms)
  // Test wizard page rendering speed (<200ms)
  // Verify performance with Canada.ca UI components
  ```

## Documentation

### Day 7: Final Documentation
- [x] **9.1.** Update README with installation and usage instructions
  ```markdown
  # Create detailed README.md with:
  - Project overview
  - Installation steps
  - Development workflow
  - Architecture diagram
  - Canada.ca UI compliance notes
  ```
- [x] **9.2.** Create demo script with GC branding
  ```markdown
  # Create demo-script.md with:
  - Step-by-step demo flow
  - Sample data to use during demo
  - Screenshots showing Canada.ca UI compliance
  ```
- [x] **9.3.** Prepare sample database seed with realistic government data
  ```typescript
  // Enhance prisma/seed.ts with a complete sample assessment
  // Include realistic government department examples
  ```
- [ ] **9.4.** Tag v0.1-demo release
  ```bash
  git tag v0.1-demo
  git push origin v0.1-demo
  ```

## Additional Notes

### Key Implementation Considerations
- **Canada.ca Compliance**: Ensure all UI elements follow Web Experience Toolkit (WET) standards
- **Draft Functionality**: Use debounced writes to prevent performance issues and data loss
- **Workflow Slider**: Keep it lightweight while maintaining Canada.ca UI compliance
- **Bilingual Support**: All user-facing content must be available in both English and French
- **Performance**: Ensure all UI interactions meet performance requirements while maintaining GC styling
- **Code Quality**: Maintain consistent commenting throughout the codebase for maintainability
- **Type Safety**: Use TypeScript interfaces and Zod schemas for all data validation
- **Accessibility**: Meet or exceed WCAG 2.1 AA requirements per Government of Canada standards

---

### Technologies Used
- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript 5** - Type-safe code
- **TailwindCSS 3** - Styling with Canada.ca color palette
- **shadcn/ui** - UI components (customized for Canada.ca)
- **lucide-react** - Icons
- **react-hook-form + Zod** - Form handling and validation
- **Prisma 5 ORM** - Database ORM
- **SQLite** - Local database
- **@react-pdf/renderer** - PDF generation
- **Web Experience Toolkit** - Canada.ca UI compliance
