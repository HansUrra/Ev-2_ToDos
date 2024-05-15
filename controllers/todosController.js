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
} from "../repositories/users.js";


const router = Router();
//LISTAR TODOS
router.get('/todos', authMiddleware, (req, res) => {
	try {
		
		res.send(selectTodos);
	}catch (err) {
		return res.status(err.status).send(err.message);
	}
})
//BUSCAR TODO
router.get('/todos/:id', authMiddleware, validateIdTodo(), (req, res) => {
	try {
		const todo = selectTodo(req.validatedData.id);
		res.status(200).send(todo);
	} catch (err) { 
		return res.status(err.status).send(err.message)
	}
})
//INSERTAR TODO
router.post('/todos', authMiddleware, validateInsertTodo(), (req, res) => {
	try {
		const todo = insertTodo(req.validatedData)
    	res.status(201).send(todo);
	} catch (err) {
		return res.status(err.status).send(err.message);
	}
})

//MODIFICAR TODO
router.put('/todos/:id', authMiddleware, validateUpdateTodo(), (req, res) => {
	try {

		const todo = updateTodo(req.validatedData)

    	res.status(200).send(todo);
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
		return res.status(err.status).send(err.message);
	}
})

// ... hasta aquí

export default router