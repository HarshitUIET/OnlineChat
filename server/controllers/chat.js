import { ALERT, NEW_ATTACHMENT, NEW_MESSAGE, NEW_MESSAGE_ALERT, REFETCH_CHATS } from '../constants/event.js'
import { TryCatch } from "../middlewares/error.js"
import { Chat } from "../models/chat.js";
import { ErrorHandler } from "../utilis/utility.js";
import { deleteFilesFromCloudinary, emitEvent, uploadFileToCloudinary } from "../utilis/features.js";
import { getOtherMember } from '../lib/helper.js';
import { User } from '../models/user.js';
import { Types } from 'mongoose';
import { Message } from '../models/message.js';


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


const getMyChat = TryCatch(async (req,res,next)=> {

    
    const chats = await Chat.find({members : req.user})
    .populate('members','name avatar');



    const transformChats = chats.map(({_id,name,members,groupChat}) => {

        const otherMember = getOtherMember(members,req.user);

        return {
            _id,
            name : groupChat ? name : otherMember.name,
            groupChat,
            avatar : groupChat ? members.slice(0,3).map(({avatar}) => avatar.url) : [otherMember.avatar.url],
            members : members.reduce((acc,member) => {
                if(member._id.toString() !== req.user.toString()) {
                    acc.push(member._id);
                }
                return acc;
            },[])
        }
    })

    res.status(200).json({
        success : true,
        chats: transformChats
    })

})

const getMyGroups = TryCatch(async (req,res,next) => {

    const chats = await Chat.find({
        groupChat : true,
        members : req.user,
    }).populate('members','name avatar');

    const groups = chats.map(({_id,groupChat,name,members}) => {
        return {
            _id,
            name,
            groupChat,
            avatar : members.slice(0,3).map(({avatar}) => avatar.url),
        }
    })

    res.status(200).json({
        success : true,
        groups
    });

})



const addMembers = TryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;

  if (!Types.ObjectId.isValid(chatId)) {
    return next(new ErrorHandler("Invalid chat ID", 400));
  }

  
  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(new ErrorHandler("Chat not found", 404));
  }

  if (!chat.groupChat) {
    return next(new ErrorHandler("This is not a group chat", 400));
  }

  if (chat.creator.toString() !== req.user.toString()) {
    return next(new ErrorHandler("You are not allowed to add members", 401));
  }

  const allNewMemberPromise = members.map((id) => User.findById(id).select('name'));
  const allNewMembers = await Promise.all(allNewMemberPromise);

  const alreadyMembers = [];
  const newMembers = [];

  allNewMembers.forEach((member) => {
    if (chat.members.includes(member._id.toString())) {
      alreadyMembers.push(member.name);
    } else {
      chat.members.push(member._id);
      newMembers.push(member.name);
    }
  });

  if (newMembers.length > 0) {
    await chat.save();

    const allUsersName = newMembers.join(",");
    emitEvent(req, ALERT, chat.members,{
        chatId,
        message : `${allUsersName} has been added to ${chat.name} group`
    });
    emitEvent(req, REFETCH_CHATS, chat.members);
  }

  const message = `${newMembers.length > 0 ? `Members added to ${chat.name} group successfully.` : ''} ${
    alreadyMembers.length > 0 ? `The following members are already in the group: ${alreadyMembers.join(", ")}.` : ''
  }`.trim();

  return res.status(200).json({
    success: true,
    message,
  });
});

const removeMembers = TryCatch(async (req, res, next) => {
    const { chatId, userId } = req.body;

    if (!Types.ObjectId.isValid(chatId)) {
        return next(new ErrorHandler("Invalid chat ID", 400));
    }

    if (!Types.ObjectId.isValid(userId)) {
        return next(new ErrorHandler("Invalid user ID", 400));
    }

    const [chat, userThatWillBeRemoved] = await Promise.all([
        Chat.findById(chatId),
        User.findById(userId, 'name')
    ]);

    if (!chat) {
        return next(new ErrorHandler("Chat not found", 404));
    }

    if (!userThatWillBeRemoved) {
        return next(new ErrorHandler("User not found", 404));
    }

    if (!chat.groupChat) {
        return next(new ErrorHandler("This is not a group chat", 400));
    }

    if (chat.creator.toString() !== req.user.toString()) {
        return next(new ErrorHandler("You are not allowed to remove members", 401));
    }

    if (chat.members.length <= 3) {
        return next(new ErrorHandler("Group must have at least 3 members", 400));
    }

    console.log(userId.toString(), chat.members);

    const initialMemberCount = chat.members.length;

    const allChatMembers = chat.members.map(member => member.toString());  

    chat.members = chat.members.filter(member => member.toString() !== userId.toString());

    if (chat.members.length === initialMemberCount) {
        return next(new ErrorHandler("User is not a member of this group", 400));
    }

    await chat.save();

    emitEvent(req, ALERT, chat.members,{
        chatId,
        message :  `${userThatWillBeRemoved.name} has been removed from ${chat.name} group`
    });
    emitEvent(req, REFETCH_CHATS, allChatMembers);

    return res.status(200).json({
        success: true,
        message: "Member removed successfully"
    });
});

