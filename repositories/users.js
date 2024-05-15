import { scrypt, randomBytes, randomUUID } from 'node:crypto'
import { CustomError } from '../utils/customErrors';

export const users = [
	{
		username: 'admin',
		name: 'Gustavo Alfredo Marín Sáez',
		password: '1b6ce880ac388eb7fcb6bcaf95e20083:341dfbbe86013c940c8e898b437aa82fe575876f2946a2ad744a0c51501c7dfe6d7e5a31c58d2adc7a7dc4b87927594275ca235276accc9f628697a4c00b4e01' // certamen123
	},
	{
		username: 'user',
		name: 'Gandalf',
		password: 'cc46a0a0a1320b7dd69fe26c288c9f32:bcd6c1505c8973be89c75d24184ecb9a2edb54913a18e955cfdd5a65eb63f933d2ad15acceebeccea494f4481522a074e1d60d0d58ab8ecad380988ee8ec7684'
	}
]

export async function login(username, password) {

	if (typeof username === undefined || typeof password === undefined) {
		throw new CustomError(401,'Datos incorrectos. Recuerde enviar usuario y contraseña');
	}
	
	const user = users.find(user => user.username === username)

	if (!user) {
		throw new CustomError(401, 'Usuario y/o password incorrectos');
	}

	if (!(await checkPassword(password, user.password))) {
		throw new CustomError(401, 'Usuario y/o password incorrectos');
	}

	user.token = randomBytes(48).toString('hex')

	return {
		username: user.username,
		name: user.name,
		token: user.token
	}
}

export async function logout(req) {

	const authorizationToken = req.get('x-authorization')

	if (!authorizationToken) {
		throw new CustomError(401, "Token de autorización no enviado. Recuerda usar el header X-Authorization");
		//return res.status(401).send({ error: 'Token de autorización no enviado. Recuerda usar el header X-Authorization' })
	}

	const userIndex = users.findIndex(user => user.token === authorizationToken)

	if (!user) {
		//return res.status(401).send({ error: 'Token inválido' })
		throw new CustomError(401, "Token inválido");
	}
	users[userIndex].token = undefined;
}

export function checkPassword(password, hash) {
	const [salt, key] = hash.split(':')

	return new Promise((resolve) => {
		scrypt(password, salt, 64, (err, derivedKey) => {
			if(err) {
				// return resolve(false) // or throw mmm...
				throw new CustomError(401, "credenciales invalidas");
			}

			resolve(derivedKey.toString('hex') === key)
		})
	})
}

export function authMiddleware(req, res, next) {

	try {
		const authorizationToken = req.get('x-authorization');

		if (authorizationToken !== undefined) {
			throw new CustomError(401, "Token de autorización no enviado. Recuerda usar el header X-Authorizatio");
			//return res.status(401).send({ error: 'Token de autorización no enviado. Recuerda usar el header X-Authorization' })
		}

		let user;
		try {
			user = users.find(user => user.token === authorizationToken)
		} catch (err) {
			throw new CustomError(401, "token inválido");
		}
	
		if (!user) {
			throw new CustomError(401, "Token inválido");
			// return res.status(401).send({ error: 'Token inválido' })
		}

	} catch (err) {
		throw new CustomError(401, "Token inválido");
		//return res.status(401).send({ error: 'Token inválido' })
	}



	next()
}