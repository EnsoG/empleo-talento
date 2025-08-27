export const baseUrl = import.meta.env.VITE_API_URL;

export const endpoints = {
    // Static Files Endpoints
    staticPhotos: `${baseUrl}/uploads/photos`,
    staticPlanPhotos: `${baseUrl}/uploads/plan_photos`,
    staticLogos: `${baseUrl}/uploads/logos`,
    staticResumes: `${baseUrl}/uploads/resumes`,
    staticPublicationImages: `${baseUrl}/uploads/publication_images`,
    // Metadata Endpoints
    metadata: `${baseUrl}/metadata`,
    getCities: `${baseUrl}/metadata/cities`,
    contractTypes: `${baseUrl}/metadata/contract-types`,
    jobTypes: `${baseUrl}/metadata/job-types`,
    shifts: `${baseUrl}/metadata/shifts`,
    jobDays: `${baseUrl}/metadata/job-days`,
    contactEmails: `${baseUrl}/metadata/contact-emails`,
    publicationCategories: `${baseUrl}/metadata/publication-categories`,
    // Auth Endpoints
    login: `${baseUrl}/auth/login`,
    loginOAuth: `${baseUrl}/auth/login/oauth`,
    checkAuth: `${baseUrl}/auth/check-auth`,
    logout: `${baseUrl}/auth/logout`,
    registerCandidate: `${baseUrl}/auth/register-candidate`,
    registerCompany: `${baseUrl}/auth/register-company`,
    forgetPassword: `${baseUrl}/auth/forget-password`,
    changePassword: `${baseUrl}/auth/change-password`,
    // Candidate Endpoints
    candidates: `${baseUrl}/candidates`,
    getResume: `${baseUrl}/candidates/resume`,
    updateCandidatePhoto: `${baseUrl}/candidates/update-photo`,
    updateCandidateResume: `${baseUrl}/candidates/update-resume`,
    // Candidate Study Endpoints
    candidateStudies: `${baseUrl}/candidate-studies`,
    // Candidate Certification Endpoints
    candidateCertifications: `${baseUrl}/candidate-certifications`,
    // Candidate Software Endpoints
    candidateSoftwares: `${baseUrl}/candidate-softwares`,
    // Candidate Language Endpoints
    candidateLanguages: `${baseUrl}/candidate-languages`,
    // Job Offer Endpoints
    jobOffers: `${baseUrl}/job-offers`,
    getLatestOffers: `${baseUrl}/job-offers/latest`,
    finishJobOffer: `${baseUrl}/job-offers/finish`,
    // Postulation Endpoints
    postulations: `${baseUrl}/postulations`,
    // Work Experience Endpoints
    candidateWorkExperiences: `${baseUrl}/work-experiences`,
    // Software Endpoints
    softwares: `${baseUrl}/softwares`,
    // Language Endpoints
    languages: `${baseUrl}/languages`,
    // Publication Endpoints
    publications: `${baseUrl}/publications`,
    // Company Sector Endpoints
    companySectors: `${baseUrl}/company-sectors`,
    // Performance Area Endpoints
    performanceAreas: `${baseUrl}/performance-areas`,
    // Certification Type Endpoints
    certificationTypes: `${baseUrl}/certification-types`,
    // Role Position Endpoints
    rolePositions: `${baseUrl}/role-positions`,
    // Generic Position Endpoints
    genericPositions: `${baseUrl}/generic-positions`,
    // Company Endpoints
    companies: `${baseUrl}/companies`,
    getUserCompany: `${baseUrl}/companies/by-user`,
    updateCompanyLogo: `${baseUrl}/companies/update-logo`,
    updateCompanyState: `${baseUrl}/companies/update-state`,
    // Company User Endpoints
    companyUsers: `${baseUrl}/company-users`,
    getStaff: `${baseUrl}/company-users/staff`,
    // Job Schedules Endpoints
    jobSchedules: `${baseUrl}/job-schedules`,
    // Candidate Plan Endpoints
    candidatePlans: `${baseUrl}/candidate-plans`,
    // Company Plan Endpoints
    companyPlans: `${baseUrl}/company-plans`,
    // Admin User Endpoints
    adminUsers: `${baseUrl}/admin-users`,
    // Scraper Endpoints
    scrapersStatus: `${baseUrl}/scrapers/status`,
    codelcoTest: `${baseUrl}/scrapers/codelco/test`,
    codelcoRun: `${baseUrl}/scrapers/codelco/run`,
    codelcoJobs: `${baseUrl}/scrapers/codelco/jobs`,
    // Admin Scraper Endpoints
    adminCodelcoExecute: `${baseUrl}/admin/codelco/scraping/execute`,
    adminCodelcoStatus: `${baseUrl}/admin/codelco/scraping/status`,
    adminCodelcoProgress: `${baseUrl}/admin/codelco/scraping/progress`,
    adminCodelcoReset: `${baseUrl}/admin/codelco/scraping/reset`,
    adminCodelcoJobs: `${baseUrl}/admin/codelco/jobs`,
} as const