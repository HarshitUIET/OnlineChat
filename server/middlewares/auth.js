import { decode } from "jsonwebtoken";
import {ErrorHandler} from "../utilis/utility.js";
import { TryCatch } from "./error.js";
import jwt from "jsonwebtoken";

const isAuthenticated =  (req, res, next) => {

      const token =  req.cookies["chattu-token"];

    if(!token) return next(new ErrorHandler(" Please Login to access this route"));

    const decodedData = jwt.verify(token,process.env.JWT_SECRET);

    req.user = decodedData.id;


    // console.log(token);
    next();

}

export {isAuthenticated}
