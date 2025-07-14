export const baseUrl = import.meta.env.VITE_API_URL;

export const endpoints = {
    // Static Files Endpoints
    staticPhotos: `${baseUrl}/uploads/photos`,
    staticLogos: `${baseUrl}/uploads/logos`,
    staticResumes: `${baseUrl}/uploads/resumes`,
    // Metadata Endpoints
    metadata: `${baseUrl}/metadata`,
    getCities: `${baseUrl}/metadata/cities`,
    getCompanySectors: `${baseUrl}/metadata/company-sectors`,
    getGenericPositions: `${baseUrl}/metadata/generic-positions`,
    getPerformanceAreas: `${baseUrl}/metadata/performance-areas`,
    // Job Schedules Endpoints
    jobSchedules: `${baseUrl}/job-schedules`,
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
    // Softwares Endpoints
    softwares: `${baseUrl}/softwares`,
    // Company Endpoints
    companies: `${baseUrl}/companies`,
    getUserCompany: `${baseUrl}/companies/by-user`,
    updateCompanyLogo: `${baseUrl}/companies/update-logo`,
    updateCompanyState: `${baseUrl}/companies/update-state`,
    // Company User Endpoints
    companyUsers: `${baseUrl}/company-users`,
    getStaff: `${baseUrl}/company-users/staff`,
    // Admin User Endpoints
    adminUsers: `${baseUrl}/admin-users`,
} as const