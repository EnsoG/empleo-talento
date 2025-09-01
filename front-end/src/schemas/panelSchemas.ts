import { z } from "zod";

import {
    validateEarlierDate,
    emptyStringToNull,
    validateRun
} from "../utilities";

/* Field Validations */
const titleValidation = z.string().nonempty({ message: "El titulo es obligatorio" });
const descriptionValidation = z.string().transform((value) => emptyStringToNull(value)).nullable();
const requirementsValidation = z.string().transform((value) => emptyStringToNull(value)).nullable();
const yearsExperienceValidation = z.string().transform((value) => emptyStringToNull(value)).nullable();
const locationValidation = z.string().transform((value) => emptyStringToNull(value)).nullable();
const closingDateValidation = z.date({ invalid_type_error: "La fecha ingresada no es valida" }).nullable();
const areaValidation = z.string().transform((value) => Number(value)).nullable();
const regionValidation = z.string().nullable().optional();
const cityValidation = z.string().transform((value) => Number(value)).nullable();
const typeValidation = z.string().transform((value) => Number(value)).nullable();
const questionValidation = z.object({
    question: z.string().nonempty({ message: "La pregunta es obligatoria" }),
    question_type: z.string().nonempty({ message: "Seleccionar el tipo de pregunta es obligatorio" }).transform((value) => Number(value))
});
const emailValidation = z.string().email({ message: "El correo electronico es obligatorio" })
const phoneValidation = z.string().regex(/^(?:\+?56)?9\d{8}$/, "Número telefonico inválido").nonempty({ message: "El numero telefonico es obligatorio" })
const userStateValidation = z.string().nonempty({ message: "El estado es obligatorio" }).transform((value) => Number(value));

/* Schemas */
export const publishJobOneSchema = z.object({
    title: titleValidation,
    has_generic_position: z.boolean().optional(),
    generic_position_id: z.string().nullable(),
    position: z.string().nonempty({ message: "El puesto es obligatorio" }),
    description: descriptionValidation,
    requirements: requirementsValidation,
    years_experience: yearsExperienceValidation,
    salary: z.number().gt(0, { message: "El salario debe ser mayor a 0" }).nullable(),
    location: locationValidation,
    publication_date: z.date({ required_error: "La fecha de publicacion es obligatoria", invalid_type_error: "La fecha ingresada no es valida" }),
    closing_date: closingDateValidation,
    area_id: areaValidation,
    region: regionValidation,
    city_id: cityValidation,
    type_id: typeValidation,
    job_type_id: z.string().transform((value) => Number(value)).nullable(),
    shift_id: z.string().transform((value) => Number(value)).nullable(),
    day_id: z.string().transform((value) => Number(value)).nullable(),
    schedule_id: z.string().transform((value) => Number(value)).nullable()
});

export const publishJobTwoSchema = z.object({
    questions: z.array(questionValidation).transform((value) => (value.length != 0) ? value : null).nullable()
});

export const publishJobFullSchema = publishJobOneSchema.merge(publishJobTwoSchema)
    .superRefine((data, ctx) => {
        // Check Generic Position
        if (data.has_generic_position) {
            if (!data.generic_position_id) {
                ctx.addIssue({
                    code: "custom",
                    path: ["generic_position_id"],
                    message: "Debe seleccionar un cargo genérico si la opción está activada",
                });
            }
        }
        // Check Publication Eariler Date Validation
        if (!validateEarlierDate(data.publication_date, data.closing_date)) {
            ctx.addIssue({
                code: "custom",
                path: ["closing_date"],
                message: "La fecha de cierre debe ser mayor a la fecha de publicacion"
            });
        }
    });

export const updateJobSchema = z.object({
    title: titleValidation,
    description: descriptionValidation,
    requirements: requirementsValidation,
    years_experience: yearsExperienceValidation,
    location: locationValidation,
    publication_date: z.date().optional(),
    closing_date: closingDateValidation,
    city_id: cityValidation,
    area_id: areaValidation,
    type_id: typeValidation,
    job_type_id: z.string().transform((value) => Number(value)).nullable(),
    shift_id: z.string().transform((value) => Number(value)).nullable(),
    schedule_id: z.string().transform((value) => Number(value)).nullable(),
    day_id: z.string().transform((value) => Number(value)).nullable()
}).superRefine((data, ctx) => {
    // Check Publication Eariler Date Validation
    if (data.publication_date && !validateEarlierDate(data.publication_date, data.closing_date)) {
        ctx.addIssue({
            code: "custom",
            path: ["closing_date"],
            message: "La fecha de cierre debe ser mayor a la fecha de publicacion"
        });
    }
});

