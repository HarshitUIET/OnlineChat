import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getMyChat, newGroupChat,getMyGroups, addMembers,removeMembers, leaveGroup , sendAttachments, getChatDetails,renameGroup,deleteChat,getMessageDetails } from "../controllers/chat.js";
import { attachmentsMulter } from "../middlewares/multer.js";
import { newGroupChatValidator, validateHandler,addMemberValidator,removeMemberValidator,leaveGroupValidator,sendAttachmentValidator,getMessageVslidator,getChatDetailsValidator,renameGroupValidator,deleteChatValidator } from "../lib/validators.js";


const app = express.Router();

app.use(isAuthenticated);

app.get('/new',newGroupChatValidator(),validateHandler, newGroupChat);
app.get('/my',getMyChat);
app.get('/my/groups',getMyGroups);
app.put('/addmembers',addMemberValidator(),validateHandler,addMembers);
app.put('/removemembers',removeMemberValidator(),validateHandler,removeMembers);
app.delete('/leave/:id',leaveGroupValidator(),validateHandler,leaveGroup);

// Send Attachments
app.post('/message',attachmentsMulter,sendAttachmentValidator(),validateHandler,sendAttachments);

// Get Messages
app.get('/messages/:id',getMessageVslidator(),validateHandler,getMessageDetails);

app.route("/:id").get(getChatDetailsValidator(),validateHandler,getChatDetails).put(renameGroupValidator(),validateHandler,renameGroup).delete(deleteChatValidator(),validateHandler,deleteChat);



export default app;