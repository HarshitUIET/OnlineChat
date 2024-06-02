import express from "express";
import { login,newUser } from "../controllers/user.js";

const app = express.Router();

app.get('/login',login)
app.post('/register',newUser)


export default app;