export const createStaffSchema = z.object({
    name: z.string().nonempty({ message: "El nombre del personal es obligatorio" }),
    paternal: z.string().nonempty({ message: "El apellido paterno del personal es obligatorio" }),
    maternal: z.string().transform((value) => emptyStringToNull(value)).nullable(),
    position: z.string().nonempty({ message: "El cargo del personal es obligatorio" }),
    phone: phoneValidation,
    email: emailValidation,
    password: z.string()
        .min(6, { message: 'Debe tener al menos 6 caracteres' })
        .regex(/^[a-zA-Z0-9]+$/, { message: 'Debe ser alfanumérica (solo letras y números)' }),
    confirm_password: z.string().optional()
}).refine((data) => data.password === data.confirm_password, {
    message: 'Las contraseñas deben ser identicas',
    path: ['confirmPassword']
});

export const updateStaffStateSchema = z.object({
    state: userStateValidation
});

export const companyUserInfoSchema = z.object({
    name: z.string().nonempty({ message: "El nombre es obligatorio" }),
    paternal: z.string().nonempty({ message: "El apellido paterno es obligatorio" }),
    maternal: z.string().transform((value) => emptyStringToNull(value)).nullable(),
    phone: phoneValidation,
});

export const updateCompanyStateSchema = z.object({
    state: userStateValidation
});

export const updateJobStateSchema = z.object({
    state: z.string().nonempty({ message: "El estado de la oferta es obligatorio" })
});

export const adminInfoSchema = z.object({
    name: z.string().nonempty({ message: "El nombre es obligatorio" }),
    paternal: z.string().nonempty({ message: "El apellido paterno es obligatorio" }),
    maternal: z.string().transform((value) => emptyStringToNull(value)).nullable(),
});

export const softwareSchema = z.object({
    name: z.string().nonempty({ message: "El nombre es obligatorio" })
});

export const languageSchema = z.object({
    name: z.string().nonempty({ message: "El nombre es obligatorio" })
});

export const rolePositionSchema = z.object({
    name: z.string().nonempty({ message: "El nombre es obligatorio" })
});

export const genericPositionSchema = z.object({
    name: z.string().nonempty({ message: "El nombre es obligatorio" }),
    role_id: z.string().nonempty({ message: "Seleccionar el rol de cargo es obligatorio" }).transform((value) => Number(value))
});

export const companySectorSchema = z.object({
    name: z.string().nonempty({ message: "El nombre es obligatorio" })
});

export const certificationTypeSchema = z.object({
    name: z.string().nonempty({ message: "El nombre es obligatorio" })
});

export const performanceAreaSchema = z.object({
    name: z.string().nonempty({ message: "El nombre es obligatorio" })
});

export const contractTypeSchema = z.object({
    name: z.string().nonempty({ message: "El nombre es obligatorio" })
});

export const jobTypeSchema = z.object({
    name: z.string().nonempty({ message: "El nombre es obligatorio" })
});

export const shiftSchema = z.object({
    name: z.string().nonempty({ message: "El nombre es obligatorio" })
});

export const scheduleSchema = z.object({
    name: z.string().nonempty({ message: "El nombre es obligatorio" })
});

export const jobDaySchema = z.object({
    name: z.string().nonempty({ message: "El nombre es obligatorio" })
});

export const publicationCategorySchema = z.object({
    name: z.string().nonempty({ message: "El nombre es obligatorio" })
});

export const addPublicationSchema = z.object({
    title: z.string().nonempty({ message: "El titulo es obligatorio" }),
    description: z.string().nonempty({ message: "La descripcion es obligatoria" }),
    state: z.string().nonempty({ message: "Seleccionar el estado es obligatorio" }),
    image: z.instanceof(File, { message: "Seleccionar una imagen es obligatorio" })
        .refine((file) => file === null || file.size <= 1 * 1024 ** 2, {
            message: "El archivo debe pesar menos de 1MB",
        })
        .refine((file) => file === null || file.type === "image/jpeg", {
            message: "Solo se permiten imágenes JPEG",
        }),
    category_id: z.string().nonempty({ message: "Seleccionar la categoria es obligatorio" }).transform((value) => Number(value))
});

