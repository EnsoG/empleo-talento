from pydantic import BaseModel, ConfigDict, EmailStr, field_validator
from enum import IntEnum, Enum

from utilities import validate_password, validate_empty_string

class UserRoleEnum(IntEnum):
    candidate = 0
    company_user = 1
    admin = 2

class NationalityEnum(str, Enum):
    AF = "Afganistán"
    AL = "Albania"
    DE = "Alemania"
    AD = "Andorra"
    AO = "Angola"
    AQ = "Antártida"
    SA = "Arabia Saudita"
    DZ = "Argelia"
    AR = "Argentina"
    AM = "Armenia"
    AU = "Australia"
    AT = "Austria"
    BE = "Bélgica"
    BS = "Bahamas"
    BD = "Bangladesh"
    BB = "Barbados"
    BZ = "Belice"
    BY = "Bielorrusia"
    MM = "Birmania"
    BO = "Bolivia"
    BA = "Bosnia y Herzegovina"
    BR = "Brasil"
    BG = "Bulgaria"
    BF = "Burkina Faso"
    CV = "Cabo Verde"
    KH = "Camboya"
    CM = "Camerún"
    CA = "Canadá"
    TD = "Chad"
    CL = "Chile"
    CN = "China"
    CY = "Chipre"
    VA = "Ciudad del Vaticano"
    CO = "Colombia"
    CG = "República del Congo"
    CD = "República Democrática del Congo"
    KP = "Corea del Norte"
    KR = "Corea del Sur"
    CI = "Costa de Marfil"
    CR = "Costa Rica"
    HR = "Croacia"
    CU = "Cuba"
    CW = "Curazao"
    DK = "Dinamarca"
    DM = "Dominica"
    EC = "Ecuador"
    EG = "Egipto"
    SV = "El Salvador"
    AE = "Emiratos Árabes Unidos"
    SK = "Eslovaquia"
    SI = "Eslovenia"
    ES = "España"
    US = "Estados Unidos de América"
    EE = "Estonia"
    ET = "Etiopía"
    PH = "Filipinas"
    FI = "Finlandia"
    FR = "Francia"
    GM = "Gambia"
    GE = "Georgia"
    GH = "Ghana"
    GI = "Gibraltar"
    GD = "Granada"
    GR = "Grecia"
    GL = "Groenlandia"
    GP = "Guadalupe"
    GT = "Guatemala"
    GF = "Guayana Francesa"
    GN = "Guinea"
    GQ = "Guinea Ecuatorial"
    HT = "Haití"
    HN = "Honduras"
    HK = "Hong Kong"
    HU = "Hungría"
    IN = "India"
    ID = "Indonesia"
    IR = "Irán"
    IQ = "Irak"
    IE = "Irlanda"
    IS = "Islandia"
    BM = "Islas Bermudas"
    KY = "Islas Caimán"
    MV = "Islas Maldivas"
    FK = "Islas Malvinas"
    MH = "Islas Marshall"
    VG = "Islas Vírgenes Británicas"
    IL = "Israel"
    IT = "Italia"
    JM = "Jamaica"
    JP = "Japón"
    JO = "Jordania"
    KZ = "Kazajistán"
    KE = "Kenia"
    KG = "Kirguistán"
    LB = "Líbano"
    LA = "Laos"
    LS = "Lesoto"
    LV = "Letonia"
    LR = "Liberia"
    LY = "Libia"
    LI = "Liechtenstein"
    LT = "Lituania"
    MX = "México"
    MO = "Macao"
    MK = "Macedônia"
    MG = "Madagascar"
    MY = "Malasia"
    MT = "Malta"
    MA = "Marruecos"
    MD = "Moldavia"
    MN = "Mongolia"
    ME = "Montenegro"
    MZ = "Mozambique"
    NP = "Nepal"
    NI = "Nicaragua"
    NG = "Nigeria"
    NO = "Noruega"
    NC = "Nueva Caledonia"
    NZ = "Nueva Zelanda"
    NL = "Países Bajos"
    PK = "Pakistán"
    PS = "Palestina"
    PA = "Panamá"
    PG = "Papúa Nueva Guinea"
    PY = "Paraguay"
    PE = "Perú"
    PL = "Polonia"
    PT = "Portugal"
    PR = "Puerto Rico"
    QA = "Qatar"
    GB = "Reino Unido"
    CZ = "República Checa"
    DO = "República Dominicana"
    RO = "Rumanía"
    RU = "Rusia"
    WS = "Samoa"
    SM = "San Marino"
    VC = "San Vicente y las Granadinas"
    SN = "Senegal"
    RS = "Serbia"
    SG = "Singapur"
    SY = "Siria"
    SO = "Somalia"
    ZA = "Sudáfrica"
    SD = "Sudán"
    SE = "Suecia"
    CH = "Suiza"
    SR = "Surinám"
    TH = "Tailandia"
    TW = "Taiwán"
    TZ = "Tanzania"
    TO = "Tonga"
    TN = "Túnez"
    TM = "Turkmenistán"
    TR = "Turquía"
    UA = "Ucrania"
    UG = "Uganda"
    UY = "Uruguay"
    UZ = "Uzbekistán"
    VE = "Venezuela"
    VN = "Vietnam"
    YE = "Yemen"
    ZM = "Zambia"
    ZW = "Zimbabue"

class SuscriptionStateEnum(str, Enum):
    active = "Activa"
    canceled = "Cancelada"
    expired = "Expirada"
    paused = "Pausada"
    pending = "Pendiente"
    trial = "Trial"

class PlanStateEnum(str, Enum):
    active = "Activo"
    inactive = "Inactivo"

class PaymentStateEnum(IntEnum):
    pending = 0
    successful = 1
    failed = 2

class BaseExtras(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

class GetPlan(BaseModel):
    plan_id: int
    name: str
    value: int
    description: str | None = None
    state: PlanStateEnum
    photo: str

class CreatePlan(BaseExtras):
    name: str
    value: int
    description: str | None = None
    state: PlanStateEnum

    @field_validator("name", "description")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

class ContactEmail(BaseExtras):
    full_name: str
    email: EmailStr
    subject: str
    message: str

    @field_validator("full_name", "subject", "message")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

class UpdatePlan(BaseExtras):
    name: str
    value: int
    description: str | None = None
    state: PlanStateEnum

    @field_validator("name", "description")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

class RequestResetPassword(BaseExtras):
    email: EmailStr
    user_role: UserRoleEnum

class ChangePassword(BaseExtras):
    token: str
    password: str

    @field_validator("token")
    def non_empty_string(cls, value: str) -> str:
        if not validate_empty_string(value):
            raise ValueError("Field cannot be an empty string")
        return value

    @field_validator("password")
    def password_validations(cls, value: str) -> str:
        if not validate_password(value):
            raise ValueError("Incorrect or invalid password")
        return value