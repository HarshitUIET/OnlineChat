import { AppBar, Backdrop, Badge, Box, IconButton, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material'
import {orange} from './constants/color'
import React, { Suspense } from 'react'
import { Logout as LogoutIcon, Notifications as NotificationIcon, Group as GroupIcon,Add as AddIcon, Search as SearchIcon,Menu as MenuIcon} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { lazy } from 'react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { server } from '../layout/constants/config';
import { useDispatch, useSelector } from 'react-redux'
import { userNotExists } from '../../redux/reducers/auth'
import { setIsMobile, setIsNewGroup, setIsNotification, setIsSearch } from '../../redux/reducers/misc'
import { resetNotification } from '../../redux/reducers/chat'


const SearchDialog = lazy(() => import('../specific/Search'));
const NotificationDialog = lazy(() => import('../specific/Notifications'));
const NewGroupDialog = lazy(() => import('../specific/NewGroup'));



const Header = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const {isSearch,isNotification} = useSelector(state => state.misc);
  const {notificationCount} = useSelector(state => state.chat);

  const {isNewGroup} = useSelector((state)=> state.misc);
 

   const handleMobile = () => {
      dispatch(setIsMobile(true));
   }

    const openSearchDialog = () => {
      dispatch(setIsSearch(true));
    }

    const openNewGroup = () => {
      dispatch(setIsNewGroup(true));
    }

    const navigateToGroup = () => {
        navigate('/group')
        console.log("Navigating to the groups ");
    };
    
    const openNotifications = () => {
      dispatch(setIsNotification(true));
      dispatch(resetNotification());
    }

    const LogoutHandler = async () => {
      try {
        const {data} = await axios.get(`${server}/api/v1/user/logout`,{withCredentials:true});
        dispatch(userNotExists());
        toast.success(data.message);
      } catch (error) {
         toast.error(error.response.data.message || "Something Went Wrong");
      }
    }

  return (
<>
   <Box sx={{flexGrow:1}} height={"4rem"}>
    <AppBar position='static' sx={{
      bgcolor: orange
    }} >
      <Toolbar>
        <Typography
        variant='h6'
        sx={{
          display:{xs:"none" , sm:"block"}
        }}
        >
          Chattu
        </Typography>
        <Box 
        sx={{
          display:{xs:'block',sm:'none'},
        }}>
          <IconButton color="inherit" onClick={handleMobile} >
            <MenuIcon/>
          </IconButton>
        </Box>
        <Box 
        sx={{
          flexGrow:1,
        }}
        />
        <Box>
         <Tooltip title="Search" >
         <IconButton color="inherit" size="large" onClick={openSearchDialog} >
            <SearchIcon/>
          </IconButton>
          </Tooltip>
          <Tooltip title="New Group" >
          <IconButton color="inherit" size="large" onClick={openNewGroup} >
            <AddIcon/>
          </IconButton>
          </Tooltip>
          <Tooltip title="Manage Groups" >
          <IconButton color="inherit" size="large" onClick={navigateToGroup} >
            <GroupIcon/>
          </IconButton>
          </Tooltip>
          <Tooltip title="Notifications" >
          <IconButton color="inherit" size="large" onClick={openNotifications} >
            {
              notificationCount ? <Badge badgeContent={notificationCount} color="error" >
                <NotificationIcon/>
              </Badge> : <NotificationIcon/>
            }
          </IconButton>
          </Tooltip>
          <Tooltip title="Logout" >
          <IconButton color="inherit" size="large" onClick={LogoutHandler} >
            <LogoutIcon/>
          </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
   </Box>
   {
    isSearch && 
    <Suspense fallback={<div><Backdrop open/></div>}>
      <SearchDialog/>
    </Suspense>
   }
   {
    isNotification && 
    <Suspense fallback={<div><Backdrop open/></div>}>
      <NotificationDialog/>
    </Suspense>
   }
   {
    isNewGroup && 
    <Suspense fallback={<div><Backdrop open/></div>}>
      <NewGroupDialog/>
    </Suspense>
   }
</>
  )
}

export default Header