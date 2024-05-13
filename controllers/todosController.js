import { Router } from "express";
import {
	selectTodos,
	selectTodo,
	insertTodo,
	updateTodo,
	deleteTodo
} from "../repositories/todos.js";
import {
	validateIdTodo,
	validateInsertTodo,
	validateUpdateTodo
} from "../middlewares/validation.js";
import {
	authMiddleware
} from "../repositories/auth.js";


const router = new Router();
//LISTAR TODOS
router.get('/todos', authMiddleware, (req, res) => {
	res.send(selectTodos);
})
//BUSCAR TODO
router.get('/todos/:id', authMiddleware, validateIdTodo(), (req, res) => {
	try {
		res.send(selectTodo(req.validatedData.id));
	} catch (err) { 
		return res.status(err.status).send(err.message)
	}
})
//INSERTAR TODO
router.post('/todos', authMiddleware, validateInsertTodo(), (req, res) => {
	try {
    	res.status(201).send(insertTodo(req.validatedData));
	} catch (err) {
		return res.status(err.status).send(err.message);
	}
})

//MODIFICAR TODO
router.put('/todos/:id', authMiddleware, validateUpdateTodo(), (req, res) => {
	try {
    	res.status(200).send(updateTodo(req.validatedData));
	} catch (err) {
		return res.status(err.status).send(err.message);
	}
})
//ELIMINAR TODO
router.delete('/todos/:id', authMiddleware, validateIdTodo(), (req, res) => {
	try {
		deleteTodo(req.validatedData.id)
		res.status(204).send();
	} catch (err) {
		res.status(err.status).send(err.message);
	}
})

// ... hasta aquí

export default router