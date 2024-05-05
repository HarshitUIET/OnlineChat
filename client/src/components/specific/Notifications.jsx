import { Dialog, DialogTitle, Stack, Typography } from '@mui/material'
import React from 'react'
import { sampleNotifiactions } from '../layout/constants/sampleData'
import {memo} from 'react'
import { Avatar, Button, ListItem } from '@mui/material'



const Notifications = () => {


   const friendRequestHandler = (id) => {
      console.log(id);
    }

  return (
    <Dialog open>


      <Stack p={{xs:"1rem" , sm:"2rem"}} maxWidth={"25rem"} >
          <DialogTitle>Notifications</DialogTitle>


          {
            sampleNotifiactions.length > 0 ? (
              sampleNotifiactions.map((i) => (
                <NotificationItem key={i._id} _id={i._id}  sender={i.sender} handler={friendRequestHandler} />
              ))
            )
            
            
            
            : 
            
            <Typography textAlign={"center"}>0 Notifications</Typography>
          }

      </Stack>  
    </Dialog>
  )
}

const NotificationItem = memo(({sender,handler,_id}) => {

  const {name,avatar} = sender;


  return (
    <ListItem>
        <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
        >
            <Avatar/>
            <Typography
             variant={"body1"}
             sx={{
                flexGrow:1,
                display:"-webkit-box",
                WebkitBoxOrient:"vertical",
                WebkitLineClamp:1,
                overflow:"hidden",
                textOverflow:"ellipsis",
                width:"100%",
             }}
            >
                {`${name } sent you a friend request`} 
    
            </Typography>

           <Stack direction={{
            xs:"column",
            sm:"row"
           }}> 
            <Button onClick={()=>handler({_id,accept:true})}>Accept</Button>
            <Button color='error' onClick={()=>handler({_id,accept:false})}>Reject</Button>
            
           </Stack>
 
        </Stack>
    </ListItem>
  );
});


export default Notifications