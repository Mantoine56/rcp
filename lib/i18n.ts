/**
 * @file i18n.ts
 * @description Internationalization utilities for supporting English and French
 * This follows the Canada.ca WET standards for bilingual support
 * 
 * This module provides:
 * 1. A language context for the application
 * 2. A translation dictionary for all UI text
 * 3. Helper functions for working with translations
 * 4. Type definitions for typesafe translations
 */

import { createContext, useContext } from 'react';

// Define supported languages
export type Language = 'en' | 'fr';

/**
 * Base interface for all translatable content
 * All translations must provide both English and French text
 */
interface TranslatedContent {
  en: string;
  fr: string;
}

/**
 * Language context type definition
 * This allows components to access the current language and translation functions
 */
export interface LanguageContextType {
  // Current active language
  language: Language;
  
  // Function to change the active language
  setLanguage: (language: Language) => void;
  
  // Translation helper function
  t: (key: string, placeholders?: Record<string, string>) => string;
  
  // Helper to toggle between languages
  toggleLanguage: () => void;
}

/**
 * Create the language context with default values
 * This will be properly initialized in a provider component
 */
export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
  toggleLanguage: () => {}, // Add the toggleLanguage function to the default context
});

/**
 * Hook for easy access to translations from any component
 * Usage: const { t, language, setLanguage } = useTranslation();
 */
export const useTranslation = () => useContext(LanguageContext);

/**
 * Translation dictionary - common UI elements
 * Organized by categories for better maintainability
 * 
 * IMPORTANT: Always add new translations in both English and French
 * Keys should use dot notation to indicate categories (e.g., 'app.title')
 */
