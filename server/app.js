import express from "express";
import dotenv from "dotenv";
import { dbConnect } from "./utilis/features.js";
import { errorMidddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";


import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";
import { createUser } from "./seeders/user.js";

const app = express();

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;

dbConnect(MONGO_URL);


app.use(express.json());
app.use(cookieParser());



app.use('/user',userRoute);
app.use('/chat',chatRoute);


app.use(errorMidddleware);

app.get("/",(req,res)=>{
  res.send("Home Page");
})

app.listen(PORT,()=>{
    console.log(`listening to port no ${PORT} `);
})