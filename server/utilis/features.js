import mongoose, { mongo } from "mongoose";
import jwt from "jsonwebtoken";
import {v2 as Cloudinary} from "cloudinary";
import {v4 as uuid} from "uuid";
import { getBase64, getSockets } from "../lib/helper.js";


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
    user
   })

}

const emitEvent = (req,event,user,data) => {

    console.log("EMITTING EVENT",event);
    console.log("User",user);
  
   const io = req.app.get("io");
   const userSocket = getSockets(user);
   console.log("USER SOCKET",userSocket);
   io.to(userSocket).emit(event,data);

}

const uploadFileToCloudinary = async (files=[]) => {
    const uploadPromise =  files.map((file)=> {
        return new Promise((resolve,reject) => {
            Cloudinary.uploader.upload(getBase64(file),{
                resource_type : "auto",
                public_id : uuid(),
            },(err,result) => {
                if(err) return reject(err);
                resolve(result);
            })
        }
        )
    })
     try {
        const results = await Promise.all(uploadPromise);

        const formattedResults = results.map((result) => {
            return {
                public_id : result.public_id,
                url : result.url,
            }
        });
        return formattedResults;
     } catch (error) {
        throw new Error("Error uploading files to cloudinary",error)
     }

}

const deleteFilesFromCloudinary = async (public_ids) => {

}


export {dbConnect,sendToken,cookieOptions,emitEvent,deleteFilesFromCloudinary,uploadFileToCloudinary};