import { Router } from "express";
import {
	login

} from "../repositories/auth.js";
import {
  loginSchema
} from "../schemas/index.js";

const router = new Router();




export default router