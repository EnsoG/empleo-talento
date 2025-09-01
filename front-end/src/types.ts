export enum AppPaths {
    /* Portal Paths */
    home = "/",
    contact = "/contact",
    services = "/services",
    jobBoard = "/job-board",
    jobDetail = "/job-detail",
    publications = "/publications",
    portalPublicationDetail = "/publications/detail",
    companyOverview = "/company-overview",
    profesionalInfo = "/my-profile/profesional-info",
    personalInfo = "/my-profile/personal-info",
    postulations = "/my-profile/postulations",
    aboutUs = "/about-us",
    termsPolicies = "/terms-policies",
    /* Auth Paths */
    login = "/auth/login",
    adminLogin = "/auth/admin-login",
    registerCandidate = "/auth/register-candidate",
    registerCompany = "/auth/register-company",
    forgetPassword = "/auth/forget-password",
    changePassword = "/auth/change-password",
    /* Panel Paths */
    myAccount = "/panel/my-account",
    myCompanies = "/panel/my-companies",
    companyDetail = "/panel/my-companies/detail",
    mySoftwares = "/panel/my-softwares",
    myJobSchedules = "/panel/my-job-schedules",
    myCandidatePlans = "/panel/my-candidate-plans",
    addCandidatePlan = "/panel/my-candidate-plans/add",
    candidatePlanDetail = "/panel/my-candidate-plans/detail",
    myCompanyPlans = "/panel/my-company-plans",
    addCompanyPlan = "/panel/my-company-plans/add",
    companyPlanDetail = "/panel/my-company-plans/detail",
    myLanguages = "/panel/my-languages",
    myCompanySectors = "/panel/my-company-sectors",
    myPerformanceAreas = "/panel/my-performance-areas",
    myCertificationTypes = "/panel/my-certification-types",
    myRolePositions = "/panel/my-role-positions",
    myGenericPositions = "/panel/my-generic-positions",
    myContractTypes = "/panel/my-contract-types",
    myJobTypes = "/panel/my-job-types",
    myShifts = "/panel/my-shifts",
    myJobDays = "/panel/my-job-days",
    myPublications = "/panel/my-publications",
    addPublication = "/panel/my-publications/add",
    publicationDetail = "/panel/my-publications/detail",
    myPublicationCategories = "/panel/my-publication-categories",
    publishJob = "/panel/publish-job",
    myJobs = "/panel/my-jobs",
    jobManagement = "/panel/job-detail",
    myPendingJobs = "/panel/my-pending-jobs",
    adminJobManagement = "/panel/admin-job-management",
    myCompany = "/panel/my-company",
    myStaff = "/panel/my-staff",
    /* Other */
    notFound = "/not-found"
}

