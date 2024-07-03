import { compare } from 'bcrypt';
import {User} from '../models/user.js';
import {emitEvent, sendToken} from '../utilis/features.js'
import { TryCatch } from '../middlewares/error.js';
import { ErrorHandler } from '../utilis/utility.js';
import { cookieOptions } from '../utilis/features.js';
import { Chat } from '../models/chat.js';
import { NEW_REQUEST, REFETCH_CHATS } from '../constants/event.js';
import {Request} from '../models/request.js';
import {getOtherMember} from '../lib/helper.js';

const avatar = {
  public_id : "ssede",
  url : 'assssa'
}

const newUser = TryCatch( async (req,res) => {

    const {name,username,Bio,password} = req.body;
  
    const file = req.body;
  
    if(!file) return next(new ErrorHandler("Please Upload Avatar",400));
  
    console.log(name);
    
    const avatar = {
      public_id : "ssede",
      url : 'assssa'
    }
  
     const user = await User.create({
      name,
      username,
      Bio,
      password,
      avatar
    });
      
     sendToken(res,user,201,"User created successfully");
})


const login = TryCatch(async (req,res,next) => {

  
  const {username,password} = req.body;

const user = await User.findOne({username}).select("+password");


if(!user) return next(new ErrorHandler("Invalid Username or Password",404));

const isMatch = await compare(password,user.password);


if(!isMatch) return next(new ErrorHandler("Invalid  or Password",404));
  
sendToken(res,user,200,`Welcome Back , ${user.name} `);



})


const getMyProfile = TryCatch(async (req,res,next) => {

  const user = await User.findById(req.user);

  res.status(200).json({
    success : true,
    user
  })

});

const logout = TryCatch(async (req,res,next) => {

    return res.status(200).cookie("chattu-token"," ",{
      ...cookieOptions,
       maxAge : 0
    }).json({
      success : true,
      message : "Logged Out Successfully"
    
    });

});

const searchUser = TryCatch(async (req,res,next) => {

  const {name = ""} = req.query;
   
   // ALl my friends i have chatted with , including myself
  const myChats = await Chat.find({members : req.user,groupChat : false});

  // ALl my friends i have chatted with , including myself
  const allUsersFromMyChats = myChats.flatMap((chat)=>chat.members);

  // finding all users except me and my friends

  const allUsersExceptMeAndMyFriends = await User.find({
    id: {$nin : allUsersFromMyChats},
    name : {$regex : name,$options : 'i'}
  });

  const users = allUsersExceptMeAndMyFriends.map(({_id,name,avatar})=> (
    {
      _id,
      name,
      avatar:avatar.url
    }
  ))

  return res.status(200).json({
    success : true,
    users
  });

});

const sendFriendRequest = TryCatch(async (req,res,next) =>{
  
  const {userId} = req.body;

  const request = await Request.findOne({
    $or : [
      {sender : req.user,receiver : userId},
      {sender : userId,receiver : req.user}
    ]
  });

  if(request) return next(new ErrorHandler("Friend Request Already Sent",400));

   await Request.create({
    sender : req.user,
    receiver : userId
  });

  emitEvent(req,NEW_REQUEST,[userId]);

  return res.status(200).json({
    success : true,
    message : "Friend Request Sent"
  });

});


const acceptRequest = TryCatch(async (req,res,next) => {

  const {requestId,accept} = req.body;

  const request = await Request.findById(requestId).
  populate("sender","name").
  populate("receiver","name");

  if(!request) return next(new ErrorHandler("Request Not Found",404));



  if(request.receiver._id.toString() !== req.user) return next(new ErrorHandler("You are not authorized to accept this request",401));

  if(!accept) {
    await request.deleteOne();

    return res.status(200).json({
      success : true,
      message : "Request Rejected"
    });
  }

  const members = [request.sender._id,request.receiver._id];

  await Promise.all([
    Chat.create({
      members,
      name : `${request.sender.name}-${request.receiver.name}`,
    }),
    request.deleteOne()
  ])

  emitEvent(req,REFETCH_CHATS,members);

  return res.status(200).json({
    success : true,
    message : "Request Accepted",
    senderId : request.sender._id
  });

})


const getNotifications = TryCatch(async (req,res,next) => {

  const requests = await Request.find({receiver : req.user}).
  populate("sender","name avatar");

  console.log("Requests",requests);

  const allRequests = requests.map(({_id,sender})=> ({
    _id,
    sender : {
      _id : sender._id,
      name : sender.name,
      avatar : sender.avatar.url
    }
    
  }))

  return res.status(200).json({
    success : true,
    allRequests
  });

});


const getMyfriends = TryCatch(async (req,res,next) => {

      const chatId = req.query.chatId;

      const chats = await Chat.find({members : req.user,groupChat : false}).populate('members','name avatar');

      const friends = chats.map(({members})=>{
          const otherUser = getOtherMember(members,req.user)
          return {
            _id:otherUser._id,
            name : otherUser.name,
            avatar : otherUser.avatar.url
          }
      })

      if(chatId) {

          const chat = await Chat.findById(chatId);

          const availableFriends = friends.filter((friend)=>!chat.members.includes(friend._id));

          return res.status(200).json({
            success : true,
            friends : availableFriends
          })

      }else{
        return res.status(200).json({
          success : true,
          friends
        })
      }

})

export {login,newUser,getMyProfile,logout,searchUser,sendFriendRequest,acceptRequest,getNotifications,getMyfriends};