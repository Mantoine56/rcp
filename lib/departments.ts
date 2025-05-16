/**
 * @file lib/departments.ts
 * @description List of Government of Canada departments and agencies
 * 
 * This file provides a comprehensive list of Government of Canada departments
 * and agencies for use in department selection dropdowns.
 */

/**
 * Department interface for structured data
 */
export interface Department {
  /** Full name of the department in English */
  nameEn: string;
  /** Full name of the department in French */
  nameFr: string;
  /** Department/agency acronym */
  acronym: string;
  /** Optional department URL */
  url?: string;
}

/**
 * List of Government of Canada departments and agencies
 * Source: Canada.ca departments and agencies listing
 * 
 * Each entry includes English and French names and acronyms
 */
export const departments: Department[] = [
  {
    nameEn: 'Agriculture and Agri-Food Canada',
    nameFr: 'Agriculture et Agroalimentaire Canada',
    acronym: 'AAFC',
    url: 'https://agriculture.canada.ca/en'
  },
  {
    nameEn: 'Canada Border Services Agency',
    nameFr: 'Agence des services frontaliers du Canada',
    acronym: 'CBSA',
    url: 'http://www.cbsa-asfc.gc.ca/menu-eng.html'
  },
  {
    nameEn: 'Canadian Food Inspection Agency',
    nameFr: 'Agence canadienne d\'inspection des aliments',
    acronym: 'CFIA',
    url: 'https://inspection.canada.ca/en'
  },
  {
    nameEn: 'Canadian Heritage',
    nameFr: 'Patrimoine canadien',
    acronym: 'PCH',
    url: 'https://www.canada.ca/en/canadian-heritage.html'
  },
  {
    nameEn: 'Crown-Indigenous Relations and Northern Affairs Canada',
    nameFr: 'Relations Couronne-Autochtones et Affaires du Nord Canada',
    acronym: 'CIRNAC',
    url: 'https://www.canada.ca/en/crown-indigenous-relations-northern-affairs.html'
  },
  {
    nameEn: 'Department of Finance Canada',
    nameFr: 'Ministère des Finances Canada',
    acronym: 'FIN',
    url: 'https://www.canada.ca/en/department-finance.html'
  },
  {
    nameEn: 'Department of Justice Canada',
    nameFr: 'Ministère de la Justice Canada',
    acronym: 'JUS',
    url: 'https://www.justice.gc.ca/eng/'
  },
  {
    nameEn: 'Employment and Social Development Canada',
    nameFr: 'Emploi et Développement social Canada',
    acronym: 'ESDC',
    url: 'https://www.canada.ca/en/employment-social-development.html'
  },
  {
    nameEn: 'Environment and Climate Change Canada',
    nameFr: 'Environnement et Changement climatique Canada',
    acronym: 'ECCC',
    url: 'https://www.canada.ca/en/environment-climate-change.html'
  },
  {
    nameEn: 'Fisheries and Oceans Canada',
    nameFr: 'Pêches et Océans Canada',
    acronym: 'DFO',
    url: 'http://www.dfo-mpo.gc.ca/index-eng.htm'
  },
  {
    nameEn: 'Global Affairs Canada',
    nameFr: 'Affaires mondiales Canada',
    acronym: 'GAC',
    url: 'https://www.international.gc.ca/global-affairs-affaires-mondiales/home-accueil.aspx?lang=eng'
  },
  {
    nameEn: 'Health Canada',
    nameFr: 'Santé Canada',
    acronym: 'HC',
    url: 'https://www.canada.ca/en/health-canada.html'
  },
  {
    nameEn: 'Immigration, Refugees and Citizenship Canada',
    nameFr: 'Immigration, Réfugiés et Citoyenneté Canada',
    acronym: 'IRCC',
    url: 'https://www.canada.ca/en/immigration-refugees-citizenship.html'
  },
  {
    nameEn: 'Indigenous Services Canada',
    nameFr: 'Services aux Autochtones Canada',
    acronym: 'ISC',
    url: 'https://www.canada.ca/en/indigenous-services-canada.html'
  },
  {
    nameEn: 'Innovation, Science and Economic Development Canada',
    nameFr: 'Innovation, Sciences et Développement économique Canada',
    acronym: 'ISED',
    url: 'https://ised-isde.canada.ca/site/ised/en'
  },
  {
    nameEn: 'National Defence',
    nameFr: 'Défense nationale',
    acronym: 'DND',
    url: 'https://www.canada.ca/en/department-national-defence.html'
  },
  {
    nameEn: 'Natural Resources Canada',
    nameFr: 'Ressources naturelles Canada',
    acronym: 'NRCan',
    url: 'https://natural-resources.canada.ca/home'
  },
  {
    nameEn: 'Public Health Agency of Canada',
    nameFr: 'Agence de la santé publique du Canada',
    acronym: 'PHAC',
    url: 'https://www.canada.ca/en/public-health.html'
  },
  {
    nameEn: 'Public Safety Canada',
    nameFr: 'Sécurité publique Canada',
    acronym: 'PS',
    url: 'https://www.publicsafety.gc.ca/index-en.aspx'
  },
  {
    nameEn: 'Public Services and Procurement Canada',
    nameFr: 'Services publics et Approvisionnement Canada',
    acronym: 'PSPC',
    url: 'https://www.canada.ca/en/public-services-procurement.html'
  },
  {
    nameEn: 'Transport Canada',
    nameFr: 'Transports Canada',
    acronym: 'TC',
    url: 'https://tc.canada.ca/en'
  },
  {
    nameEn: 'Treasury Board of Canada Secretariat',
    nameFr: 'Secrétariat du Conseil du Trésor du Canada',
    acronym: 'TBS',
    url: 'https://www.canada.ca/en/treasury-board-secretariat.html'
  },
  {
    nameEn: 'Veterans Affairs Canada',
    nameFr: 'Anciens Combattants Canada',
    acronym: 'VAC',
    url: 'https://www.veterans.gc.ca/eng'
  },
  {
    nameEn: 'Women and Gender Equality Canada',
    nameFr: 'Femmes et Égalité des genres Canada',
    acronym: 'WAGE',
    url: 'https://www.canada.ca/en/women-gender-equality.html'
  },
  {
    nameEn: 'Correctional Service Canada',
    nameFr: 'Service correctionnel Canada',
    acronym: 'CSC',
    url: 'https://www.canada.ca/en/correctional-service.html'
  },
  {
    nameEn: 'Royal Canadian Mounted Police',
    nameFr: 'Gendarmerie royale du Canada',
    acronym: 'RCMP',
    url: 'http://www.rcmp-grc.gc.ca/en/home'
  },
  {
    nameEn: 'Canada Revenue Agency',
    nameFr: 'Agence du revenu du Canada',
    acronym: 'CRA',
    url: 'https://www.canada.ca/en/revenue-agency.html'
  },
  {
    nameEn: 'Statistics Canada',
    nameFr: 'Statistique Canada',
    acronym: 'StatCan',
    url: 'https://www.statcan.gc.ca/eng/start'
  },
  {
    nameEn: 'Parks Canada',
    nameFr: 'Parcs Canada',
    acronym: 'PC',
    url: 'https://parks.canada.ca/index'
  }
];

/**
 * Helper function to sort departments alphabetically by English name
 * @returns Sorted department list
 */
export const getSortedDepartments = () => {
  return [...departments].sort((a, b) => 
    a.nameEn.localeCompare(b.nameEn)
  );
};
