export enum AppPaths {
    /* Portal Paths */
    home = "/",
    contact = "/contact",
    services = "/services",
    jobBoard = "/job-board",
    jobDetail = "/job-detail",
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
    mySoftwares = "/panel/my-softwares",
    myJobSchedules = "/panel/my-job-schedules",
    companyDetail = "/panel/company-detail",
    publishJob = "/panel/publish-job",
    myJobs = "/panel/my-jobs",
    jobManagement = "/panel/job-detail",
    myStaff = "/panel/my-staff",
    companyInfo = "/panel/company-info",
    /* Other */
    notFound = "/not-found"
}

export const months: readonly string[] = [
    "Enero", "Febrero", "Marzo", "Abril",
    "Mayo", "Junio", "Julio", "Agosto",
    "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export const driverLicenses: readonly string[] = [
    "A1", "A2", "A3"
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

export type ContractType = {
    type_id: number;
    name: string;
}

export type CompanySector = {
    sector_id: number;
    name: string;
}

export type JobType = {
    job_type_id: number;
    name: string;
}

export const jobTypes: readonly string[] = [
    "Jornada Ordinaria",
    "Jornada Bisemanal",
    "Jornada Excepcional",
    "Teletrabajo",
    "Hibrido",
    "Part-Time",
    "Freelance"
];

export type JobSchedule = {
    schedule_id: number;
    name: string;
}

export type JobSchedules = {
    total_schedules: number;
    job_schedules: JobSchedule[];
}

export const shifts: readonly string[] = [
    "5x2", "6x1", "10x5",
    "8x6", "7x7", "4x4",
    "4x3", "10x10", "14x14"
];

export const jobDays: readonly string[] = [
    "Lunes a Viernes",
    "Lunes a Sabado",
    "Martes a Lunes",
    "Miercoles a Martes",
    "Lunes a Jueves"
];


export enum QuestionType {
    yesOrNo = 0,
    numeric = 1
}

export const questionTypes: readonly { name: string, value: QuestionType }[] = [
    {
        name: "Si y No",
        value: QuestionType.yesOrNo
    },
    {
        name: "Numerica",
        value: QuestionType.numeric
    }
];

export type Question = {
    question_id: number;
    question: string;
    question_type: QuestionType;
}

export type GenericPosition = {
    position_id: number;
    name: string;
    role_id: number;
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
    job_type: Pick<JobType, "name"> | null;
    job_schedule: Pick<JobSchedule, "name"> | null;
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
    license_id: number | null;
}

export type SummaryCandidate = Pick<Candidate,
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
    languages: Language[];
    language_levels: LanguageLevel[];
    certification_types: CertificationType[];
    contract_types: ContractType[];
    regions: Region[];
}

export type Admin = {
    admin_id: number;
    name: string;
    paternal: string;
    maternal: string | null;
    email: string;
}