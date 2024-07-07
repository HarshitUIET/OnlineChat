import { AppBar, Backdrop, Box, IconButton, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material'
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
import { setIsMobile, setIsSearch } from '../../redux/reducers/misc'


const SearchDialog = lazy(() => import('../specific/Search'));
const NotificationDialog = lazy(() => import('../specific/Notifications'));
const NewGroupDialog = lazy(() => import('../specific/NewGroup'));



const Header = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const {isSearch} = useSelector(state => state.misc);
  const [isNotification, setIsNotification] = useState(false);
  const [isNewGroup, setIsNewGroup] = useState(false);
 

   const handleMobile = () => {
      dispatch(setIsMobile(true));
   }

    const openSearchDialog = () => {
      dispatch(setIsSearch(true));
    }

    const openNewGroup = () => {
      setIsNewGroup((prev)=>!prev);
    }

    const navigateToGroup = () => {
        navigate('/group')
        console.log("Navigating to the groups ");
    };
    
    const openNotifications = () => {
      setIsNotification((prev)=>!prev);
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
            <NotificationIcon/>
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