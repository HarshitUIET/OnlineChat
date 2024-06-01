import express from "express";

import userRoute from "./routes/user.js";

const app = express();

app.use('/user',userRoute);

app.get("/",(req,res)=>{
  res.send("Home Page");
})

app.listen(3000,()=>{
    console.log("listening to port no 3000 ",);
})