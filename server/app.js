import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { errorMidddleware } from "./middlewares/error.js";
import { dbConnect } from "./utilis/features.js";


import chatRoute from "./routes/chat.js";
import userRoute from "./routes/user.js";
import adminRoute from './routes/admin.js'

import { createMessagesInAChat } from "./seeders/chat.js";

const app = express();

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";

dbConnect(MONGO_URL);

// createSingleChats(10);
// createGroupChats(10);
// createMessagesInAChat("666992a227825416c6ef7a72",50)


app.use(express.json());
app.use(cookieParser());



app.use('/user',userRoute);
app.use('/chat',chatRoute);
app.use('/admin',adminRoute)


app.use(errorMidddleware);

app.get("/",(req,res)=>{
  res.send("Home Page");
})

app.listen(PORT,()=>{
    console.log(`listening to port no ${PORT} in ${envMode} mode`);
})

export {
  envMode
}