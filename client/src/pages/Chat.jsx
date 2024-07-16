import React, { Fragment, useCallback, useEffect, useRef } from 'react'
import Applayout from '../components/layout/Applayout'
import { Icon, IconButton, Skeleton, Stack } from '@mui/material';
import { grayColor } from '../components/layout/constants/color';
import { Send as SendIcon ,AttachFile as AttachIcon} from '@mui/icons-material';
import { InputBox } from '../components/style/stylecomponent';
import {orange} from '../components/layout/constants/color';
import FileMenu from '../components/Dialog/FileMenu';
import { sampleMessage } from '../components/layout/constants/sampleData';
import MessageComponent from '../components/share/MessageComponent';
import { useState } from 'react';
import { getSocket } from '../socket';
import { CHAT_JOINED,CHAT_EXITED, NEW_MESSAGE, STOP_TYPING, ONLINE_USERS } from '../components/layout/constants/event';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { useErrors, useSocketEvents } from '../hooks/hook';
import { useDispatch, useSelector } from 'react-redux';
import {useInfiniteScrollTop} from '6pp'
import { setIsFileMenu } from '../redux/reducers/misc';
import { clearNewMessagesAlert } from '../redux/reducers/chat';
import { START_TYPING } from '../../../server/constants/event';
import { TypingLoader } from '../components/layout/Loaders';
import { ALERT } from '../components/layout/constants/event';
import { useNavigate } from 'react-router-dom';



const Chat = ({chatId}) => {

  const navigate = useNavigate();

  const user  = useSelector((state)=> state.auth.user);

  const {newMessageAlert} = useSelector((state)=> state.chat);

  const [IamTyping,setIamTyping] = useState(false);
  const [userTyping,setUserTyping] = useState(false);
  const typingTimeout = useRef(null);


  const containerRef = useRef(null);

  const dispatch = useDispatch();

  const socket = getSocket();

  const [message,setMessage] = useState("");

  const [messages,setMessages] = useState([]);

  const [page,setPage] = useState(1);

  const bottomRef = useRef(null);

  const [anchor,setAnchor] = useState(null);
  
  const chatDetails = useChatDetailsQuery({chatId,skip:!chatId});

  const oldMessagesChunk = useGetMessagesQuery({chatId,page});

  const {data:oldMessages,setData:setOldMessage} = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const errors = [
    {isError:chatDetails.isError,error:chatDetails.error},
    {isError:oldMessagesChunk.isError,error:oldMessagesChunk.error}
  ];

  useErrors(errors);

  const members = chatDetails?.data?.chat?.members;

  const allMessages = [...oldMessages,...messages];

  const handleFileOpen = (e) => {
     dispatch(setIsFileMenu(true));
     setAnchor(e.currentTarget);
  }

  const submitHandler = (e) => {

    e.preventDefault();

   if(!message.trim()) return;


    socket.emit(NEW_MESSAGE,{
      chatId,
      members,
      message
    })

    setMessage("");

  }


  const newMessageHandler = useCallback((data)=> {

    if(data.chatId !== chatId) return;

    setMessages((prev)=>[...prev,data.message]);
  },[chatId]);

  const messageChangeHandler = (e) => {

    setMessage(e.target.value);

     console.log(IamTyping);

    if(!IamTyping) {
      socket.emit(START_TYPING,{members,chatId});
      setIamTyping(true);
    }  


    if(typingTimeout.current) clearTimeout(typingTimeout.current);


    typingTimeout.current =  setTimeout(()=>{
        socket.emit(STOP_TYPING,{members,chatId});
        setIamTyping(false);
     },[2000])

  }

  const newMessagesListener = useCallback((data)=> {
    
      if(data.chatId !== chatId ) return ;

      setUserTyping(true);
  },[chatId]);

  const stopTypingListener = useCallback((data)=> {

    if(data.chatId !== chatId) return;

    setUserTyping(false);
  },[chatId]);


 useEffect(()=>{

  dispatch(clearNewMessagesAlert(chatId));

  socket.emit(CHAT_JOINED,{members,userId:user._id});

   return () => {
    setMessages([]);
    setMessage("");
    setOldMessage([]);
    setPage(1);
    socket.emit(CHAT_EXITED,{members,userId:user._id});
   }
 },[chatId])


//  useEffect(()=>{
//   if(!chatDetails.isError) {
//      navigate('/');
//   }
//  },[chatDetails.isError])

 useEffect(()=>{
  if(bottomRef.current){
    bottomRef.current.scrollIntoView({behavior : "smooth"});
  }
 },[messages])

 const alertListener = useCallback((data)=>{

  if(data.chatId !== chatId) return;
  
  const messageForAlert = {
    content : data.message,
    sender : {
      _id : Math.random(),
      name : "Admin"
    },
    chat : chatId,
    createdAt : new Date().toISOString()
  }


  setMessages((prev) => [...prev,messageForAlert]);

 },[chatId]);

  const eventArr = {
    [ALERT] : alertListener,
    [NEW_MESSAGE] : newMessageHandler,
    [START_TYPING] : newMessagesListener,
    [STOP_TYPING] : stopTypingListener,
  };

  useSocketEvents(socket,eventArr)

  return chatDetails.isLoading ? <Skeleton/> : (
     <Fragment>
      <Stack 
      ref = {containerRef}
      boxSizing={"border-box"}
      height={"90%"}
      padding={"1rem"}
      bgcolor={grayColor}
      spacing={"1rem"}
      sx={{
        overflowX:"hidden",
        overflowY:"auto",
      }}
      >
        {
          allMessages.map((i)=> (
            <MessageComponent user={user} key={i._id} message={i}/>
          ))
        }

        {
          userTyping && <TypingLoader/>
        }

       <div
        ref={bottomRef}
       />

      </Stack>
     
      <form 
      style={{
        height:"10%",
      }}
      onSubmit={submitHandler}
      >
        <Stack
        direction={"row"}
        height={"100%"}
        padding={"1rem"}
        alignItems={"center"}
        position={"relative"}
        >


          <IconButton
          sx={{
            position:"absolute",
            left:"1.5rem"
          }}
          onClick={handleFileOpen}

          >
            <AttachIcon/>
          </IconButton>

          <InputBox placeholder='Type Message Here...'
           value={message} onChange={messageChangeHandler}
          />

          <IconButton
          type='submit'
          sx={{
            bgcolor : orange,
            color:"white",
            marginLeft:"1rem",
            padding:"0.5rem",
            "&:hover":{
              bgcolor: "error.dark"
            }
          }}
          >
            <SendIcon/>
          </IconButton>

        </Stack>
      </form>

      <FileMenu anchorE1={anchor} chatId={chatId} />

     </Fragment>
  )
}

export default Applayout()(Chat);