export const translations: Record<string, TranslatedContent> = {
  // Application general
  'app.title': {
    en: 'GC-RCP Lite',
    fr: 'GC-RCP Lite',
  },
  'app.subtitle': {
    en: 'Risk & Compliance Self-Assessment Portal',
    fr: 'Portail d\'auto-évaluation des risques et de la conformité',
  },
  
  // Common strings
  'common.cancel': {
    en: 'Cancel',
    fr: 'Annuler',
  },
  'common.back': {
    en: 'Back',
    fr: 'Retour',
  },
  'common.next': {
    en: 'Next',
    fr: 'Suivant',
  },
  'common.save': {
    en: 'Save',
    fr: 'Sauvegarder',
  },
  'common.submit': {
    en: 'Submit',
    fr: 'Soumettre',
  },
  'common.submitting': {
    en: 'Submitting...',
    fr: 'Soumission en cours...',
  },
  'common.loading': {
    en: 'Loading...',
    fr: 'Chargement...',
  },
  'common.yes': {
    en: 'Yes',
    fr: 'Oui',
  },
  'common.no': {
    en: 'No',
    fr: 'Non',
  },
  'common.note': {
    en: 'Note',
    fr: 'Remarque',
  },
  
  // Error messages
  'error.label': {
    en: 'Error',
    fr: 'Erreur',
  },
  'error.required': {
    en: 'This field is required',
    fr: 'Ce champ est requis',
  },
  'error.generic': {
    en: 'An error occurred. Please try again.',
    fr: 'Une erreur est survenue. Veuillez réessayer.',
  },
  
  // Form labels
  'form.required': {
    en: 'required',
    fr: 'obligatoire',
  },
  
  // Breadcrumbs
  'breadcrumb.home': {
    en: 'Home',
    fr: 'Accueil',
  },
  
  // Assessment
  'assessment.new.title': {
    en: 'Start New Assessment',
    fr: 'Commencer une nouvelle évaluation',
  },
  'assessment.new.breadcrumb': {
    en: 'Start New Assessment',
    fr: 'Commencer une nouvelle évaluation',
  },
  'assessment.stepIndicator': {
    en: 'Assessment Progress',
    fr: 'Progression de l\'évaluation',
  },
  'assessment.step': {
    en: 'Step {number}',
    fr: 'Étape {number}',
  },
  
  // Step names
  'assessment.steps.departmentInfo': {
    en: 'Department Information',
    fr: 'Information ministérielle',
  },
  'assessment.steps.departmentInfoDesc': {
    en: 'Basic department details',
    fr: 'Détails de base du ministère',
  },
  'assessment.steps.riskAssessment': {
    en: 'Risk Assessment',
    fr: 'Évaluation des risques',
  },
  'assessment.steps.riskAssessmentDesc': {
    en: 'Identify and evaluate risks',
    fr: 'Identifier et évaluer les risques',
  },
  'assessment.steps.controlsAssessment': {
    en: 'Controls Assessment',
    fr: 'Évaluation des contrôles',
  },
  'assessment.steps.controlsAssessmentDesc': {
    en: 'Evaluate control effectiveness',
    fr: 'Évaluer l\'efficacité des contrôles',
  },
  'assessment.steps.reviewSubmit': {
    en: 'Review & Submit',
    fr: 'Révision et soumission',
  },
  'assessment.steps.reviewSubmitDesc': {
    en: 'Final review and submission',
    fr: 'Révision finale et soumission',
  },
  'assessment.continue': {
    en: 'Continue to Questions',
    fr: 'Continuer aux questions',
  },
  'assessment.saveNote': {
    en: 'Your progress will be automatically saved as you complete each section.',
    fr: 'Votre progression sera automatiquement sauvegardée à mesure que vous complétez chaque section.',
  },
  
  // Department Info
  'assessment.departmentInfo.title': {
    en: 'Department Information',
    fr: 'Information sur le ministère',
  },
  'assessment.departmentInfo.subtitle': {
    en: 'Basic information about your department',
    fr: 'Informations de base sur votre ministère',
  },
  'assessment.departmentInfo.helpText': {
    en: 'This information will be used to generate your final assessment report.',
    fr: 'Ces informations seront utilisées pour générer votre rapport d\'évaluation final.',
  },
  'assessment.departmentInfo.departmentName': {
    en: 'Department/Agency',
    fr: 'Ministère/Agence',
  },
  'assessment.departmentInfo.selectDepartment': {
    en: 'Select a department or agency...',
    fr: 'Sélectionnez un ministère ou une agence...',
  },
  'assessment.departmentInfo.departmentHint': {
    en: 'Select the Government of Canada department or agency you are completing this assessment for',
    fr: 'Sélectionnez le ministère ou l\'agence du gouvernement du Canada pour lequel vous remplissez cette évaluation',
  },
  'assessment.departmentInfo.departmentOther': {
    en: 'Department/Agency Name',
    fr: 'Nom du ministère/de l\'agence',
  },
  'assessment.departmentInfo.departmentOtherHint': {
    en: 'Please provide the full name of your department or agency',
    fr: 'Veuillez fournir le nom complet de votre ministère ou agence',
  },
  'assessment.departmentInfo.fiscalYear': {
    en: 'Fiscal Year',
    fr: 'Année fiscale',
  },
  'assessment.departmentInfo.fiscalYearHint': {
    en: 'Enter fiscal year in YYYY-YYYY format (e.g., 2025-2026)',
    fr: 'Entrez l\'année fiscale au format AAAA-AAAA (ex. 2025-2026)',
  },
  
  // Coordinator info
  'assessment.coordinatorInfo.title': {
    en: 'Coordinator Information',
    fr: 'Information du coordonnateur',
  },
  'assessment.coordinatorInfo.subtitle': {
    en: 'Contact information for the person coordinating this assessment',
    fr: 'Coordonnées de la personne qui coordonne cette évaluation',
  },
  'assessment.coordinatorInfo.helpText': {
    en: 'This person will be the main point of contact for the assessment and will receive notifications about the assessment status.',
    fr: 'Cette personne sera le principal point de contact pour l\'évaluation et recevra des notifications concernant le statut de l\'évaluation.',
  },
  'assessment.coordinatorInfo.name': {
    en: 'Coordinator Name',
    fr: 'Nom du coordonnateur',
  },
  'assessment.coordinatorInfo.jobTitle': {
    en: 'Job Title',
    fr: 'Titre du poste',
  },
  'assessment.coordinatorInfo.email': {
    en: 'Coordinator Email',
    fr: 'Courriel du coordonnateur',
  },
  'assessment.coordinatorInfo.phone': {
    en: 'Phone Number',
    fr: 'Numéro de téléphone',
  },
  'assessment.coordinatorInfo.phoneHint': {
    en: 'Include area code, e.g. (613) 555-0100',
    fr: 'Inclure l\'indicatif régional, p. ex. (613) 555-0100',
  },
  
  // Date input component translations
  'date.day': {
    en: 'Day',
    fr: 'Jour',
  },
  'date.month': {
    en: 'Month',
    fr: 'Mois',
  },
  'date.year': {
    en: 'Year',
    fr: 'Année',
  },
  'date.format.full': {
    en: 'YYYY-MM-DD',
    fr: 'AAAA-MM-JJ',
  },
  'date.format.compact': {
    en: 'YYYY-MM',
    fr: 'AAAA-MM',
  },
  
  // Navigation
  'nav.new_assessment': {
    en: 'New Assessment',
    fr: 'Nouvelle évaluation',
  },
  'nav.summary': {
    en: 'Summary',
    fr: 'Sommaire',
  },
  'nav.risks': {
    en: 'Risk Register',
    fr: 'Registre des risques',
  },
  'nav.export': {
    en: 'Export PDF',
    fr: 'Exporter PDF',
  },
  
  // Form controls
  'form.submit': {
    en: 'Submit',
    fr: 'Soumettre',
  },
  'form.next': {
    en: 'Next',
    fr: 'Suivant',
  },
  'form.previous': {
    en: 'Previous',
    fr: 'Précédent',
  },
  'form.save_draft': {
    en: 'Save Draft',
    fr: 'Enregistrer le brouillon',
  },
  'form.continue_draft': {
    en: 'Continue Draft',
    fr: 'Continuer le brouillon',
  },
  
  // Assessment workflow
  'workflow.step1': {
    en: 'Answer Questions',
    fr: 'Répondre aux questions',
  },
  'workflow.step2': {
    en: 'Review Flags',
    fr: 'Réviser les indicateurs',
  },
  'workflow.step3': {
    en: 'Enter Risks',
    fr: 'Saisir les risques',
  },
  'workflow.step4': {
    en: 'Export PDF',
    fr: 'Exporter PDF',
  },
  
  // Question types
  'question.yes': {
    en: 'Yes',
    fr: 'Oui',
  },
  'question.no': {
    en: 'No',
    fr: 'Non',
  },
  'question.frequency.annually': {
    en: 'Annually',
    fr: 'Annuellement',
  },
  'question.frequency.quarterly': {
    en: 'Quarterly',
    fr: 'Trimestriellement',
  },
  'question.frequency.monthly': {
    en: 'Monthly',
    fr: 'Mensuellement',
  },
  
  // Areas of focus from the RCP document
  'area.procurement': {
    en: 'Procurement',
    fr: 'Approvisionnement',
  },
  'area.real_property': {
    en: 'Real Property',
    fr: 'Biens immobiliers',
  },
  'area.financial': {
    en: 'Financial Management',
    fr: 'Gestion financière',
  },
  'area.gc': {
    en: 'Grants and Contributions',
    fr: 'Subventions et contributions',
  },
  'area.values': {
    en: 'Values and Ethics',
    fr: 'Valeurs et éthique',
  },
  'area.service': {
    en: 'Service',
    fr: 'Service',
  },
  'area.technology': {
    en: 'Technology',
    fr: 'Technologie',
  },
  'area.data': {
    en: 'Data',
    fr: 'Données',
  },
  
  // Additional error messages
  'error.save_failed': {
    en: 'Failed to save draft',
    fr: 'Échec de l\'enregistrement du brouillon',
  },
};

