import { expect, test, describe, beforeEach } from 'vitest'
import request from 'supertest'
import app, { todos } from './app.js'

function clearTodos() {
	todos.length = 0
}

function createTodo(item) {
	todos.push(item)
	return item
}

function loginRequest(username = 'admin', password = 'certamen123') {
	return request(app)
		.post('/api/login')
		.send({ username, password })
}

function createItemRequest(title, token) {
	return request(app)
		.post('/api/todos')
		.set('X-Authorization', token)
		.send({ title, completed: true })
}

function updateItemRequest(id, attrs, token) {
	return request(app)
		.put('/api/todos/' + id)
		.set('X-Authorization', token)
		.send(attrs)
}

async function loginAndSetToken(context) {
	const { body } = await loginRequest()
	context.token = body.token
}

beforeEach(clearTodos)

/*

Trabajo: 56 puntos
Interrogación: 24 puntos (8 por pregunta)
Total: 80

* Sigue las instrucciones (1)
* Usa middleware json (1)
* Control de Versiones (3)
	* Está bajo GIT (1)
	* Tiene un .gitignore apropiado (1)
	* El proyecto está en Github o similar (1)
* Usa scrypt de forma correcta para validar la contraseña (5)
* Middleware de Autenticación (6)
	* Los endpoints indicados están protegidos por un middleware de autenticación (5)
		* GET /api/todos (1)
		* GET /api/todos/:id (1)
		* POST /api/todos (1)
		* PUT /api/todos/:id (1)
		* DELETE /api/todos/:id (1)
	* Devuelve código de estado 401 cuando el token no existe (1)
	
* Rutas (40)
	* GET /api Hello World (3)
		* El content type es text/plain (1)
		* El código de estado es 200 (1)
		* El texto retornado es "Hello World!" (1)
	* POST /api/login Login (10)
		* Se loguea correctamente (6)
			* El content type es application/json (1)
			* El código de estado es 200 (1)
			* El nombre de usuario es "Gustavo Alfredo Marín Sáez" (1)
			* El username es "admin" (1)
			* El token es un string hexadecimal (1)
			* No entrega el password guardado (1)
		* El token es distinto con cada logueo (1)
		* Devuelve código de estado 400 cuando no se envían los datos apropiados (1)
		* Devuelve código de estado 401 cuando el usuario no existe o contraseña incorrecta (2)
	* GET /api/todos Listar Ítems (4)
		* Lista los ítemes previamente creados (4)
			* El content type es application/json (1)
			* El código de estado es 200 (1)
			* Lista correctamente los ítemes en el formato correcto (2)
	* GET /api/todos/:id Obtener Ítem (4)
		* Obtiene un ítem previamente creado (3)
			* El content type es application/json (1)
			* El código de estado es 200 (1)
			* El ítem entregado está en el formato correcto (1)
		* Devuelve código de estado 404 cuando un ítem no existe (1)
	* POST /api/todos Creación de Ítem (7)
		* Crea un item correctamente (5)
			* El content type es application/json (1)
			* El código de estado es 201 (1)
			* El id es de tipo string (1)
			* El title es el título ingresado por el usuario (1)
			* La propiedad completed es false (1)
		* Devuelve código de estado 400 cuando no se envían los datos apropiados (1)
		* Persiste el item creado previamente (1)
	* PUT /api/todos/:id Actualización de Ítem (9)
		* Actualiza un item correctamente (6)
			* El content type es application/json (1)
			* El código de estado es 200 (1)
			* La respuesta a la actualización parcial del title es correcta (1)
			* La actualización parcial del title es persistente (1)
			* La respuesta a la actualización parcial de completed es correcta (1)
			* La actualización parcial de completed es persistente (1)
		* Devuelve código de estado 400 cuando no se envían los datos apropiados (2)
			* Valida title (1)
			* Valida completed (1)
		* Devuelve código de estado 404 cuando el ítem a actualizar no existe (1)
	* DELETE /api/todos/:id Borrado de Ítem (3)
		* Borra un item correctamente (2)
			* El código de estado es 204 (1)
			* El item efectivamente fue borrado (1)
		* Devuelve código de estado 404 cuando el ítem a borrar no existe (1)
*/

