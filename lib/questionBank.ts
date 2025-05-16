/**
 * @file questionBank.ts
 * @description Structured question bank for the GC-RCP assessment
 * 
 * This file contains the structured questions from the questions.md file
 * organized by assessment area. Each question includes metadata for
 * rendering and assignment tracking.
 */

// Import types from questions.ts
import { QuestionType, AssessmentArea } from './questions';

/**
 * Question interface with assignment capabilities
 */
export interface AssessmentQuestion {
  id: string;                  // Unique identifier for the question
  number: number;              // Question number within its section
  text: string;                // The question text
  type: QuestionType;          // Question type (radio, checkbox, text, etc.)
  area: AssessmentArea;        // Assessment area this question belongs to
  required: boolean;           // Whether an answer is required
  options?: string[];          // Possible answer options
  guidance?: string;           // Additional guidance for answering
  assignedTo?: string;         // Email of person assigned to answer
  assignedBy?: string;         // Email of person who assigned the question
  assignedDate?: string;       // Date when the question was assigned
  status?: 'not_started' | 'in_progress' | 'completed' | 'reviewed'; // Current status
  answer?: any;                // The provided answer
  lastUpdated?: string;        // When the answer was last updated
}

/**
 * Assessment area metadata
 */
export interface AreaMetadata {
  id: AssessmentArea;          // Enum value for the area
  title: string;               // Display title
  description: string;         // Brief description
  assignable: boolean;         // Whether this area can be assigned
  defaultAssignee?: string;    // Default person responsible
}

/**
 * Assessment areas metadata
 */
export const assessmentAreas: AreaMetadata[] = [
  {
    id: AssessmentArea.PROCUREMENT,
    title: "Procurement",
    description: "Assessment of procurement processes and controls",
    assignable: true
  },
  {
    id: AssessmentArea.REAL_PROPERTY,
    title: "Real Property",
    description: "Assessment of real property management",
    assignable: true
  },
  {
    id: AssessmentArea.FINANCIAL_MANAGEMENT,
    title: "Financial and Expenditure Management",
    description: "Assessment of financial controls and expenditure management",
    assignable: true
  },
  {
    id: AssessmentArea.GRANTS_CONTRIBUTIONS,
    title: "Grants and Contributions",
    description: "Assessment of grants and contributions programs",
    assignable: true
  },
  {
    id: AssessmentArea.VALUES_ETHICS,
    title: "Values and Ethics",
    description: "Assessment of values and ethics framework",
    assignable: true
  },
  {
    id: AssessmentArea.WORKPLACE_HEALTH,
    title: "Workplace Health",
    description: "Assessment of workplace health and safety",
    assignable: true
  },
  {
    id: AssessmentArea.PERFORMANCE_MANAGEMENT,
    title: "Performance Management",
    description: "Assessment of performance management practices",
    assignable: true
  },
  {
    id: AssessmentArea.SECURITY,
    title: "Security",
    description: "Assessment of security controls and practices",
    assignable: true
  },
  {
    id: AssessmentArea.SERVICE,
    title: "Service",
    description: "Assessment of service delivery",
    assignable: true
  },
  {
    id: AssessmentArea.TECHNOLOGY,
    title: "Technology",
    description: "Assessment of technology management",
    assignable: true
  },
  {
    id: AssessmentArea.DATA,
    title: "Data",
    description: "Assessment of data management practices",
    assignable: true
  }
];

/**
 * Procurement questions
 */