export const months: readonly string[] = [
    "Enero", "Febrero", "Marzo", "Abril",
    "Mayo", "Junio", "Julio", "Agosto",
    "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export enum Nationality {
    AF = "Afganistán",
    AL = "Albania",
    DE = "Alemania",
    AD = "Andorra",
    AO = "Angola",
    AQ = "Antártida",
    SA = "Arabia Saudita",
    DZ = "Argelia",
    AR = "Argentina",
    AM = "Armenia",
    AU = "Australia",
    AT = "Austria",
    BE = "Bélgica",
    BS = "Bahamas",
    BD = "Bangladesh",
    BB = "Barbados",
    BZ = "Belice",
    BY = "Bielorrusia",
    MM = "Birmania",
    BO = "Bolivia",
    BA = "Bosnia y Herzegovina",
    BR = "Brasil",
    BG = "Bulgaria",
    BF = "Burkina Faso",
    CV = "Cabo Verde",
    KH = "Camboya",
    CM = "Camerún",
    CA = "Canadá",
    TD = "Chad",
    CL = "Chile",
    CN = "China",
    CY = "Chipre",
    VA = "Ciudad del Vaticano",
    CO = "Colombia",
    CG = "República del Congo",
    CD = "República Democrática del Congo",
    KP = "Corea del Norte",
    KR = "Corea del Sur",
    CI = "Costa de Marfil",
    CR = "Costa Rica",
    HR = "Croacia",
    CU = "Cuba",
    CW = "Curazao",
    DK = "Dinamarca",
    DM = "Dominica",
    EC = "Ecuador",
    EG = "Egipto",
    SV = "El Salvador",
    AE = "Emiratos Árabes Unidos",
    SK = "Eslovaquia",
    SI = "Eslovenia",
    ES = "España",
    US = "Estados Unidos de América",
    EE = "Estonia",
    ET = "Etiopía",
    PH = "Filipinas",
    FI = "Finlandia",
    FR = "Francia",
    GM = "Gambia",
    GE = "Georgia",
    GH = "Ghana",
    GI = "Gibraltar",
    GD = "Granada",
    GR = "Grecia",
    GL = "Groenlandia",
    GP = "Guadalupe",
    GT = "Guatemala",
    GF = "Guayana Francesa",
    GN = "Guinea",
    GQ = "Guinea Ecuatorial",
    HT = "Haití",
    HN = "Honduras",
    HK = "Hong Kong",
    HU = "Hungría",
    IN = "India",
    ID = "Indonesia",
    IR = "Irán",
    IQ = "Irak",
    IE = "Irlanda",
    IS = "Islandia",
    BM = "Islas Bermudas",
    KY = "Islas Caimán",
    MV = "Islas Maldivas",
    FK = "Islas Malvinas",
    MH = "Islas Marshall",
    VG = "Islas Vírgenes Británicas",
    IL = "Israel",
    IT = "Italia",
    JM = "Jamaica",
    JP = "Japón",
    JO = "Jordania",
    KZ = "Kazajistán",
    KE = "Kenia",
    KG = "Kirguistán",
    LB = "Líbano",
    LA = "Laos",
    LS = "Lesoto",
    LV = "Letonia",
    LR = "Liberia",
    LY = "Libia",
    LI = "Liechtenstein",
    LT = "Lituania",
    MX = "México",
    MO = "Macao",
    MK = "Macedônia",
    MG = "Madagascar",
    MY = "Malasia",
    MT = "Malta",
    MA = "Marruecos",
    MD = "Moldavia",
    MN = "Mongolia",
    ME = "Montenegro",
    MZ = "Mozambique",
    NP = "Nepal",
    NI = "Nicaragua",
    NG = "Nigeria",
    NO = "Noruega",
    NC = "Nueva Caledonia",
    NZ = "Nueva Zelanda",
    NL = "Países Bajos",
    PK = "Pakistán",
    PS = "Palestina",
    PA = "Panamá",
    PG = "Papúa Nueva Guinea",
    PY = "Paraguay",
    PE = "Perú",
    PL = "Polonia",
    PT = "Portugal",
    PR = "Puerto Rico",
    QA = "Qatar",
    GB = "Reino Unido",
    CZ = "República Checa",
    DO = "República Dominicana",
    RO = "Rumanía",
    RU = "Rusia",
    WS = "Samoa",
    SM = "San Marino",
    VC = "San Vicente y las Granadinas",
    SN = "Senegal",
    RS = "Serbia",
    SG = "Singapur",
    SY = "Siria",
    SO = "Somalia",
    ZA = "Sudáfrica",
    SD = "Sudán",
    SE = "Suecia",
    CH = "Suiza",
    SR = "Surinám",
    TH = "Tailandia",
    TW = "Taiwán",
    TZ = "Tanzania",
    TO = "Tonga",
    TN = "Túnez",
    TM = "Turkmenistán",
    TR = "Turquía",
    UA = "Ucrania",
    UG = "Uganda",
    UY = "Uruguay",
    UZ = "Uzbekistán",
    VE = "Venezuela",
    VN = "Vietnam",
    YE = "Yemen",
    ZM = "Zambia",
    ZW = "Zimbabue",
}

export enum Gender {
    male = "Masculino",
    female = "Femenino",
    dontSpecify = "No Especificar"
}

export interface User {
    sub: string;
    email: string;
    user_role: UserRole;
    user_position: UserPosition | null;
}

export enum UserRole {
    candidate = 0,
    company = 1,
    admin = 2
}

export const userRoles: readonly { name: string, value: UserRole }[] = [
    {
        name: "Candidato",
        value: UserRole.candidate
    },
    {
        name: "Empresa",
        value: UserRole.company
    },
    {
        name: "Administrador",
        value: UserRole.admin
    }
];


export enum UserPosition {
    founder = "Fundador",
    staff = "Staff"
}

export enum UserState {
    verify = 0,
    active = 1,
    inactive = 2
}

