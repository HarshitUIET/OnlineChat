import React from 'react'
import Header from './Header'
import Title from '../share/Title'
import { Drawer, Grid, Skeleton } from '@mui/material'
import ChatList from '../specific/ChatList'
import { samplechats } from './constants/sampleData'
import { useParams } from 'react-router-dom'
import Profile from '../specific/Profile'
import { useMyChatsQuery } from '../../redux/api/api'
import { useDispatch, useSelector } from 'react-redux'
import { setIsMobile } from '../../redux/reducers/misc'
import {useErrors} from '../../hooks/hook'

const Applayout = () => (WrappedComponent) => {
   return (props) => {

      const params = useParams();

      const dispatch = useDispatch();

      const {user} = useSelector((state) => state.auth);

      const chatId = params.chatId;

      const { isMobile } = useSelector((state) => state.misc);

      const handleMobileClose = () => {
         dispatch(setIsMobile(false));
      }

      const { isError, isLoading, refetch, error, data } = useMyChatsQuery("");

      useErrors([{ isError, error }]);



      const handleDeleteChat = (e, _id, groupChat) => {
         e.preventDefault();
         console.log("Delete Chat", _id, groupChat);
      }

      return (
         <div className=' h-screen' >
            <Title />
            <Header />

            {
               isLoading ? <Skeleton /> : (
                  <Drawer 
                  open={isMobile} 
                  onClose={handleMobileClose}
                  >
                     <ChatList
                        w='70vw'
                        chatId={chatId}
                        chats={data?.chats}
                        handleDeleteChat={handleDeleteChat}
                     />
                  </Drawer>
               )
            }

            <Grid container height={"calc(100vh - 4rem)"} >
               <Grid
                  item
                  xs={4}
                  md={3}
                  sx={{
                     display: { xs: "none", sm: 'block' }
                  }}
                  height={"100%"} >
                  {
                     isLoading ? <Skeleton /> :
                        <ChatList chats={data?.chats} chatId={chatId} handleDeleteChat={handleDeleteChat}
                        />
                  }
               </Grid>
               <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"} >
                  <WrappedComponent {...props} />
               </Grid>
               <Grid item md={4} lg={3} height={"100%"}
                  sx={{
                     display: { xs: 'none', md: 'block' },
                     padding: "2rem",
                     bgcolor: "rgba(0,0,0,0.85)",
                  }}
               >
                  <Profile user={user} />
               </Grid>
            </Grid>
         </div>
      )
   }
}

export default Applayout