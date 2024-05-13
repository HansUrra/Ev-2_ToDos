import { randomUUID } from 'node:crypto'

import { CustomError } from "../utils/customErrors.js";

export const selectTodos = []

export function selectTodo (id) {

    const todo = todos.find(todo => todo.id === id);
	if (!todo) {
		throw new CustomError(400, 'Item no encontrado');
	}

    return todo;
}

export function insertTodo (title) {

    const todo = {
		id: randomUUID(),
		title : title.title,
		completed: false
	}
	selectTodos.push(todo);

    return todo;
}

export function updateTodo(toDo) {

	const { title, completed, id } = toDo;

    const todo = selectTodos.find(todo => todo.id === id)

    if (!todo) 
        throw new CustomError(404, 'Item no encontrado');
	
	if (title !== undefined && typeof title === 'string')
		todo.title = title

	if (completed !== undefined && typeof completed === 'boolean') 
		todo.completed = completed

    return todo;
}

export function deleteTodo (id) {

	const index = selectTodos.findIndex(todo => todo.id === id)

	if (index === -1)
		throw new CustomError(404, 'Item no encontrado');

	selectTodos.splice(index, 1);
}