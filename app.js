import express from 'express'
import cors from "cors";
import todosController from "./controllers/todosController.js";
import authController from "./controllers/authController.js";

const app = express()

app.use(express.static('public'))
app.use(cors());
app.use(express.json());
// Su código debe ir aquí...


app.get("/", (req, res) => {
    res.send("ok")
});

app.use("/api", todosController);
app.use("/api", authController);

// // ... hasta aquí

export default app