describe('Middleware de Autenticación', () => {

	beforeEach(loginAndSetToken)

	test('Los endpoints indicados están protegidos por un middleware de autenticación', async ({ token }) => {
		await request(app).get('/api/todos').expect(401) // 0.5
		await request(app).get('/api/todos').set('X-Authorization', token).expect(200) // 0.5
		await request(app).get('/api/todos/djsakldjlas').expect(401) // 0.5
		await request(app).get('/api/todos/djsakldjlas').set('X-Authorization', token).expect(404) // 0.5
		await request(app).post('/api/todos').expect(401) // 0.5
		await request(app).post('/api/todos').set('X-Authorization', token).expect(400) // 0.5
		await request(app).put('/api/todos/jdlsajdlksa').expect(401) // 0.5
		await request(app).put('/api/todos/jdlsajdlksa').set('X-Authorization', token).expect(404) // 0.5
		await request(app).delete('/api/todos/jdlsajdlksa').expect(401) // 0.5
		await request(app).delete('/api/todos/jdlsajdlksa').set('X-Authorization', token).expect(404) // 0.5
	})

	test('Devuelve código de estado 401 cuando el token no existe', () => {
		return request(app).get('/api/todos')
			.set('X-Authorization', 'not-exists-in-this-realm')
			.expect(401) // 1
	})
})

test('Hello World!', () => {
	return request(app)
		.get('/api')
		.expect('Content-Type', /text\/plain/) // 1
		.expect(200) // 1
		.expect('Hello World!') // 1
})

describe('Login', () => {
	test('Se loguea correctamente', async () => {
		const { body: user } = await loginRequest()
			.expect('Content-Type', /application\/json/) // 1
			.expect(200) // 1

		expect.soft(user.name).toBe('Gustavo Alfredo Marín Sáez') // 1
		expect.soft(user.username).toBe('admin') // 1
		expect.soft(user.password).toBeUndefined() // 1
		expect.soft(user.token).toBeTypeOf('string').toMatch(/^[0-9a-f]+$/i) // 1
	})

	test('El token es distinto con cada logueo', async () => {
		const { body: body1 } = await loginRequest()
		const { body: body2 } = await loginRequest()

		expect.soft(body1.token).not.toBe(body2.token) // 1
	})

	test('Devuelve código de estado 400 cuando no se envían los datos apropiados', () => {
		return loginRequest(123, false)
			.expect(400) // 1
	})

	test('Devuelve código de estado 401 cuando el usuario no existe o contraseña incorrecta', async () => {
		await loginRequest('notadmin', 'certamen123')
			.expect(401) // 1

		await loginRequest('admin', 'certamen1234')
			.expect(401) // 1
	})

	// 5 por usar el cifrado scrypt correctamente
})

describe('Listar Ítems', () => {

	beforeEach(loginAndSetToken)

	test('Lista los ítemes previamente creados', async ({ token }) => {
		const item1 = createTodo({
			id: 'abc-1',
			title: 'TODO 1',
			completed: false
		})
		const item2 = createTodo({
			id: 'abc-2',
			title: 'TODO 2',
			completed: true
		})

		const { body: list } = await request(app)
			.get('/api/todos')
			.set('X-Authorization', token)
			.expect('Content-Type', /application\/json/) // 1
			.expect(200) // 1

		expect.soft(list)
			.an('array')
			.of.length(2)
			.and.deep.includes(item1) // 1
			.and.deep.includes(item2) // 1
	})
})

