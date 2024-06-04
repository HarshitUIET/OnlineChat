import { ALERT, REFETCH_CHATS } from '../constants/event.js'
import { TryCatch } from "../middlewares/error.js"
import { Chat } from "../models/chat.js";
import { ErrorHandler } from "../utilis/utility.js";
import { emitEvent } from "../utilis/features.js";


const newGroupChat = TryCatch(async (req,res,next) => {

    const {name,members} = req.body;

    if(members.length<2) return next(new ErrorHandler("Group chat must have atleast 3 members"),400);
    
    const allMembers = [...members,req.user];

     await Chat.create({
        name,
        members : allMembers,
        creator : req.user,
        groupChat : true 

     })


        emitEvent(req,ALERT,allMembers,`Welcome to ${name} group`);
        emitEvent(req,REFETCH_CHATS,members);

        res.status(201).json({
            success : true,
            message : "Group Created successfully"
        })



})

export { newGroupChat }