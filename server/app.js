import express from "express";
import dotenv from "dotenv";

import userRoute from "./routes/user.js";
import { dbConnect } from "./utilis/features.js";

const app = express();

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;

dbConnect(MONGO_URL);


app.use('/user',userRoute);

app.get("/",(req,res)=>{
  res.send("Home Page");
})

app.listen(PORT,()=>{
    console.log(`listening to port no ${PORT} `);
})