export const companyUserStates: readonly { name: string, value: UserState }[] = [
    {
        name: "Por Verificar",
        value: UserState.verify
    },
    {
        name: "Activo",
        value: UserState.active
    },
    {
        name: "Inactivo",
        value: UserState.inactive
    }
];

export type Region = {
    number_region: number;
    name: string;
}

export type City = {
    city_id: number;
    name: string;
}

export type PerformanceArea = {
    area_id: number;
    name: string;
}

export type PerformanceAreas = {
    total_areas: number;
    performance_areas: PerformanceArea[];
}

export type ContractType = {
    type_id: number;
    name: string;
}

export type ContractTypes = {
    total_contracts: number;
    contract_types: ContractType[];
}

export type CompanySector = {
    sector_id: number;
    name: string;
}

export type CompanySectors = {
    total_sectors: number;
    company_sectors: CompanySector[];
}

export type JobType = {
    job_type_id: number;
    name: string;
}

export type JobTypes = {
    total_types: number;
    job_types: JobType[];
}

export type JobSchedule = {
    schedule_id: number;
    name: string;
}

export type JobSchedules = {
    total_schedules: number;
    job_schedules: JobSchedule[];
}

export type Shift = {
    shift_id: number;
    name: string;
}

export type Shifts = {
    total_shifts: number;
    shifts: Shift[];
}

export type JobDay = {
    day_id: number;
    name: string;
}

export type JobDays = {
    total_days: number;
    job_days: JobDay[];
}

export enum QuestionType {
    yesOrNo = 0,
    numeric = 1,
    text = 2
}

export const questionTypes: readonly { name: string, value: QuestionType }[] = [
    {
        name: "Si y No",
        value: QuestionType.yesOrNo
    },
    {
        name: "Numerica",
        value: QuestionType.numeric
    },
    {
        name: "Texto",
        value: QuestionType.text
    }
];

export type Question = {
    question_id: number;
    question: string;
    question_type: QuestionType;
}

export type RolePosition = {
    role_id: number;
    name: string;
}

export type RolePositions = {
    total_roles: number;
    role_positions: RolePosition[];
}

export type GenericPosition = {
    position_id: number;
    name: string;
    role_position: RolePosition;
}

export type GenericPositions = {
    total_positions: number;
    generic_positions: GenericPosition[];
}

export enum OfferState {
    pending = "Pendiente Aprobacion",
    active = "Activa",
    finished = "Finalizada"
}

export enum OfferFeaturedState {
    standard = 0,
    featured = 1
}

export const offerFeaturedStates: readonly { name: string, value: OfferFeaturedState }[] = [
    {
        name: "Estandar",
        value: OfferFeaturedState.standard
    },
    {
        name: "Destacado",
        value: OfferFeaturedState.featured
    }
];

export type Offer = {
    offer_id: number;
    code: number;
    title: string;
    position: string;
    description: string | null;
    requirements: string | null;
    years_experience: string | null;
    salary: number | null;
    location: string | null;
    publication_date: string;
    closing_date: string | null;
    state: OfferState;
    featured: OfferFeaturedState;
    performance_area: PerformanceArea | null;
    city: City & { region: Region } | null;
    company: SummaryCompany | null;
    contract_type: ContractType | null;
    job_type: JobType | null;
    job_schedule: JobSchedule | null;
    shift: Shift | null;
    job_day: JobDay | null;
    job_questions: Question[];
}

export type SummaryOffer = Pick<Offer,
    "offer_id" |
    "code" |
    "title" |
    "description" |
    "position" |
    "publication_date" |
    "closing_date" |
    "state" |
    "featured" |
    "city" |
    "company" |
    "contract_type"
>

export type Offers = {
    total_offers: number;
    offers: SummaryOffer[];
}

// Scraper Types
export type CodelcoJob = {
    id: number;
    title: string;
    location: string;
    external_id: string;
    external_url: string;
    url?: string; // Campo alternativo para compatibilidad
    region: string;
    postal_code: string;
    publication_date: string;
    created_at: string;
    is_active: boolean;
    description?: string;
    requirements?: string;
}

export type CodelcoJobsResponse = {
    status: string;
    count: number;
    jobs: CodelcoJob[];
}

export type ScraperStatus = {
    status: string;
    scrapers: {
        [key: string]: {
            name: string;
            url: string;
            status: string;
            description: string;
        }
    };
    total_scrapers: number;
}