const leaveGroup = TryCatch( async (req,res,next) => {
  
    const chatId = req.params.id;
    console.log(chatId);

    if(!Types.ObjectId.isValid(chatId)) {
        return next(new ErrorHandler("Invalid chat ID",400));
    }

    const chat = await Chat.findById(chatId);

    if(!chat) {
        return next(new ErrorHandler("Chat not found",404));
    }

    if(!chat.groupChat) {
        return next(new ErrorHandler("This is not a group chat",400));
    }

    const remainingMembers = chat.members.filter(member => member.toString() !== req.user.toString());

    if(remainingMembers.length < 3) {
        return next(new ErrorHandler("Group must have at least 3 members",400));
    }

    if(chat.creator.toString() === req.user.toString()) {

        const randomElement = Math.floor(Math.random()*remainingMembers.length);

        chat.creator = remainingMembers[randomElement];

    }

    chat.members = remainingMembers;

    const [user] = await Promise.all([
        User.findById(req.user).select('name')
        , chat.save()]);
    
    emitEvent(req,ALERT,chat.members,{
        chatId,
        message : `${user.name} has left the group`
    });

    return res.status(200).json(({
        succes: true,
        message : `${user.name} has left the group`
    }))



})

const sendAttachments = TryCatch(async (req,res,next)=>{

    const {chatId} = req.body;

    const files = req.files || [];

    if(files.length<1) {
        return next(new ErrorHandler("Please provide attachment",400));
    }

    if(files.length > 5) {
        return next(new ErrorHandler("You can upload at most 5 files",400));
    }

    if(!Types.ObjectId.isValid(chatId)) {
        return next(new ErrorHandler("Invalid chat ID",400));
    }

    const [chats,me] = await Promise.all([
        Chat.findById(chatId),
        User.findById(req.user).select('name')
    ]);

    if(!chats) {
        return next(new ErrorHandler("Chat not found",404));
    }

    // uploading handle here
    const attachments = await uploadFileToCloudinary(files);

    if(files.length === 0) {
        return next(new ErrorHandler("Please Provide attachment",400));
    }

    const messageforRealTime = {
        content : '',
        attachments,
        sender : me._id,
        chat : chatId
    }

    const messageForDB = {
        ...messageforRealTime,
        sender : {
            _id : me._id,
            name : me.name
        }
    }

    const message = await Message.create(messageForDB);

    emitEvent(req,NEW_MESSAGE,chats.members,{
        message : messageForDB,
        chatId
    });

    emitEvent(req,NEW_MESSAGE_ALERT,chats.members,{chatId});

    return res.status(200).json({
        success : true,
        message 
    })

});


const getChatDetails = TryCatch( async (req,res,next) => {
    
      if(req.query.populate === "true") {

         const chat = await Chat.findById(req.params.id)
            .populate('members','name avatar').lean();

            if(!chat) return next(new ErrorHandler("Chat not found",404));

            chat.members = chat.members.map(({_id,name,avatar}) => ({
                _id,
                name,
                avatar : avatar.url
            }));

            return res.status(200).json({
                success : true,
                chat
            })

      }
      else {
        
        const chat = await Chat.findById(req.params.id);

        if(!chat) return next(new ErrorHandler("Chat not found",404));

        return res.status(200).json({
            success : true,
            chat
        })
      

      }
 
})


const renameGroup = TryCatch(async (req,res,next) => {

    const chatId = req.params.id;
    const {name} = req.body;

    const chat = await Chat.findById(chatId);

    if(!chat) return next(new ErrorHandler("Chat not found",404));

    if(!chat.groupChat) return next(new ErrorHandler("This is not a group chat",400));

    if(chat.creator.toString() !== req.user.toString()) return next(new ErrorHandler("You are not allowed to rename the group",401));

    chat.name = name;

    await chat.save();

    emitEvent(req,REFETCH_CHATS,chat.members);

    return res.status(200).json({
        success : true,
        message : "Group renamed successfully"
    })

})


const deleteChat = TryCatch(async (req,res,next) => {
     

    const chatId = req.params.id;

    const chat = await Chat.findById(chatId);

    const members = chat.members;

    console.log(chat);

    if(!chat) return next(new ErrorHandler("Chat not found",404));

    if(chat.groupChat && chat.creator.toString() !== req.user.toString()) return next(new ErrorHandler("You are not allowed to delete the chat",401));

    if(!chat.groupChat && !chat.members.includes(req.user.toString())) return next(new ErrorHandler("You are not allowed to delete the chat",401));

    const messageWithAttachments = await Message.find({
        chat : chatId,
        attachments : { $exists : true , $ne : []}
    })

    const public_ids = [];

    messageWithAttachments.forEach(({attachments}) => 
        attachments.forEach(({public_id}) => 
            public_ids.push(public_id)
        )
    )

    await Promise.all([
        deleteFilesFromCloudinary(public_ids),  
        chat.deleteOne(),
        Message.deleteMany({chat : chatId}),
    ]);

       emitEvent(req,REFETCH_CHATS,members);

         return res.status(200).json({
              success : true,
              message : "Chat deleted successfully"

    })

})

const getMessageDetails = TryCatch(async (req,res,next) => {
     
    const chatId = req.params.id;

    const chat = await Chat.findById(chatId);

    if(!chat.members.includes(req.user.toString())) {
        return next(new ErrorHandler("You are not allowed to view this chat",401));
    }

    const {page = 1}  = req.query;
    
    const limit = 20;

    const skip = (page - 1) * limit;

    const [messages,totalMessageCount] = await Promise.all([
        Message.find({
            chat : chatId   
        })
        .sort({createdAt : -1})
        .skip(skip)
        .limit(limit)
        .populate('sender','name')
        .lean(),Message.countDocuments({chat : chatId})  
    ])
    const totalPages = Math.ceil(totalMessageCount/limit);
    
      return res.status(200).json({
          success : true,
          messages : messages.reverse(),
          totalPages
      })

})

export { newGroupChat, getMyChat,getMyGroups,addMembers,removeMembers,leaveGroup,sendAttachments,getChatDetails,renameGroup,deleteChat,getMessageDetails}