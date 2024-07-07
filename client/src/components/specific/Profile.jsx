import { Stack, Typography } from '@mui/material'
import React from 'react'
import { Avatar } from '@mui/material'
import { Face as FaceIcon, AlternateEmail as UsernameIcon,CalendarMonth as CalendarIcon } from '@mui/icons-material'; 
import moment from 'moment'
import { transformImage } from '../../lib/features';


const Profile = ({user}) => {

  
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
        <Avatar 
        sx={{
            width:200,
            height:200,
            ObjectFit:"contain",
            marginBottom:"1rem",
            border : "5px solid white"
        }}
        src={transformImage(user?.avatar?.url)}
        />

       <ProfileCard heading={"Bio"} text = {user?.Bio}/>

         <ProfileCard heading={"Username"} text = {user?.username} Icon={<UsernameIcon/>}/>

         <ProfileCard heading={"Name"} text = {user?.name}
         Icon={<FaceIcon/>}/>

         <ProfileCard heading={"Joined"} 
         text={moment(user?.createAt).fromNow()}
          Icon={<CalendarIcon/>}/>
          
    </Stack>
  )
};

const ProfileCard = ({text,Icon,heading}) => (
    <Stack
    direction={"row"}
    alignItems={"center"}
    spacing={"1rem"}
    color={"white"}
    textAlign={"center"}
    >
     {Icon && Icon}
     <Stack>
        <Typography variant='body1'>{text}</Typography>
        <Typography color={"gray"} variant='caption'>{heading}</Typography>
     </Stack>
    </Stack>
)

export default Profile