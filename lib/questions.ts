/**
 * @file questions.ts
 * @description Sample question bank for the GC-RCP assessment
 * 
 * This file contains a sample set of questions for the Risk and Compliance
 * self-assessment. In a production environment, these would likely come from
 * a database or API, but are defined here for demonstration purposes.
 */

/**
 * Question option interface
 * Represents a selectable choice for questions
 */
export interface QuestionOption {
  value: string;           // Value to be stored when selected
  label: {                 // Display label with bilingual support
    en: string;
    fr: string;
  };
  description?: {          // Optional longer description with bilingual support
    en: string;
    fr: string;
  };
  flagValue?: number;      // Value used for flag calculations (0-100)
  maturityValue?: number;  // Value used for maturity calculations (0-5)
}

/**
 * Question types supported by the assessment
 */
export type QuestionType = 'radio' | 'checkbox' | 'text' | 'textarea' | 'select';

/**
 * Assessment areas
 * These correspond to the main sections of the assessment based on the markdown file
 */
export enum AssessmentArea {
  PROCUREMENT = 'procurement',
  REAL_PROPERTY = 'real_property',
  FINANCIAL_MANAGEMENT = 'financial_management',
  GRANTS_CONTRIBUTIONS = 'grants_contributions',
  VALUES_ETHICS = 'values_ethics',
  WORKPLACE_HEALTH = 'workplace_health',
  PERFORMANCE_MANAGEMENT = 'performance_management',
  SECURITY = 'security',
  SERVICE = 'service',
  TECHNOLOGY = 'technology',
  DATA = 'data',
}

/**
 * Question interface
 * Represents a single question in the assessment
 */
export interface AssessmentQuestion {
  id: string;              // Unique identifier for the question
  type: QuestionType;      // Type of question
  text: {                  // Question text with bilingual support
    en: string;
    fr: string;
  };
  guidance?: {             // Optional guidance text with bilingual support
    en: string;
    fr: string;
  };
  required: boolean;       // Whether an answer is required
  options?: QuestionOption[]; // Options for radio/checkbox/select questions
  conditionalId?: string;  // If this question depends on another question
  conditionalValue?: string | string[]; // Value(s) that trigger this question
  area: AssessmentArea;    // Assessment area this question belongs to
  flagIf?: string[];       // Values that will raise a flag
  flagText?: {             // Text to display when flagged
    en: string;
    fr: string;
  };
  order: number;           // Order within the area (for sorting)
  minSelections?: number;  // Minimum number of selections (for checkbox)
  maxSelections?: number;  // Maximum number of selections (for checkbox)
  maxLength?: number;      // Maximum length for text inputs
}

/**
 * Sample maturity levels
 * Used for radio button options in maturity assessments
 */
export const maturityLevels: QuestionOption[] = [
  {
    value: 'initial',
    label: {
      en: 'Initial (Level 1)',
      fr: 'Initial (Niveau 1)'
    },
    description: {
      en: 'Processes are ad hoc and occasionally chaotic. Success depends on individual effort.',
      fr: 'Les processus sont ponctuels et parfois chaotiques. Le succès dépend des efforts individuels.'
    },
    maturityValue: 1
  },
  {
    value: 'repeatable',
    label: {
      en: 'Repeatable (Level 2)',
      fr: 'Reproductible (Niveau 2)'
    },
    description: {
      en: 'Basic processes are established and there is a level of discipline to stick to these processes.',
      fr: 'Des processus de base sont établis et il y a un niveau de discipline pour s\'en tenir à ces processus.'
    },
    maturityValue: 2
  },
  {
    value: 'defined',
    label: {
      en: 'Defined (Level 3)',
      fr: 'Défini (Niveau 3)'
    },
    description: {
      en: 'Processes are documented, standardized, and integrated into the organization.',
      fr: 'Les processus sont documentés, standardisés et intégrés dans l\'organisation.'
    },
    maturityValue: 3
  },
  {
    value: 'managed',
    label: {
      en: 'Managed (Level 4)',
      fr: 'Géré (Niveau 4)'
    },
    description: {
      en: 'Processes are monitored and controlled through data collection and analysis.',
      fr: 'Les processus sont surveillés et contrôlés par la collecte et l\'analyse de données.'
    },
    maturityValue: 4
  },
  {
    value: 'optimizing',
    label: {
      en: 'Optimizing (Level 5)',
      fr: 'Optimisé (Niveau 5)'
    },
    description: {
      en: 'Focus is on continuous improvement through both incremental and innovative changes.',
      fr: 'L\'accent est mis sur l\'amélioration continue grâce à des changements progressifs et innovants.'
    },
    maturityValue: 5
  }
];

