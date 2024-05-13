import { Router } from "express";
import {
	login
} from "../repositories/auth.js";
import {
	validateCredentials
} from "../middlewares/validation.js";
import {
  	loginSchema
} from "../schemas/index.js";

const router = new Router();


router.post('/login', validateCredentials(), async (req, res) => {
	try {
		res.send(await login(req.validatedData.username, req.validatedData.password))
	} catch (ex) {
		return res.status(401).send(ex);
	}
})

router.post('/logout', async (req, res) => {
  
  let token;
	try {
		token = loginSchema.validateSync(req, {
		stripUnknown: true,
		});

    res.status(204).send(await logout(token))
	} catch (ex) {
		return res.status(404).send(ex);
	}
})


export default router