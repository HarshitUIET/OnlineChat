
import { Avatar, Icon, ListItem, Stack, Typography } from '@mui/material';
import React from 'react'
import { memo } from 'react';
import { Add as AddIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { Remove as RemoveIcon } from '@mui/icons-material';

const UserItem = ({user,handler,handlerIsLoading,isAdded = false,styling={}}) => {

    const {name,_id,avatar} = user;

  return (
    <ListItem>
        <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
        {...styling}
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
                {name}
            
            </Typography>

            <IconButton
             size="small"
             sx={{
                bgcolor: isAdded ? "error.main" :"primary.main",
                color:"white", 
                "&:hover":{
                    bgcolor: isAdded ? "error.dark" : "primary.dark"
                }
             }}
            onClick={()=>handler(_id)} disabled={handlerIsLoading}>
                {
                    isAdded ? <RemoveIcon/> : <AddIcon/>
                }
            </IconButton>
        </Stack>
    </ListItem>
  )
}

export default memo(UserItem);