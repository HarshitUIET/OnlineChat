import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";
import { Message } from "../models/message.js";
import { ErrorHandler } from "../utilis/utility.js";
import jwt from 'jsonwebtoken';
import { cookieOptions } from "../utilis/features.js";

const adminLogin = TryCatch(async (req, res, next) => {
    
    const {secretKey} = req.body;

    const admin_secret_key = process.env.ADMIN_SECRET_KEY || "HarshitProgrammer";

    const isMatched = secretKey === admin_secret_key;

    if(!isMatched) return next(new ErrorHandler("Invalid Admin Key",401));

    const token = jwt.sign(secretKey,process.env.JWT_SECRET);

    return res.status(200).cookie('chattu-admin-token',token,{
        ...cookieOptions,
        maxAge : 1000*60*15
    }).json({
        success : true,
        message : "Authenticated Successfully,Welcome BOSS"
    })


})

const adminLogout = TryCatch(async (req,res,next) => {

    return res.status(200).cookie('chattu-admin-token','',{
        ...cookieOptions,
        maxAge : 0
    })
    .json({
        success : true,
        message : "Logged Out Successfully"
    
    })

})

const allUsers = TryCatch(async (req, res, next) => {


    const users = await User.find({});

    const transformedUsers = await Promise.all(
        users.map(async ({ name, username, avatar, _id }) => {

            const [groups, friends] = await Promise.all([
                Chat.countDocuments({ groupChat: true, members: _id }),
                Chat.countDocuments({ groupChat: false, members: _id })
            ])

            return {
                name,
                username,
                avatar: avatar.url,
                _id,
                groups,
                friends
            }
        }))

    return res.status(200).json({
        success: "true",
        users: transformedUsers
    })


})


const allChats = TryCatch(async (req, res, next) => {

    const chats = await Chat.find({}).
        populate('members', 'name avatar').
        populate('creator', 'name avatar');

    const transformChats = await Promise.all(
        chats.map(async ({ members, _id, groupChat, name, creator }) => {

            const totalMessages = await Message.countDocuments({
                chat: _id
            })

            return {
                _id,
                groupChat,
                name,
                avatar: members.slice(0, 3).map((member) => member.avatar.url),
                members: members.map(({ name, avatar, _id }) => ({
                    name,
                    avatar: avatar.url,
                    _id
                })),
                creator: {
                    name: creator?.name || "None",
                    avatar: creator?.avatar.url || "",
                },
                totalMembers: members.length,
                totalMessages
            }
        }))

    return res.status(200).json({
        success: "true",
        chats: transformChats
    })

})


const allMessages = TryCatch(async (req, res, next) => {

    const messages = await Message.find({}).
        populate('sender', 'name avatar').
        populate('chat', 'groupChat');

    const transformMessages = messages.map((
        { content, attachments, sender, chat, _id, createdAt }) => ({
            _id,
            attachments,
            content,
            createdAt,
            chat : chat._id,
            groupChat : chat.groupChat,
            sender : {
                _id : sender._id,
                name : sender.name,
                avatar : sender.avatar.url
            }
        }))

    return res.status(200).json({
        success: "true",
        messages: transformMessages
    })

})

const getDashBoardStats = TryCatch(async (req, res, next) => {

   const [groupsCount,usersCount,messagesCount,totalChatsCount] = await Promise.all([
         Chat.countDocuments({ groupChat : true }),
         User.countDocuments({}),
         Message.countDocuments({}),
         Chat.countDocuments({})
   ])

   const today = new Date();

   const last7Days = new Date();

    last7Days.setDate(today.getDate() - 7);

    const last7DaysMessages = await Message.find({
        createdAt : {
            $gte : last7Days,
            $lt : today
        }
    }).select('createdAt');
    

    const messages = new Array(7).fill(0);

    last7DaysMessages.forEach(message => {

        const indexApprox = (today.getTime()-message.createdAt.getTime())/(1000*60*60*24);  

        const index = Math.floor(indexApprox);

        messages[6-index]++;

    })


    const stats = {
        groupsCount,
        usersCount,
        messagesCount,
        totalChatsCount,
        messagesChart : messages
    }

    return res.status(200).json({
        success : "true",
        stats
    })

})


export { allUsers, allChats,allMessages,getDashBoardStats,adminLogin,adminLogout }