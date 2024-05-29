import React, { memo } from 'react'
import { Box, Drawer, Grid , IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { matBlack } from '../components/layout/constants/color'
import { useNavigate } from 'react-router-dom'
import {  KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon, Edit as EditIcon } from '@mui/icons-material'
import { useState } from 'react'
import {Link} from '../components/style/stylecomponent'
import AvatarCard from '../components/share/AvatarCard'
import {samplechats} from '../components/layout/constants/sampleData'
import { useSearchParams } from 'react-router-dom'


const Group = () => {


  const navigate  = useNavigate();

  const chatId = useSearchParams()[0].get('group');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isEdit,setIsEdit] = useState(false);

  console.log(isEdit);

  const handleMobile = () => {
    setIsMobileMenuOpen((prev)=>!prev);
  }

  const handleMobileClose = () => {
    setIsMobileMenuOpen(false);
  }

   const IconBtn = <>

     <Box
      sx={{
        display:{
          xs:"block",
          sm:"none"
        },
        position:"fixed",
        right:"1rem",
        top:"1rem",
        }
      }
     >
      <IconButton onClick={handleMobile}>
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

   const GroupName = (
   <Stack
    direction={"row"}
    alignItems={"center"}
    justifyContent={"center"}
    spacing={"1rem"}
    padding={"3rem"}
   >
    {
       
      isEdit ? (
     <>
           <TextField/>
      </>
      ) :
    ( 
    <>
       <Typography variant="h4">Group Name</Typography> <IconButton onClick={()=>setIsEdit(true)}><EditIcon/></IconButton>
      </>
      )}
   </Stack>
   )

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
   <GroupList myGroups={samplechats} chatId={chatId} />
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

    {
      GroupName
    }

    </Grid>

    <Drawer 
     sx={{
      display:{
        xs:"block",
        sm:"none"
      },  
     }}
    open={isMobileMenuOpen} onClose={handleMobileClose}>
       <GroupList chatId={chatId} w={'50vw'} myGroups={samplechats} />
    </Drawer>

  </Grid>
  )
}

const GroupList = ({w='100%',myGroups=[],chatId}) => (
  <Stack width={w}>
    {
      myGroups.length>0 ? (
        myGroups.map((group)=>{
          return <GroupListItem key={group._id} group={group} chatId={chatId} />
        })
      ) : (
        <Typography textAlign={"center"} padding="1rem" >
          No groups
        </Typography>
      )
    }


  </Stack>
)


const GroupListItem = memo(({group,chatId}) => {
   const {avatar,name,_id} = group;
   return (
    <Link to={`?group=${_id}`}
     onClick={(e)=> {
      if(chatId === _id){
        e.preventDefault();
     }}
    }
    >
      <Stack direction="row" alignItems="center" spacing={"1rem"} >
        <AvatarCard avatar={avatar} />
        <Typography>{name}</Typography>
      </Stack>
    </Link>

   )})


export default Group;