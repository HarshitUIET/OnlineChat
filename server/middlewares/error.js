

const errorMidddleware = (err,req,res,next) => {

    

    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;


    return res.status(err.statusCode).json({
        success : false,
        message : err.message
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