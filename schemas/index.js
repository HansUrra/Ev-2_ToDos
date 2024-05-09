import { setLocale } from "yup";
import { es } from "yup-locales";
import { object, string, number } from "yup";

setLocale(es);

export const createTodosSchema = object({
    title: string().optional(),
    completed: Boolean().optional(),
});

export const updateTodosSchema = object({
    title: string().optional(),
    completed: Boolean().optional(),
});

export const loginSchema = object({
    username: string().required(),
    password: string().required(),
});