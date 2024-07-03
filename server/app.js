import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { errorMidddleware } from "./middlewares/error.js";
import { dbConnect } from "./utilis/features.js";
import { Server } from "socket.io";
import {createServer} from "http";
import {v4 as uuid} from "uuid";
import cors from "cors";

import chatRoute from "./routes/chat.js";
import userRoute from "./routes/user.js";
import adminRoute from './routes/admin.js'

import { createMessagesInAChat } from "./seeders/chat.js";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/event.js";
import { create } from "domain";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.js";

const app = express();
const server = createServer(app);
const io = new Server(server,{});

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";

const userSocketIDs = new Map();

dbConnect(MONGO_URL);

// createSingleChats(10);
// createGroupChats(10);
// createMessagesInAChat("666992a227825416c6ef7a72",50)


app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin : "http://localhost:5173",
  credentials : true
}));



app.use('/api/v1/user',userRoute);
app.use('/api/v1/chat',chatRoute);
app.use('/api/v1/admin',adminRoute)


app.use(errorMidddleware);

app.get("/",(req,res)=>{
  res.send("Home Page");
})

io.use((socket,next)=>{})

io.on("connection",(socket) => {

  const user = {
    _id : "anasn",
    name : "anas",
  }

  userSocketIDs.set(user._id.toString(),socket.id);
  
  console.log(" a user connected ",socket.id);

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

       console.log("New Message",messageForRealTime);
  })

  socket.on("disconnect",() => {
    console.log("user disconnected");
    userSocketIDs.delete(user._id.toString());
  })

})

server.listen(PORT,()=>{
    console.log(`listening to port no ${PORT} in ${envMode} mode`);
})

export {
  envMode,
  userSocketIDs
}