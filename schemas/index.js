import { bool, setLocale } from "yup";
import { es, th } from "yup-locales";
import { object, string, number } from "yup";

setLocale(es);

export const insertTodosSchema = object({
    title: string().required()
});

export const updateTodosSchema = object({
    title: string().optional(),
    completed: bool().optional(),
    id: string().required()
});

export const idTodoSchema = object({
    id: string().required()
});

export const loginSchema = object({
    username: string().required(),
    password: string().required(),
});
