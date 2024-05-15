import { Router } from "express";
import {
	login,
	logout,
	authMiddleware
} from "../repositories/users.js";
import {
	validateCredentials
} from "../middlewares/validation.js";

const router = Router();

router.post('/login', validateCredentials(), async (req, res) => {
	try {
		res.send(await login(req.validatedData.username, req.validatedData.password))
	} catch (err) {
		return res.status(err.status).send(err.message);
	}
})

router.post('/logout', authMiddleware, async (req, res) => {
	try {

		logout(req);

		res.type("application/json");
		res.status(204).send()

	} catch (ex) {
		return res.status(404).send(ex);
	}
})


export default router