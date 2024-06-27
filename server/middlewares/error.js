import { envMode } from "../app.js";


const errorMidddleware = (err,req,res,next) => {

    if(err.code === 11000) {
        const error  = Object.keys(err.keyPattern).join(",");
        err.message =  `Duplicate Field Value Entered : ${error}`;
        err.statusCode = 400;
    }

    if(err.name === "CastError") {
        const pathError = err.path;
        err.message = `Invalid format of  ${pathError}`;
        err.statusCode = 400;
    }

    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;


    return res.status(err.statusCode).json({
        success : false,
        message : envMode === "DEVELOPMENT" ? err : err.message
    })

}

const TryCatch = (passedfunction) => async (req,res,next) => {
     try{
             await passedfunction(req,res,next);
    }
    catch(error){
        next(error);
    }
}


export {errorMidddleware,TryCatch};