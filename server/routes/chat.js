import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getMyChat, newGroupChat,getMyGroups, addMembers,removeMembers, leaveGroup , sendAttachments, getChatDetails,renameGroup,deleteChat } from "../controllers/chat.js";
import { attachmentsMulter } from "../middlewares/multer.js";


const app = express.Router();




app.use(isAuthenticated);

app.get('/new',newGroupChat);
app.get('/my',getMyChat);
app.get('/my/groups',getMyGroups);
app.put('/addmembers',addMembers);
app.put('/removemembers',removeMembers);
app.delete('/leave/:id',leaveGroup);

// Send Attachments

app.post('/message',attachmentsMulter,sendAttachments);

app.route("/:id").get(getChatDetails).put(renameGroup).delete(deleteChat);



export default app;