/**
 * Translates a key into the current language
 * 
 * @param key - The translation key to look up
 * @param language - The current language ('en' | 'fr')
 * @param placeholders - Optional replacement values for dynamic content
 * @returns Translated string in current language
 * 
 * @example
 * // Basic usage
 * translate('nav.home', 'en'); // Returns "Home"
 * 
 * // With placeholders
 * translate('greeting', 'en', { name: 'John' }); // Returns "Hello, John"
 * where 'greeting' is defined as { en: "Hello, {{name}}", fr: "Bonjour, {{name}}" }
 */
export function translate(
  key: string, 
  language: Language, 
  placeholders?: Record<string, string>
): string {
  // Get the translation object
  const translation = translations[key];
  
  // If key doesn't exist, return the key for debugging
  if (!translation) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }
  
  // Get the translated string in the current language
  let result = translation[language];
  
  // Replace any placeholders like {{name}}
  if (placeholders) {
    Object.entries(placeholders).forEach(([placeholder, value]) => {
      result = result.replace(new RegExp(`{{${placeholder}}}`, 'g'), value);
    });
  }
  
  return result;
}

/**
 * Helper function to switch between English and French
 * Used for the language toggle button
 * 
 * @param currentLanguage - Current language
 * @returns The alternative language
 */
export function toggleLanguage(currentLanguage: Language): Language {
  return currentLanguage === 'en' ? 'fr' : 'en';
}
