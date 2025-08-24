import { z } from "zod";

import { removeDateTime, validateEarlierDate, emptyStringToNull, validateRun } from "../utilities";

/* Field Validations */
const emailValidation = z.string().email({ message: "El correo electronico no es invalido" });
const answerValidation = z.object({
    question_id: z.number(),
    answer: z.union([z.string(), z.number()])
        .transform((val) => val.toString())
        .refine(val => val.length > 0, { message: "La respuesta es obligatoria" }),
});
const levelValidation = z.string().nonempty({ message: "Seleccionar el nivel de conocimiento es obligatorio" });

/* Schemas */
export const contactSchema = z.object({
    full_name: z.string().min(1, { message: "El nombre completo es obligatorio" }),
    email: emailValidation,
    subject: z.string().min(1, { message: "El asunto es obligatorio" }),
    message: z.string().min(1, { message: "El mensaje es obligatorio" })
});

export const jobQuestionsFormSchema = z.object({
    answers: z.array(answerValidation)
});

export const profileFeaturedEducationSchema = z.object({
    featured_study: z.string().trim().transform((value) => emptyStringToNull(value)).nullable()
});

export const profileEducationSchema = z.object({
    title: z.string().nonempty({ message: "El titulo del estudio es obligatorio" }),
    institution: z.string().nonempty({ message: "La institucion del estudio es obligatoria" }),
    start_date: z.date({ required_error: "La fecha de inicio es obligatoria", invalid_type_error: "La fecha ingresada no es valida" }),
    end_date: z.date({ invalid_type_error: "La fecha ingresada no es valida" }).nullable()
}).refine((data) => validateEarlierDate(data.start_date, data.end_date), {
    message: "La fecha de fin debe ser mayor a la fecha de inicio",
    path: ["end_date"]
}).transform((data) => {
    const {
        start_date,
        end_date,
        ...rest
    } = data;

    return {
        ...rest,
        start_date: removeDateTime(start_date),
        end_date: end_date ? removeDateTime(end_date) : null
    }
});

export const profileExperienceSchema = z.object({
    position: z.string().nonempty({ message: "El nombre del puesto es obligatorio" }),
    description: z.string().nullable(),
    company: z.string().nullable(),
    start_date: z.date({ required_error: "La fecha de inicio es obligatoria", invalid_type_error: "La fecha ingresada no es valida" }),
    end_date: z.date({ invalid_type_error: "La fecha ingresada no es valida" }).nullable(),
}).refine((data) => validateEarlierDate(data.start_date, data.end_date), {
    message: "La fecha de fin debe ser mayor a la fecha de inicio",
    path: ["end_date"]
}).transform((data) => {
    const {
        description,
        company,
        start_date,
        end_date,
        ...rest
    } = data;

    return {
        description: (description != "") ? description : null,
        company: (company != "") ? company : null,
        start_date: removeDateTime(start_date),
        end_date: end_date ? removeDateTime(end_date) : null,
        ...rest,
    }
});

export const profileCertificationSchema = z.object({
    name: z.string().nonempty({ message: "El nombre del certificado es obligatorio" }),
    institution: z.string().nullable(),
    description: z.string().nullable(),
    obtained_date: z.date({ invalid_type_error: "La fecha ingresada no es valida" }).nullable(),
    expiration_date: z.date({ invalid_type_error: "La fecha ingresada no es valida" }).nullable(),
    certification_type_id: z.string().nonempty({ message: "Seleccionar el tipo de certificado es obligatorio" })
}).refine((data) => validateEarlierDate(data.obtained_date, data.expiration_date), {
    message: "La fecha de vencimiento debe ser mayor a la fecha de obtencion",
    path: ["expiration_date"]
}).transform((data) => {
    const {
        institution,
        description,
        obtained_date,
        expiration_date,
        certification_type_id,
        ...rest
    } = data;

    return {
        ...rest,
        institution: (institution !== "") ? institution : null,
        description: (description !== "") ? description : null,
        obtained_date: obtained_date ? removeDateTime(obtained_date) : null,
        expiration_date: expiration_date ? removeDateTime(expiration_date) : null,
        certification_type_id: Number(certification_type_id)
    }
});

export const createSoftwareSchema = z.object({
    software: z.string().nonempty({ message: "Seleccionar un software es obligatorio" }),
    level: levelValidation
}).transform((data) => {
    const { software, level } = data;
    return {
        software_id: Number(software),
        level_id: Number(level)
    }
});

export const updateSoftwareSchema = z.object({
    level: levelValidation
}).transform((data) => ({ level_id: Number(data.level) }));

export const createLanguageSchema = z.object({
    language: z.string().nonempty({ message: "Seleccionar el idioma es obligatorio" }),
    level: levelValidation
}).transform((data) => {
    const { language, level } = data;
    return {
        language_id: Number(language),
        level_id: Number(level)
    }
});

export const updateLanguageSchema = z.object({
    level: levelValidation
}).transform((data) => ({ level_id: Number(data.level) }));

export const personalInfoSchema = z.object({
    name: z.string().nonempty({ message: "El nombre es obligatorio" }),
    paternal: z.string().nonempty({ message: "El apellido paterno es obligatorio" }),
    maternal: z.string().transform((value) => emptyStringToNull(value)).nullable(),
    run: z.string().transform((value) => emptyStringToNull(value)).nullable(),
    birth_date: z.date().nullable().refine((date) => {
        if (!date) return true;
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        const monthDiff = today.getMonth() - date.getMonth();
        const dayDiff = today.getDate() - date.getDate();
        return age > 18 || (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));
    }, { message: "Debes ser mayor de edad" }).transform((data) => data && removeDateTime(data)),
    phone: z.string().transform((value) => emptyStringToNull(value)).nullable(),
    gender: z.string().transform((value) => emptyStringToNull(value)).nullable(),
    nationality: z.string().transform((value) => emptyStringToNull(value)).nullable(),
    license_id: z.string().transform((value) => Number(value)).nullable()
}).refine((data) => data.phone == null || /^(?:\+?56)?9\d{8}$/.test(data.phone), {
    message: "Número telefónico inválido",
    path: ["phone"],
}).refine((data) => data.run == null || validateRun(data.run), {
    message: "Formato de RUT incorrecto",
    path: ["run"]
});