import { z } from "zod";

import {
    getTomorrowDate,
    validateEarlierDate,
    emptyStringToNull
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
    publication_date: z.date({ required_error: "La fecha de publicacion es obligatoria", invalid_type_error: "La fecha ingresada no es valida" })
        .min(new Date(), { message: "La fecha de publicacion debe ser mayor a hoy" })
        .default(getTomorrowDate),
    closing_date: closingDateValidation,
    area_id: areaValidation,
    region: regionValidation,
    city_id: cityValidation,
    type_id: typeValidation,
    job_type: z.string().transform((value) => emptyStringToNull(value)).nullable(),
    shift: z.string().transform((value) => emptyStringToNull(value)).nullable(),
    job_day: z.string().transform((value) => emptyStringToNull(value)).nullable(),
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
        // Check Job Type Validation, All Or Nothing
        const fields = ["job_type", "shift", "job_day"] as const;
        const definedFields = fields.filter(field => data[field] !== null && data[field] !== undefined);
        if (definedFields.length > 0 && definedFields.length < fields.length) {
            const missingFields = fields.filter(field => data[field] === null || data[field] === undefined);
            for (const field of missingFields) {
                ctx.addIssue({
                    code: "custom",
                    path: [field],
                    message: "Este campo es obligatorio si los demás campos relacionados a 'Tipo Jornada' están definidos"
                });
            }
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
    type_id: typeValidation
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

export const companyDetailsSchema = z.object({
    trade_name: z.string().nonempty({ message: "El nombre fantasia es obligatorio" }),
    description: z.string().transform((value) => emptyStringToNull(value)).nullable(),
    email: emailValidation,
    phone: phoneValidation,
    web: z.string().transform((value) => emptyStringToNull(value)).nullable()
        .refine((value) => !value || /^www\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(value), {
            message: "Debe ingresar una URL válida que comience con 'www.' y termine con un dominio"
        }),
    sector_id: z.string().nullable().transform((value) => value != "" ? Number(value) : null)
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

export const scheduleSchema = z.object({
    name: z.string().nonempty({ message: "El nombre es obligatorio" })
});