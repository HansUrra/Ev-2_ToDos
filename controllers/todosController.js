import { Router } from "express";
import {


} from "../repositories/todos.js";
import {
	login
} from "../repositories/auth.js";
import {
  createTodosSchema,
  updateTodosSchema,
  loginSchema
} from "../schemas/index.js";

const router = new Router();


router.post('/login', async (req, res) => {

	try {
		credentials = loginSchema.validateSync(req.body, {
		stripUnknown: true,
		});
	} catch (ex) {
		return res.status(400).send(ex);
	}

	res.send(login(credentials.username, credentials.password))
})


router.get('/todos', authMiddleware, (req, res) => {
	res.send(todos)
})

router.get('/todos/:id', authMiddleware, (req, res) => {
	const todo = todos.find(todo => todo.id === req.params.id)

	if (!todo) {
		return res.status(404).send({
			error: 'Item no encontrado'
		})
	}

	res.send(todo)
})

router.post('/todos', authMiddleware, (req, res) => {
	const { title } = req.body

	if (typeof title !== 'string') {
		return res.status(400).send({
			error: 'Datos incorrectos'
		})
	}

	const todo = {
		id: randomUUID(),
		title,
		completed: false
	}
	todos.push(todo)

	res.status(201).send(todo)
})

router.put('/todos/:id', authMiddleware, (req, res) => {
	const todo = todos.find(todo => todo.id === req.params.id)

	if (!todo) {
		return res.status(404).send({
			error: 'Item no encontrado'
		})
	}

	const { title, completed } = req.body

	if ((title !== undefined && typeof title !== 'string') || (completed !== undefined && typeof completed !== 'boolean')) {
		return res.status(400).send({
			error: 'Datos incorrectos'
		})
	}

	if (typeof title === 'string') {
		todo.title = title
	}

	if (typeof completed === 'boolean') {
		todo.completed = completed
	}

	res.status(200).send(todo)
})

router.delete('/todos/:id', authMiddleware, (req, res) => {
	const index = todos.findIndex(todo => todo.id === req.params.id)

	if (index === -1) {
		return res.status(404).send({
			error: 'Item no encontrado'
		})
	}

	todos.splice(index, 1)
	res.status(204).send()
})

// ... hasta aquí

export default router