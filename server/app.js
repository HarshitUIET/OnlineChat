import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { errorMidddleware } from "./middlewares/error.js";
import { dbConnect } from "./utilis/features.js";
import { Server } from "socket.io";
import {createServer} from "http";
import {v4 as uuid} from "uuid";
import cors from "cors";
import {v2 as Cloudinary} from "cloudinary";

import chatRoute from "./routes/chat.js";
import userRoute from "./routes/user.js";
import adminRoute from './routes/admin.js'

import { createMessagesInAChat } from "./seeders/chat.js";
import { CHAT_EXITED, CHAT_JOINED, NEW_MESSAGE, NEW_MESSAGE_ALERT, ONLINE_USERS, START_TYPING,STOP_TYPING } from "./constants/event.js";
import { create } from "domain";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.js";
import { socketAuthenticator } from "./middlewares/auth.js";

dotenv.config();

const app = express();

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";

const userSocketIDs = new Map();

const OnlineUsers = new Set();

dbConnect(MONGO_URL);
Cloudinary.config({
  cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
  api_key : process.env.CLOUDINARY_API_KEY,
  api_secret : process.env.CLOUDINARY_API_SECRET
})

// createSingleChats(10);
// createGroupChats(10);
// createMessagesInAChat("666992a227825416c6ef7a72",50)


app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin : [
    "http://localhost:5173",
    "http://localhost:4173",
     process.env.CLIENT_URL
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials : true
}));



app.use('/api/v1/user',userRoute);
app.use('/api/v1/chat',chatRoute);
app.use('/api/v1/admin',adminRoute)


app.use(errorMidddleware);

app.get("/",(req,res)=>{
  res.send("Home Page");
})


const server = createServer(app);


const io = new Server(server,{
  cors : {
    origin : [
      "http://localhost:5173",
      "http://localhost:4173",
       process.env.CLIENT_URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials : true
  }
});

app.set("io", io);

io.use((socket,next) => {
  cookieParser()(socket.request,socket.request.res, async (err) =>
  await socketAuthenticator(err,socket,next));
})

io.on("connection",(socket) => {

  const user = socket.user;

  userSocketIDs.set(user._id.toString(),socket.id);

  console.log(userSocketIDs);
  
  socket.on(NEW_MESSAGE,async ({chatId,members,message}) => {
     const messageForRealTime = {
       content : message,
       _id : uuid(),
        sender : {
          _id : user._id,
          name : user.name
        },
        chat : chatId,
        createdAt : new Date().toISOString()
   }

    const messageForDB = {
      content : message,
      sender : user._id,
      chat : chatId,
    }

       const membersSocket = getSockets(members);


       io.to(membersSocket).emit(NEW_MESSAGE,{
          message : messageForRealTime,
          chatId
       })

       io.to(membersSocket).emit(NEW_MESSAGE_ALERT,{chatId});

       try {
        await Message.create(messageForDB);
       } catch (error) {
          console.log(error);
       }

  })

  socket.on(START_TYPING,({members,chatId})=>{

     const membersSocket = getSockets(members);

    io.to(membersSocket).emit(START_TYPING,{chatId});
  })

  socket.on(STOP_TYPING,({members,chatId})=>{
    const membersSocket = getSockets(members);

   io.to(membersSocket).emit(STOP_TYPING,{chatId});
 })

 socket.on(CHAT_JOINED,({members,userId}) => {

     OnlineUsers.add(userId.toString());

     console.log("Chat joined ",OnlineUsers);

    const membersSocket = getSockets(members);

    console.log(membersSocket);
  
    io.to(membersSocket).emit(ONLINE_USERS,Array.from(OnlineUsers));
 })

 socket.on(CHAT_EXITED,({members,userId})=>{
    OnlineUsers.delete(userId.toString());

    console.log("Chat exited ",OnlineUsers);

    const membersSocket = getSockets(members);
    console.log(membersSocket);
    io.to(membersSocket).emit(ONLINE_USERS,Array.from(OnlineUsers));
 })



  socket.on("disconnect",() => {
    userSocketIDs.delete(user._id.toString());
    OnlineUsers.delete(user._id.toString());
    socket.broadcast.emit(ONLINE_USERS,Array.from(OnlineUsers));
  })

})

server.listen(PORT,()=>{
    console.log(`listening to port no ${PORT} in ${envMode} mode`);
})

export {
  envMode,
  userSocketIDs
}