describe('Obtener Ítem', () => {

	beforeEach(loginAndSetToken)

	test('Obtiene un ítem previamente creado', async ({ token }) => {
		const createdItem = createTodo({
			id: 'abc-1',
			title: 'TODO',
			completed: false
		})

		const { body: item } = await request(app)
			.get('/api/todos/' + createdItem.id)
			.set('X-Authorization', token)
			.expect('Content-Type', /application\/json/) // 1
			.expect(200) // 1

		expect.soft(item).toStrictEqual(createdItem) // 1
	})

	test('Devuelve código de estado 404 cuando un ítem no existe', async ({ token }) => {
		await request(app)
			.get('/api/todos/no-existe')
			.set('X-Authorization', token)
			.expect(404) // 1
	})
})

describe('Creación de Ítem', () => {

	beforeEach(loginAndSetToken)

	test('Crea un item correctamente', async ({ token }) => {
		const title = 'TODO TEST'
		const { body } = await createItemRequest(title, token)
			.expect(201) // 1
			.expect('Content-Type', /application\/json/) // 1
		
		expect.soft(body.id).toBeTypeOf('string') // 1
		expect.soft(body.title).toBe(title) // 1
		expect.soft(body.completed).toBe(false) // 1
	})

	test('Devuelve código de estado 400 cuando no se envían los datos apropiados', async ({ token }) => {
		await createItemRequest(false, token).expect(400)
		await createItemRequest(undefined, token).expect(400)
		await createItemRequest(123, token).expect(400)
	}) // 1

	test('Persiste el item creado previamente', async ({ token }) => {
		const { body: newTodo } = await createItemRequest('TODO TEST 2', token)

		expect.soft(todos).deep.includes(newTodo) // 1
	})
})

describe('Actualización de Ítem', () => {

	beforeEach(loginAndSetToken)

	test('Actualiza un item correctamente', async ({ token }) => {
		createTodo({
			id: 'abc-1',
			title: 'TODO 1',
			completed: false
		})

		const { body: itemResponse1 } = await updateItemRequest('abc-1', { title: 'NEW TODO 1' }, token)
			.expect(200) // 1
			.expect('Content-Type', /application\/json/) // 1

		expect.soft(itemResponse1).toStrictEqual({
			id: 'abc-1',
			title: 'NEW TODO 1',
			completed: false
		}) // 1
		expect.soft(itemResponse1).toStrictEqual(todos.find(todo => todo.id === 'abc-1')) // 1

		const { body: itemResponse2 } = await updateItemRequest('abc-1', { completed: true }, token)

		expect.soft(itemResponse2).toStrictEqual({
			id: 'abc-1',
			title: 'NEW TODO 1',
			completed: true
		}) // 1
		expect.soft(itemResponse2).toStrictEqual(todos.find(todo => todo.id === 'abc-1')) // 1
	})

	test('Devuelve código de estado 400 cuando no se envían los datos apropiados', async ({ token }) => {
		createTodo({
			id: 'abc-1',
			title: 'TODO 1',
			completed: false
		})

		await updateItemRequest('abc-1', { title: 123 }, token)
			.expect(400) // 1
		await updateItemRequest('abc-1', { completed: 'HELLO WORLD!' }, token)
			.expect(400) // 1
	})

	test('Devuelve código de estado 404 cuando el ítem a actualizar no existe', ({ token }) => {
		return request(app)
			.put('/api/todos/not-exists')
			.set('X-Authorization', token)
			.send({
				title: 'UPDATED TODO',
				completed: true
			})
			.expect(404) // 1
	})
})

describe('Borrado de Ítem', () => {

	beforeEach(loginAndSetToken)

	test('Borra un item correctamente', async ({ token }) => {
		const todo = createTodo({
			id: 'abc-1',
			title: 'TODO',
			completed: true
		})

		await request(app)
			.delete('/api/todos/' + todo.id)
			.set('X-Authorization', token)
			.expect(204) // 1

		expect.soft(todos).not.deep.include(todo) // 1
	})

	test('Devuelve código de estado 404 cuando el ítem a borrar no existe', ({ token }) => {
		return request(app)
			.delete('/api/todos/not-exists')
			.set('X-Authorization', token)
			.expect(404) // 1
	})
})
