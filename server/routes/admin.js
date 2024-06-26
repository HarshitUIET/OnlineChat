import express from "express";
import { allChats, allUsers,allMessages,getDashBoardStats,adminLogin,adminLogout } from "../controllers/admin.js";
import { adminLoginValidator, validateHandler } from "../lib/validators.js";
import { adminAuthenticated } from "../middlewares/auth.js";


const app = express.Router();



app.post('/verify',adminLoginValidator(),validateHandler,adminLogin);

app.get('/logout',adminLogout);

// only admin can access these routes

app.use(adminAuthenticated);

app.get('/');
app.get('/users',allUsers);
app.get('/chats',allChats);
app.get('/messages',allMessages);

app.get('/stats',getDashBoardStats);


export default app;
