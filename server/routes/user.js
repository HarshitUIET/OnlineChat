import express from "express";
import { login,newUser } from "../controllers/user.js";
import { singleAvatar} from "../middlewares/multer.js";

const app = express.Router();

app.get('/login',login)
app.post('/new',singleAvatar,newUser)


export default app;