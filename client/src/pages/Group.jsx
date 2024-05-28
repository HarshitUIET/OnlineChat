import React from 'react'
import Applayout from '../components/layout/Applayout'
import { Box, Grid , IconButton, Menu as MenuIcon, Tooltip } from '@mui/material'
import { matBlack } from '../components/layout/constants/color'
import { useNavigate } from 'react-router-dom'
import {  KeyboardBackspace as KeyboardBackspaceIcon } from '@mui/icons-material'

const Group = () => {

  const navigate  = useNavigate();

   const IconBtn = <>

     <Box
      sx={{
        display:{
          xs:"none",
          sm:"block"
        },
        position:"fixed",
        right:"1rem",
        top:"1rem"
        }
      }
     >
      <IconButton>
        <MenuIcon/>
      </IconButton>
     </Box>
     <Tooltip title="back" >
      <IconButton
       sx={{
          position:"absolute",
          top: "2rem",
          left: "2rem",
          bgcolor:matBlack,
          ":hover" : {
            bgcolor:"rgba(0,0,0,0.7)",
          },
          color:"white",
       }}
       onClick={()=>navigate('/')}
      >
       <KeyboardBackspaceIcon/>
      </IconButton>
     </Tooltip>
   </>

  return  (
  <Grid container height={'100vh'} >
   <Grid 
   item 
   sx={{
    display:{
      xs:"none",
      sm:"block"
    },
   }}
   sm={4} 
   bgcolor = {"bisque"}
   >
    Groups List
   </Grid>

   <Grid 
   item 
   xs={12}
    sm={8}
    sx={{
      display:"flex",
      flexDirection:"column",
      alignItems:"center",
      padding : "1rem 3rem",
      position: "relative"
    }}
    >
    {
      IconBtn
    }
    </Grid>
  </Grid>
  )
}

export default Group;