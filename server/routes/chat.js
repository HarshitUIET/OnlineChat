import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getMyChat, newGroupChat,getMyGroups, addMembers,removeMembers, leaveGroup } from "../controllers/chat.js";

const app = express.Router();




app.use(isAuthenticated);

app.get('/new',newGroupChat);
app.get('/my',getMyChat);
app.get('/my/groups',getMyGroups);
app.put('/addmembers',addMembers);
app.put('/removemembers',removeMembers);
app.delete('/leave/:id',leaveGroup);



export default app;