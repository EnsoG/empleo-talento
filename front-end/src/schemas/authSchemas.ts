import { z } from "zod";

import { validateRun } from "../utilities";

/* Field Validations */
const nameValidation = z.string().nonempty({ message: "El nombre es obligatorio" });
const paternalValidation = z.string().nonempty({ message: "El apellido paterno es obligatorio" })
const maternalValidation = z.string().nullable().transform((value) => value != "" ? value : null);
const emailValidation = z.string().email({ message: "El correo electronico no es invalido" });
const passwordValidation = z.string()
    .min(6, { message: 'Debe tener al menos 6 caracteres' })
    .regex(/^[a-zA-Z0-9]+$/, { message: 'Debe ser alfanumérica (solo letras y números)' });
const termsAndPoliciesValidation = z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar los términos y condiciones" }),
}).optional();
const userRoleValidation = z.string()
    .nonempty({ message: "Seleccionar el tipo de usuario es obligatorio" })
    .transform((data) => Number(data))

/* Schemas */
export const loginSchema = z.object({
    email: emailValidation,
    password: z.string().nonempty({ message: "La contraseña es obligatoria" }),
    user_role: userRoleValidation
});

export const registerCandidateSchema = z.object({
    name: nameValidation,
    paternal: paternalValidation,
    maternal: maternalValidation,
    run: z.string().nonempty({ message: "El RUT es obligatorio" }).refine((run) => validateRun(run), { message: "El RUT es invalido" }),
    email: emailValidation,
    password: passwordValidation,
    confirm_password: z.string().optional(),
    terms_policies: termsAndPoliciesValidation,
}).refine((data) => data.password === data.confirm_password, {
    message: 'Las contraseñas deben ser identicas',
    path: ['confirmPassword']
}).transform((data) => {
    delete data.confirm_password;
    delete data.terms_policies;
    return data;
});

export const registerCompanySchema = z.object({
    name: nameValidation,
    paternal: paternalValidation,
    maternal: maternalValidation,
    phone: z.string().regex(/^(?:\+?56)?9\d{8}$/, "Número telefonico inválido").nonempty({ message: "El numero telefonico es obligatorio" }),
    email: emailValidation,
    password: passwordValidation,
    confirm_password: z.string().optional(),
    rut: z.string().nonempty({ message: "El RUT es obligatorio" }).refine((run) => validateRun(run), { message: "El RUT es invalido" }),
    legal_name: z.string().min(1, { message: "La razon social es obligatoria" }),
    trade_name: z.string().min(1, { message: "El nombre fantasia es obligatorio" }),
    company_phone: z.string().regex(/^(?:\+?56)?9\d{8}$/, "Número telefonico inválido").nonempty({ message: "El numero telefonico es obligatorio" }),
    company_email: emailValidation,
    sector: z.string().min(1, { message: "Seleccionar el sector es obligatorio" }),
    terms_policies: termsAndPoliciesValidation,
}).refine((data) => data.password === data.confirm_password, {
    message: 'Las contraseñas deben ser identicas',
    path: ['confirm_password']
}).transform((data) => {
    // Delete Unnecesary Fields And Return Data
    delete data.confirm_password;
    delete data.terms_policies;
    const {
        rut,
        legal_name,
        trade_name,
        company_email,
        company_phone,
        sector,
        ...rest
    } = data;

    return {
        rut,
        legal_name,
        trade_name,
        email: company_email,
        phone: company_phone,
        sector_id: Number(sector),
        company_user: {
            ...rest
        }
    };
});

export const forgetPasswordSchema = z.object({
    email: emailValidation,
    user_role: userRoleValidation
});

export const changePasswordSchema = z.object({
    password: passwordValidation,
    confirm_password: z.string().optional()
}).refine((data) => data.password === data.confirm_password, {
    message: 'Las contraseñas deben ser identicas',
    path: ['confirm_password']
}).transform((data) => ({ password: data.password }))