/**
 * Common yes/no options
 * Used for simple boolean questions
 */
export const yesNoOptions: QuestionOption[] = [
  {
    value: 'yes',
    label: {
      en: 'Yes',
      fr: 'Oui'
    }
  },
  {
    value: 'no',
    label: {
      en: 'No',
      fr: 'Non'
    },
    flagValue: 100 // This will trigger a flag if selected
  }
];

/**
 * Frequency options
 * Used for questions about how often something occurs
 */
export const frequencyOptions: QuestionOption[] = [
  {
    value: 'never',
    label: {
      en: 'Never',
      fr: 'Jamais'
    },
    flagValue: 100
  },
  {
    value: 'annually',
    label: {
      en: 'Annually',
      fr: 'Annuellement'
    }
  },
  {
    value: 'semi_annually',
    label: {
      en: 'Semi-annually',
      fr: 'Semestriellement'
    }
  },
  {
    value: 'quarterly',
    label: {
      en: 'Quarterly',
      fr: 'Trimestriellement'
    }
  },
  {
    value: 'monthly',
    label: {
      en: 'Monthly',
      fr: 'Mensuellement'
    }
  },
  {
    value: 'weekly',
    label: {
      en: 'Weekly',
      fr: 'Hebdomadairement'
    }
  },
  {
    value: 'daily',
    label: {
      en: 'Daily',
      fr: 'Quotidiennement'
    }
  }
];

/**
 * Sample governance questions
 * These relate to governance and oversight
 */
const governanceQuestions: AssessmentQuestion[] = [
  {
    id: 'gov_1',
    type: 'radio',
    text: {
      en: 'Does your department have a documented IT governance framework?',
      fr: 'Votre ministère dispose-t-il d\'un cadre de gouvernance informatique documenté?'
    },
    guidance: {
      en: 'A governance framework defines the roles, responsibilities, and decision-making processes for IT management.',
      fr: 'Un cadre de gouvernance définit les rôles, les responsabilités et les processus de prise de décision pour la gestion des TI.'
    },
    required: true,
    options: yesNoOptions,
    area: AssessmentArea.GOVERNANCE,
    flagIf: ['no'],
    flagText: {
      en: 'Missing IT governance framework documentation',
      fr: 'Documentation du cadre de gouvernance informatique manquante'
    },
    order: 1
  },
  {
    id: 'gov_2',
    type: 'radio',
    text: {
      en: 'How would you rate the maturity of your department\'s IT governance processes?',
      fr: 'Comment évalueriez-vous la maturité des processus de gouvernance informatique de votre ministère?'
    },
    required: true,
    options: maturityLevels,
    area: AssessmentArea.GOVERNANCE,
    flagIf: ['initial', 'repeatable'],
    flagText: {
      en: 'Low maturity rating for IT governance processes',
      fr: 'Faible notation de maturité pour les processus de gouvernance informatique'
    },
    order: 2
  },
  {
    id: 'gov_3',
    type: 'radio',
    text: {
      en: 'How frequently does your governance committee meet to review IT investments and risks?',
      fr: 'À quelle fréquence votre comité de gouvernance se réunit-il pour examiner les investissements et les risques informatiques?'
    },
    required: true,
    options: frequencyOptions,
    area: AssessmentArea.GOVERNANCE,
    flagIf: ['never', 'annually'],
    flagText: {
      en: 'Infrequent governance committee meetings',
      fr: 'Réunions peu fréquentes du comité de gouvernance'
    },
    order: 3
  },
  {
    id: 'gov_4',
    type: 'textarea',
    text: {
      en: 'Please describe how IT governance decisions are documented and communicated within your department.',
      fr: 'Veuillez décrire comment les décisions de gouvernance informatique sont documentées et communiquées au sein de votre ministère.'
    },
    required: true,
    area: AssessmentArea.GOVERNANCE,
    maxLength: 1000,
    order: 4
  }
];

/**
 * Sample security questions
 * These relate to IT security and risk management
 */
