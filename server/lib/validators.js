import {body,validationResult,check, param} from 'express-validator';
import { ErrorHandler } from '../utilis/utility.js';


const validateHandler = (req,res,next) => {
    
    const errors = validationResult(req);
    
    const errorMessages = errors.array().map((e)=>e.msg).join(",");

    if(errors.isEmpty()) return next();

    else next(new ErrorHandler(errorMessages,400))

}

const registerValidator = () => [
    body('name',"Please Enter Name").notEmpty(),
    body('username','Please Enter Username').notEmpty(),
    body('password','Please Enter Password').notEmpty(),
    body('Bio','Please Enter Bio').notEmpty(),
];

const loginValidator = () => [
    body('username','Please Enter Username').notEmpty(),
    body('password','Please Enter Password').notEmpty()
];


const newGroupChatValidator = () => [
    body('name','Please Enter Group Name').notEmpty(),
    body('members').notEmpty().withMessage('Please Add Members').isArray({min:2,max:100}).withMessage('Members should be between 2 and 100')
];

const addMemberValidator = () => [
    body('chatId','Please Enter ChatId').notEmpty(),
    body('members').notEmpty().withMessage('Please Add Members').isArray({min:1,max:97}).withMessage('Members should be between 1 and 97')
]

const removeMemberValidator = () => [
    body('chatId','Please Enter ChatId').notEmpty(),
    body('userId','Please Enter UserId').notEmpty()
]

const leaveGroupValidator = () => [
   param('id','Please Enter ChatId').notEmpty()
]

const sendAttachmentValidator = () => [
    body('chatId','Please Enter ChatId').notEmpty(),
]

const getMessageVslidator = () => [
    param('id','Please Enter ChatId').notEmpty(),
]

const getChatDetailsValidator = () => [
    param('id','Please Enter ChatId').notEmpty()
]

const renameGroupValidator = () => [    
    body('name','Please Enter Group Name').notEmpty(),
    param('id','Please Enter ChatId').notEmpty()
]


const deleteChatValidator = () => [ 
    param('id','Please Enter ChatId').notEmpty()
]

const sendFriendRequestValidator = () => [
    body('userId','Please Enter UserId').notEmpty()
]

const acceptRequestValidator = () => [
   body('requestId','Please Enter ReceiverId').notEmpty(),
   body('accept').notEmpty().withMessage('Please Enter Accept').isBoolean().withMessage('Accept should be boolean')
]

const adminLoginValidator = () => [
    body('secretKey','Please Enter Secret Key').notEmpty()
]

export { registerValidator,validateHandler,loginValidator,newGroupChatValidator,addMemberValidator,removeMemberValidator,leaveGroupValidator,sendAttachmentValidator,getMessageVslidator,getChatDetailsValidator,renameGroupValidator
,deleteChatValidator,sendFriendRequestValidator,acceptRequestValidator,adminLoginValidator
}