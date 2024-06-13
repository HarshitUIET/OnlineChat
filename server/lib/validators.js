import {body,validationResult} from 'express-validator';
import { ErrorHandler } from '../utilis/utility.js';

const registerValidator = () => [
    body('name',"Please Enter Name").notEmpty(),
    body('username','Please Enter Username').notEmpty(),
    body('password','Please Enter Password').notEmpty(),
    body('bio','Please Enter Bio').notEmpty()
];

const validateHandler = (req,res,next) => {
    
    const errors = validationResult(req);
    
    const errorMessages = errors.array().map((e)=>e.msg).join(",");

    if(errors.isEmpty()) return next();

    else next(new ErrorHandler(errorMessages,400))

}


export { registerValidator,validateHandler}