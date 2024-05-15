import { CustomError } from "../utils/customErrors.js";

import {
	insertTodosSchema,
	updateTodosSchema,
	idTodoSchema,
    loginSchema
} from "../schemas/index.js";

export function validateCredentials() {
    return (req, res, next) => {
        try{
            req.validatedData = loginSchema.validateSync(req.body, {
                stripUnknown: true,
            })
        } catch (err) {
            throw new CustomError(400, 'datos inválidos');
        }
        next();
    }
}

export function validateIdTodo() {

    return (req, res, next) => {
        try{
            req.validatedData = idTodoSchema.validateSync(req.params, {stripUnknown: true});
        } catch (err) {
            throw new CustomError(400, 'datos inválidos');
        }
        next();
    }
}

export function validateInsertTodo() {

    return (req, res, next) => {
        try{
            req.validatedData = insertTodosSchema.validateSync(req.body, {stripUnknown: true});
        } catch (err) {
            throw new CustomError(400, 'datos inválidos');
        }
        next();
    }
}

export function validateUpdateTodo() {

    return (req, res, next) => {
        try{
            req.validatedData = updateTodosSchema.validateSync({
                ...req.body,
                id: req.params.id,
            }, {stripUnknown: true,});
        } catch (err) {
            throw new CustomError(400, 'datos inválidos');
        }
        next();
    }
}