export type Company = {
    company_id: number;
    rut: string;
    legal_name: string;
    trade_name: string;
    web: string | null;
    email: string;
    description: string | null;
    phone: string;
    logo: string | null;
    company_sector: CompanySector | null;
}

export type SummaryCompany = Omit<Company,
    "legal_name" |
    "rut"
>;

export type CompanyUser = {
    user_id: number;
    name: string;
    paternal: string;
    maternal: string | null;
    position: string;
    phone: string;
    email: string;
    state: UserState;
    company_id: number;
}

export type CompanyPanel = Company & Pick<CompanyUser, "state">;

export type CandidateStudy = {
    study_id: number;
    title: string;
    institution: string;
    start_date: string;
    end_date: string | null;
}
export type DriverLicense = {
    license_id: number;
    license: string;
}
export type Candidate = {
    candidate_id: number;
    run: string | null;
    name: string;
    paternal: string;
    maternal: string;
    birth_date: string | null;
    gender: string | null;
    nationality: string | null;
    featured_study: string | null;
    phone: string | null;
    email: string;
    photo: string | null;
    resume: string | null;
    driver_license: DriverLicense | null;
}

export type SummaryCandidate = Pick<Candidate,
    "candidate_id" |
    "name" |
    "paternal" |
    "maternal" |
    "phone" |
    "email">

export type JobAnswer = {
    answer_id: number;
    answer: string;
    job_question: Question;
}

export enum PostulationState {
    postulate = "Postulado",
    inProgress = "En Proceso",
    notSelected = "No Seleccionado",
    contracted = "Contratado"
}

export type Postulation = {
    postulation_id: number;
    postulation_date: string;
    state: PostulationState;
    offer_id: number;
    job_offer: SummaryOffer;
    candidate: SummaryCandidate;
    job_answers: JobAnswer[];
}

export type CandidatePostulation = Omit<Postulation, "candidate" | "job_answers">;

export type PanelPostulation = Omit<Postulation, "job_offer">;

export type WorkExperience = {
    experience_id: number;
    position: string;
    description: string | null;
    company: string | null;
    start_date: string;
    end_date: string | null;
}

export type CertificationType = {
    certification_type_id: number;
    name: string;
}

export type CertificationTypes = {
    total_types: number;
    certification_types: CertificationType[];
}

export type CandidateCertification = {
    certification_id: number;
    name: string;
    institution: string | null;
    obtained_date: string | null;
    expiration_date: string | null;
    description: string | null;
    certification_type: CertificationType
}

export type Software = {
    software_id: number;
    name: string;
}

export type Softwares = {
    total_softwares: number;
    softwares: Software[];
}

export type KnowledgeLevel = {
    level_id: number;
    name: string;
}

export type CandidateSoftware = {
    candidate_software_id: number;
    software: Software;
    knownledge_level: KnowledgeLevel;
}

export type Language = {
    language_id: number;
    name: string;
}

export type Languages = {
    total_languages: number;
    languages: Language[];
}

export type LanguageLevel = {
    level_id: number;
    name: string;
}

export type CandidateLanguage = {
    candidate_language_id: number;
    language: Language;
    language_level: LanguageLevel;
}

export type Metadata = {
    knownledge_levels: KnowledgeLevel[];
    language_levels: LanguageLevel[];
    regions: Region[];
}

export type Admin = {
    admin_id: number;
    name: string;
    paternal: string;
    maternal: string | null;
    email: string;
}

export enum PlanState {
    active = "Activo",
    inactive = "Inactivo"
}

export type CandidatePlan = {
    plan_id: number;
    name: string;
    value: number;
    description: string | null;
    state: PlanState,
    photo: string | null;
}

export type CandidatePlans = {
    total_plans: number;
    candidate_plans: CandidatePlan[];
}

export type CompanyPlan = CandidatePlan;

export type CompanyPlans = {
    total_plans: number;
    company_plans: CompanyPlan[];
}

export type PublicationCategory = {
    category_id: number;
    name: string;
}

export type PublicationCategories = {
    total_categories: number;
    publication_categories: PublicationCategory[];
}

export enum PublicationState {
    active = "Activa",
    incative = "Inactiva"
}

export type Publication = {
    publication_id: number;
    title: string;
    description: string;
    creation_date: string;
    image: string;
    state: PublicationState;
    publication_category: PublicationCategory;
}

export type Publications = {
    total_publications: number;
    publications: Publication[];
}