export const procurementQuestions: AssessmentQuestion[] = [
  {
    id: "proc_1",
    number: 1,
    text: "How frequently does the Deputy Head meet with the Senior Designated Official for Procurement to discuss procurement matters?",
    type: "radio",
    area: AssessmentArea.PROCUREMENT,
    required: true,
    options: [
      "Monthly or more frequently",
      "Quarterly",
      "Semi-annually",
      "Annually",
      "Less than annually",
      "Never"
    ],
    guidance: "Select the option that best represents the frequency of these meetings over the past fiscal year."
  },
  {
    id: "proc_2",
    number: 2,
    text: "Does the organization have a process in place to identify long-term contracts at least two years before their expiration and to assess whether the associated requirements should be re-solicited or the contracts extended?",
    type: "radio",
    area: AssessmentArea.PROCUREMENT,
    required: true,
    options: [
      "Yes, a comprehensive process is in place",
      "Yes, but the process is not consistently applied",
      "No, but there are plans to implement such a process",
      "No, there is no such process"
    ]
  },
  {
    id: "proc_3",
    number: 3,
    text: "Does the organization have risk-based internal controls over procurement that have been reviewed within the past year to confirm that they provide reasonable assurance that procurement transactions are carried out in accordance with the procurement framework, applicable laws, regulations and policies?",
    type: "radio",
    area: AssessmentArea.PROCUREMENT,
    required: true,
    options: [
      "Yes, with comprehensive controls",
      "Yes, with some controls",
      "No, but planning to implement",
      "No controls in place"
    ]
  },
  {
    id: "proc_4",
    number: 4,
    text: "Has the organization conducted a capacity assessment within the last three years to assess whether the organization has adequate resources to address its procurement needs?",
    type: "radio",
    area: AssessmentArea.PROCUREMENT,
    required: true,
    options: [
      "Yes, within the last year",
      "Yes, within the last two years",
      "Yes, within the last three years",
      "No, but planning to conduct one",
      "No assessment conducted"
    ]
  },
  {
    id: "proc_5",
    number: 5,
    text: "What is the level of maturity of the organization's Procurement Management Framework?",
    type: "radio",
    area: AssessmentArea.PROCUREMENT,
    required: true,
    options: [
      "Initial/Ad hoc",
      "Developing",
      "Defined",
      "Managed",
      "Optimizing"
    ],
    guidance: "Assess based on documentation, integration, and effectiveness of the framework."
  },
  {
    id: "proc_6",
    number: 6,
    text: "What is the level of maturity of the organization's procurement monitoring and control practices?",
    type: "radio",
    area: AssessmentArea.PROCUREMENT,
    required: true,
    options: [
      "Initial/Ad hoc",
      "Developing",
      "Defined",
      "Managed",
      "Optimizing"
    ]
  },
  {
    id: "proc_7",
    number: 7,
    text: "What is the level of maturity of the organization's procurement planning?",
    type: "radio",
    area: AssessmentArea.PROCUREMENT,
    required: true,
    options: [
      "Initial/Ad hoc",
      "Developing",
      "Defined",
      "Managed",
      "Optimizing"
    ]
  },
  {
    id: "proc_8",
    number: 8,
    text: "What is the level of maturity of the organization's procurement governance?",
    type: "radio",
    area: AssessmentArea.PROCUREMENT,
    required: true,
    options: [
      "Initial/Ad hoc",
      "Developing",
      "Defined",
      "Managed",
      "Optimizing"
    ]
  },
  {
    id: "proc_9",
    number: 9,
    text: "What is the level of maturity of the organization's procurement resource competency and capacity?",
    type: "radio",
    area: AssessmentArea.PROCUREMENT,
    required: true,
    options: [
      "Initial/Ad hoc",
      "Developing",
      "Defined",
      "Managed",
      "Optimizing"
    ]
  }
];

/**
 * Real Property questions
 */
export const realPropertyQuestions: AssessmentQuestion[] = [
  {
    id: "rp_1",
    number: 1,
    text: "How frequently does the Deputy Head meet with the Senior Designated Official for Real Property to discuss real property matters?",
    type: "radio",
    area: AssessmentArea.REAL_PROPERTY,
    required: true,
    options: [
      "Monthly or more frequently",
      "Quarterly",
      "Semi-annually",
      "Annually",
      "Less than annually",
      "Never"
    ]
  },
  {
    id: "rp_2",
    number: 2,
    text: "Based on data reported in the Directory of Federal Real Property, how has the condition of the organization's real property portfolio changed over the last 3 fiscal years?",
    type: "radio",
    area: AssessmentArea.REAL_PROPERTY,
    required: true,
    options: [
      "Improved significantly",
      "Improved slightly",
      "Remained stable",
      "Deteriorated slightly",
      "Deteriorated significantly",
      "Not applicable - organization does not manage real property"
    ]
  },
  {
    id: "rp_3",
    number: 3,
    text: "For transactions completed by the organization in the last fiscal year, what proportion of these transactions have complete documentation to demonstrate compliance with relevant legal and policy requirements?",
    type: "radio",
    area: AssessmentArea.REAL_PROPERTY,
    required: true,
    options: [
      "All transactions (100%)",
      "Most transactions (75-99%)",
      "Some transactions (50-74%)",
      "Few transactions (25-49%)",
      "Very few transactions (1-24%)",
      "No transactions (0%)",
      "Not applicable - no transactions in the last fiscal year"
    ]
  },
  {
    id: "rp_4",
    number: 4,
    text: "What is the organization's actual reinvestment rate for real property compared to its target reinvestment rate?",
    type: "radio",
    area: AssessmentArea.REAL_PROPERTY,
    required: true,
    options: [
      "Exceeds target by more than 10%",
      "Exceeds target by 1-10%",
      "Meets target",
      "Below target by 1-10%",
      "Below target by more than 10%",
      "No target established",
      "Not applicable"
    ]
  },
  {
    id: "rp_5",
    number: 5,
    text: "What is the level of maturity of the organization's real property governance?",
    type: "radio",
    area: AssessmentArea.REAL_PROPERTY,
    required: true,
    options: [
      "Initial/Ad hoc",
      "Developing",
      "Defined",
      "Managed",
      "Optimizing"
    ]
  }
];

