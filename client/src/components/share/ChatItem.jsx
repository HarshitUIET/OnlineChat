import React, { memo } from 'react'
import {Link} from '../style/stylecomponent'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { CycloneSharp } from '@mui/icons-material'
import AvatarCard from './AvatarCard'
import Stack from  '@mui/material/Stack'

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender = false,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  return (
    <Link to={`/chat/${_id}`} 
     style={
      {
        padding:  0
      }
     }
    onContextMenu={(e)=>handleDeleteChat(e,_id,groupChat)} >
      <div style={{
        display:"flex",
        gap:"1rem",
        alignItems:"center",
        padding:"1rem",
        backgroundColor: sameSender ? "black" : "unset",
        color: sameSender ? "white" : "unset",  
        position: "relative",
      }} >
          <AvatarCard avatar={avatar} />
      <Stack>
          <Typography >{name}</Typography>
          {
            newMessageAlert && (
              <Typography>{newMessageAlert.count} New Message</Typography>
            )
          }
      </Stack>
      {
        isOnline && (
          <Box sx={{
            width:"10px",
            height:"10px",
            borderRadius:"50%",
            backgroundColor:"green",
            position:"absolute",
            right:"1rem",
            top:"50%",
            transform:"translateY(-50%)"
          }}/>
        )
      }
      </div>
    </Link>
  )
}

export default memo(ChatItem);