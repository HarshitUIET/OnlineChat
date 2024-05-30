import { Box, Drawer, Grid, IconButton, Stack, Tab, Typography } from '@mui/material'
import React from 'react'
import { grayColor, matBlack } from './constants/color'
import {Menu as MenuIcon, Close as CloseIcon, Dashboard as DashboardIcon , ManageAccounts as ManageAccountsIcon ,
    Groups as GroupsIcon, Message as MessageIcon} 
from '@mui/icons-material'
import { useState } from 'react'
import { useLocation , Link as LinkComponent } from 'react-router-dom'
import {styled } from '@mui/system';

const Link = styled(LinkComponent) `
  text-decoration : none;
  border-radius : 2rem;
  padding : 1rem 2rem;
  color: black;
  &:hover {
    color : rgba(0,0,0,0.54);
  }
`;


const adminTabs = [
{
    name:"Dashboard",
    path:"/admin/dashboard",
    icon:<DashboardIcon/>
},
{
    name:"Users",
    path:"/admin/user-management",
    icon:<ManageAccountsIcon/>
},{
    name:"Groups",
    path:"/admin/group-management",
    icon:<GroupsIcon/>
},
{
    name:"Messages",
    path:"/admin/message-management",
    icon:<MessageIcon/>
}

]

const Sidebar = ({w ="100%"}) => {

     const location = useLocation();

    return <Stack width={w} direction={"column"} spacing={"3rem"} p={"3rem"} >
        <Typography variant={"h5"} textTransform= {"uppercase"} >chattu</Typography>

        <Stack spacing={"1rem"} >
            {
                adminTabs.map((i)=>(
                    <Link key={i.path} to={i.path}
                     sx={
                        location.pathname === i.path && {
                            bgcolor: matBlack,
                            color:"white",
                            "&:hover":{
                                color:"white"
                            }
                        }
                     }
                    >
                      <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} >
                        {
                            i.icon
                        }
                        <Typography>{i.name}</Typography>
                        </Stack>  
                    </Link>
                ))
            }
        </Stack>
    </Stack>
}

const AdminLayout = ({children}) => {

    const [isMobile,setIsMobile] = useState(false);

    const handleMobile = () => {    
        setIsMobile((prev)=>!prev);
    }

    const handleClose = () => {
        setIsMobile(false);
    }

  return (
    <Grid container minHeight={"100vh"} >
 
    <Box 
    sx={{
        display:{
            xs:"block",
            md:"none"
        },  
        position:"fixed",
        right:"1rem",
        top:"1rem",
    }}
    >
     <IconButton onClick={handleMobile}>
        {
            isMobile ? <CloseIcon/> : <MenuIcon/>
         }
     </IconButton>
    </Box>


        <Grid item  md={4} lg={3} 
         sx={{
            display:{
                xs:"none",
                md:"block"
            },
         }}
        >
            <Sidebar/>
        </Grid>
        <Grid item xs={12}  md={8} lg={9} 
        sx={{
            bgcolor:grayColor,
        }}
        >
            {children}
        </Grid>


      <Drawer open={isMobile} onClose={handleClose}>
        <Sidebar w="50vw" />
      </Drawer>

    </Grid>
  )
}

export default AdminLayout