export const updatePublicationSchema = z.object({
    title: z.string().nonempty({ message: "El titulo es obligatorio" }),
    description: z.string().nonempty({ message: "La descripcion es obligatoria" }),
    state: z.string().nonempty({ message: "Seleccionar el estado es obligatorio" }),
    image: z.instanceof(File).nullable()
        .refine((file) => file === null || file.size <= 1 * 1024 ** 2, {
            message: "El archivo debe pesar menos de 1MB",
        })
        .refine((file) => file === null || file.type === "image/jpeg", {
            message: "Solo se permiten imágenes JPEG",
        }),
    category_id: z.string().nonempty({ message: "Seleccionar la categoria es obligatorio" }).transform((value) => Number(value))
});

export const addPlanSchema = z.object({
    name: z.string().nonempty({ message: "El nombre es obligatorio" }),
    value: z.number({ required_error: "El valor del plan es obligatorio" }).gt(0, { message: "El valor del plan debe ser mayor a 0" }),
    description: z.string().transform((value) => emptyStringToNull(value)).nullable(),
    state: z.string().nonempty({ message: "El estado del plan es obligatorio" }),
    photo: z.instanceof(File)
        .refine((file) => file === null || file.size <= 1 * 1024 ** 2, {
            message: "El archivo debe pesar menos de 1MB",
        })
        .refine((file) => file === null || file.type === "image/jpeg", {
            message: "Solo se permiten imágenes JPEG",
        }),
});

export const updatePlanSchema = z.object({
    name: z.string().nonempty({ message: "El nombre es obligatorio" }),
    value: z.number({ required_error: "El valor del plan es obligatorio" }).gt(0, { message: "El valor del plan debe ser mayor a 0" }),
    description: z.string().transform((value) => emptyStringToNull(value)).nullable(),
    state: z.string().nonempty({ message: "El estado del plan es obligatorio" }),
    photo: z.instanceof(File).nullable()
        .refine((file) => file === null || file.size <= 1 * 1024 ** 2, {
            message: "El archivo debe pesar menos de 1MB",
        })
        .refine((file) => file === null || file.type === "image/jpeg", {
            message: "Solo se permiten imágenes JPEG",
        }),
});

export const createCompanySchema = z.object({
    name: z.string().nonempty({ message: "El nombre es obligatorio" }),
    paternal: z.string().nonempty({ message: "El apellido paterno es obligatorio" }),
    maternal: z.string().transform((value) => emptyStringToNull(value)).nullable(),
    phone: z.string().regex(/^(?:\+?56)?9\d{8}$/, "Número telefonico inválido").nonempty({ message: "El numero telefonico es obligatorio" }),
    email: emailValidation,
    password: z.string()
        .min(6, { message: 'Debe tener al menos 6 caracteres' })
        .regex(/^[a-zA-Z0-9]+$/, { message: 'Debe ser alfanumérica (solo letras y números)' }),
    confirm_password: z.string().optional(),
    rut: z.string().nonempty({ message: "El RUT es obligatorio" }).refine((run) => validateRun(run), { message: "El RUT es invalido" }),
    legal_name: z.string().min(1, { message: "La razon social es obligatoria" }),
    trade_name: z.string().min(1, { message: "El nombre fantasia es obligatorio" }),
    company_phone: z.string().regex(/^(?:\+?56)?9\d{8}$/, "Número telefonico inválido").nonempty({ message: "El numero telefonico es obligatorio" }),
    company_email: emailValidation,
    sector_id: z.string().min(1, { message: "Seleccionar el sector es obligatorio" })
}).refine((data) => data.password === data.confirm_password, {
    message: 'Las contraseñas deben ser identicas',
    path: ['confirm_password']
}).transform((data) => {
    // Delete Unnecesary Fields And Return Data
    delete data.confirm_password;
    const {
        rut,
        legal_name,
        trade_name,
        company_email,
        company_phone,
        sector_id,
        ...rest
    } = data;

    return {
        rut,
        legal_name,
        trade_name,
        email: company_email,
        phone: company_phone,
        sector_id: Number(sector_id),
        company_user: {
            ...rest
        }
    };
});

export const updateCompanySchema = z.object({
    trade_name: z.string().nonempty({ message: "El nombre fantasia es obligatorio" }),
    description: z.string().transform((value) => emptyStringToNull(value)).nullable(),
    email: emailValidation,
    phone: phoneValidation,
    web: z.string().transform((value) => emptyStringToNull(value)).nullable()
        .refine((value) => !value || /^www\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(value), {
            message: "Debe ingresar una URL válida que comience con 'www.' y termine con un dominio"
        }),
    sector_id: z.string().nullable().transform((value) => (value) ? Number(value) : null)
});