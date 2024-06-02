import mongoose, { mongo } from "mongoose";
import jwt from "jsonwebtoken";


const cookieOptions = {
    maxAge : 15*24 * 60 * 60 * 1000,
    httpOnly : true,
    sameSite : "none",
    secure:'true',
}

const dbConnect = (url) => {
   mongoose.connect(url,{dbName:"chattu"})
   .then((data)=>{
    console.log(`connected to database ${data.connection.host}`)
   })
   .catch((err)=>{
    throw err;
   })
}


const sendToken = (res,user,code,message) => {
    const token = jwt.sign({
        id : user._id,
    },process.env.JWT_SECRET);
    
   return res.status(code).cookie("chattu-token",token,cookieOptions).json({
    success: true,
    message,
   })

}



export {dbConnect,sendToken};