/**
 * Security questions
 */
export const securityQuestions: AssessmentQuestion[] = [
  {
    id: "sec_1",
    number: 1,
    text: "How frequently do security officials report to the organization's security governance committees on the performance of security controls?",
    type: "radio",
    area: AssessmentArea.SECURITY,
    required: true,
    options: [
      "Monthly or more frequently",
      "Quarterly",
      "Semi-annually",
      "Annually",
      "Less than annually",
      "Never"
    ]
  },
  {
    id: "sec_2",
    number: 2,
    text: "How frequently does the Chief Security Officer report to the Deputy Head on the progress in achieving the departmental security plan priorities?",
    type: "radio",
    area: AssessmentArea.SECURITY,
    required: true,
    options: [
      "Monthly or more frequently",
      "Quarterly",
      "Semi-annually",
      "Annually",
      "Less than annually",
      "Never"
    ]
  },
  {
    id: "sec_3",
    number: 3,
    text: "How frequently does the Chief Security Officer receive reports on the effectiveness of security practices and security controls?",
    type: "radio",
    area: AssessmentArea.SECURITY,
    required: true,
    options: [
      "Monthly or more frequently",
      "Quarterly",
      "Semi-annually",
      "Annually",
      "Less than annually",
      "Never"
    ]
  }
];

// Collection of all questions by area
export const allQuestions: Record<AssessmentArea, AssessmentQuestion[]> = {
  [AssessmentArea.PROCUREMENT]: procurementQuestions,
  [AssessmentArea.REAL_PROPERTY]: realPropertyQuestions,
  [AssessmentArea.FINANCIAL_MANAGEMENT]: [], // To be implemented
  [AssessmentArea.GRANTS_CONTRIBUTIONS]: [], // To be implemented
  [AssessmentArea.VALUES_ETHICS]: [], // To be implemented
  [AssessmentArea.WORKPLACE_HEALTH]: [], // To be implemented
  [AssessmentArea.PERFORMANCE_MANAGEMENT]: [], // To be implemented
  [AssessmentArea.SECURITY]: securityQuestions,
  [AssessmentArea.SERVICE]: [], // To be implemented
  [AssessmentArea.TECHNOLOGY]: [], // To be implemented
  [AssessmentArea.DATA]: [], // To be implemented
};

/**
 * Gets all questions for a specific assessment area
 * @param area Assessment area to get questions for
 * @returns Array of questions for the specified area
 */
export function getQuestionsByArea(area: AssessmentArea): AssessmentQuestion[] {
  return allQuestions[area] || [];
}

/**
 * Gets a specific question by ID
 * @param id Question ID
 * @returns The question object or undefined if not found
 */
export function getQuestionById(id: string): AssessmentQuestion | undefined {
  for (const area in allQuestions) {
    const question = allQuestions[area as AssessmentArea].find(q => q.id === id);
    if (question) {
      return question;
    }
  }
  return undefined;
}

/**
 * Gets all assessment areas
 * @returns Array of assessment area metadata
 */
export function getAllAreas(): AreaMetadata[] {
  return assessmentAreas;
}

/**
 * Gets assessment area by ID
 * @param id Assessment area ID
 * @returns Area metadata or undefined if not found
 */
export function getAreaById(id: AssessmentArea): AreaMetadata | undefined {
  return assessmentAreas.find(area => area.id === id);
}

/**
 * Gets the question count for each area
 * @returns Record mapping area IDs to question counts
 */
export function getQuestionCountsByArea(): Record<AssessmentArea, number> {
  const counts: Record<AssessmentArea, number> = {} as Record<AssessmentArea, number>;
  
  for (const area in allQuestions) {
    counts[area as AssessmentArea] = allQuestions[area as AssessmentArea].length;
  }
  
  return counts;
}
