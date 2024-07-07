import { decode } from "jsonwebtoken";
import {ErrorHandler} from "../utilis/utility.js";
import { TryCatch } from "./error.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const isAuthenticated =  (req, res, next) => {

     const token =  req.cookies["chattu-token"];

    if(!token) return next(new ErrorHandler(" Please Login to access this route"));

    const decodedData = jwt.verify(token,process.env.JWT_SECRET);

    req.user = decodedData.id;


    // console.log(token);
    next();

}

const adminAuthenticated =  (req, res, next) => {

  const token =  req.cookies["chattu-admin-token"];

if(!token) return next(new ErrorHandler(" Only Admin can access this route"));

const secretKey = jwt.verify(token,process.env.JWT_SECRET);

const isMatched = secretKey === process.env.ADMIN_SECRET_KEY;

if(!isMatched) return next(new ErrorHandler("Only Admin can access this route",401));


// console.log(token);
next();

}

const socketAuthenticator = async (err,socket,next) => {
  
  try {

    if(err) return next(err);

    console.log("jij");


    const authToken = socket.request.cookies["chattu-token"];

    console.log(authToken);

    if(!authToken) return next(new ErrorHandler("Please Login to access this route",401));

    const decodedData = jwt.verify(authToken,process.env.JWT_SECRET);

    const user = await User.findById(decodedData.id);  

    console.log(user);

    if(!user) return next(new ErrorHandler("Please Login to access this route",401));

    socket.user = user;

    

    return next();

  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Please Login to access this route",401));
  }


}

export {isAuthenticated,adminAuthenticated,socketAuthenticator}
