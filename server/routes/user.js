import express from "express";
import { getMyProfile, login,newUser,logout, searchUser,sendFriendRequest,acceptRequest,getNotifications,getMyfriends } from "../controllers/user.js";
import { singleAvatar} from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { registerValidator, validateHandler,loginValidator,sendFriendRequestValidator,acceptRequestValidator, } from "../lib/validators.js";


const app = express.Router();

app.post('/login',loginValidator(),validateHandler,login)
app.post('/new',singleAvatar,registerValidator(),validateHandler,newUser)


app.use(isAuthenticated);
app.get('/me',getMyProfile);
app.get('/logout',logout);
app.get('/search',searchUser);

app.put('/sendrequest',sendFriendRequestValidator(),validateHandler,sendFriendRequest);

app.put('/acceptrequest',acceptRequestValidator(),validateHandler,acceptRequest);

app.get('/notifications',getNotifications);

app.get('/friends',getMyfriends);



export default app;