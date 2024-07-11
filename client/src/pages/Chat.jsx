import React, { Fragment, useCallback, useRef } from 'react'
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
import { NEW_MESSAGE } from '../components/layout/constants/event';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { useErrors, useSocketEvents } from '../hooks/hook';
import { useDispatch, useSelector } from 'react-redux';
import {useInfiniteScrollTop} from '6pp'
import { setIsFileMenu } from '../redux/reducers/misc';


const Chat = ({chatId}) => {

  const user  = useSelector((state)=> state.auth.user);


  const containerRef = useRef(null);

  const dispatch = useDispatch();

  const socket = getSocket();

  const [message,setMessage] = useState("");

  const [messages,setMessages] = useState([]);

  const [page,setPage] = useState(1);

  const [anchor,setAnchor] = useState(null);

  console.log("Messages",messages);
  
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
    console.log("DATA",data);
    setMessages((prev)=>[...prev,data.message]);
  },[]);

  const eventArr = {[NEW_MESSAGE] : newMessageHandler};

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
           value={message} onChange={(e)=> setMessage(e.target.value)}
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