const securityQuestions: AssessmentQuestion[] = [
  {
    id: 'sec_1',
    type: 'radio',
    text: {
      en: 'Has your department completed a threat and risk assessment within the last 12 months?',
      fr: 'Votre ministère a-t-il effectué une évaluation des menaces et des risques au cours des 12 derniers mois?'
    },
    required: true,
    options: yesNoOptions,
    area: AssessmentArea.SECURITY,
    flagIf: ['no'],
    flagText: {
      en: 'No recent threat and risk assessment',
      fr: 'Pas d\'évaluation récente des menaces et des risques'
    },
    order: 1
  },
  {
    id: 'sec_2',
    type: 'checkbox',
    text: {
      en: 'Which of the following security controls does your department have in place?',
      fr: 'Lesquels des contrôles de sécurité suivants votre ministère a-t-il mis en place?'
    },
    required: true,
    options: [
      {
        value: 'mfa',
        label: {
          en: 'Multi-factor authentication',
          fr: 'Authentification à plusieurs facteurs'
        }
      },
      {
        value: 'encryption',
        label: {
          en: 'Data encryption (at rest and in transit)',
          fr: 'Chiffrement des données (au repos et en transit)'
        }
      },
      {
        value: 'logging',
        label: {
          en: 'Security event logging and monitoring',
          fr: 'Journalisation et surveillance des événements de sécurité'
        }
      },
      {
        value: 'patches',
        label: {
          en: 'Regular security patching',
          fr: 'Application régulière des correctifs de sécurité'
        }
      },
      {
        value: 'backups',
        label: {
          en: 'Regular data backups and recovery testing',
          fr: 'Sauvegardes régulières des données et tests de récupération'
        }
      }
    ],
    area: AssessmentArea.SECURITY,
    flagIf: [],  // Flag will be set in logic based on missing key controls
    minSelections: 1,
    order: 2
  },
  {
    id: 'sec_3',
    type: 'radio',
    text: {
      en: 'How would you rate the maturity of your department\'s security incident response processes?',
      fr: 'Comment évalueriez-vous la maturité des processus de réponse aux incidents de sécurité de votre ministère?'
    },
    required: true,
    options: maturityLevels,
    area: AssessmentArea.SECURITY,
    flagIf: ['initial', 'repeatable'],
    flagText: {
      en: 'Low maturity for security incident response',
      fr: 'Faible maturité pour la réponse aux incidents de sécurité'
    },
    order: 3
  }
];

/**
 * Sample data governance questions
 * These relate to data management and governance
 */
const dataQuestions: AssessmentQuestion[] = [
  {
    id: 'data_1',
    type: 'radio',
    text: {
      en: 'Does your department have a documented data governance framework?',
      fr: 'Votre ministère dispose-t-il d\'un cadre de gouvernance des données documenté?'
    },
    required: true,
    options: yesNoOptions,
    area: AssessmentArea.DATA,
    flagIf: ['no'],
    flagText: {
      en: 'Missing data governance framework',
      fr: 'Cadre de gouvernance des données manquant'
    },
    order: 1
  },
  {
    id: 'data_2',
    type: 'radio',
    text: {
      en: 'How frequently are data quality assessments performed?',
      fr: 'À quelle fréquence les évaluations de qualité des données sont-elles effectuées?'
    },
    required: true,
    options: frequencyOptions,
    area: AssessmentArea.DATA,
    flagIf: ['never', 'annually'],
    flagText: {
      en: 'Infrequent data quality assessments',
      fr: 'Évaluations peu fréquentes de la qualité des données'
    },
    order: 2
  },
  {
    id: 'data_3',
    type: 'radio',
    text: {
      en: 'Has your department conducted a Privacy Impact Assessment for systems containing personal information?',
      fr: 'Votre ministère a-t-il mené une évaluation des facteurs relatifs à la vie privée pour les systèmes contenant des renseignements personnels?'
    },
    required: true,
    options: yesNoOptions,
    area: AssessmentArea.DATA,
    flagIf: ['no'],
    flagText: {
      en: 'Missing Privacy Impact Assessment',
      fr: 'Évaluation des facteurs relatifs à la vie privée manquante'
    },
    order: 3
  }
];

/**
 * Combined list of all assessment questions
 */
export const assessmentQuestions: AssessmentQuestion[] = [
  ...governanceQuestions,
  ...securityQuestions,
  ...dataQuestions,
  // Additional question areas would be added here
];

/**
 * Helper function to get questions for a specific area
 * @param area - The assessment area to get questions for
 * @returns Array of questions sorted by order
 */
export const getQuestionsByArea = (area: AssessmentArea): AssessmentQuestion[] => {
  return assessmentQuestions
    .filter(q => q.area === area)
    .sort((a, b) => a.order - b.order);
};

/**
 * Helper function to get a question by ID
 * @param id - The question ID to find
 * @returns The question object or undefined if not found
 */
export const getQuestionById = (id: string): AssessmentQuestion | undefined => {
  return assessmentQuestions.find(q => q.id === id);
};

/**
 * Helper function to get all assessment areas
 * @returns Array of assessment areas
 */
export const getAssessmentAreas = (): AssessmentArea[] => {
  return Object.values(AssessmentArea);
};

// Additional helper functions can be added as needed
