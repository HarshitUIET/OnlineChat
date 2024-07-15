import { Box, Typography } from '@mui/material';
import React, { memo } from 'react'
import { lightBlue } from '../layout/constants/color';
import moment from 'moment';
import { fileformat } from '../../lib/features';
import RenderComponent from './RenderComponent';
import {motion} from 'framer-motion';

const MessageComponent = ({message,user}) => {

    const {sender,content,attachments=[],createdAt} = message;
    
    const sameSender = sender?._id === user?._id;

    const timeAgo = moment(createdAt).fromNow();

  return (
    <motion.div
    initial={{opacity:0,x:"-100%"}}
    whileInView={{opacity:1,x:0}}
    style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor:"white",
        color:"black",
        borderRadius:"5px",
        padding:"0.5rem",
        width:"fit-content",
    }}
      
    >
      {
        !sameSender && <Typography color={lightBlue} fontWeight={"600"} variant='caption' >{sender.name}</Typography>
      }
      {
        content && <Typography>{content}</Typography>
      } 

{
        attachments.length>0 && attachments.map((attachment,index)=>{

          const url = attachment.url;
          console.log(url);
          const file = fileformat(url);

          return (
            <Box key={index} >
              <a href={url} target='_blank' download style={{
                color:"black",
              }}>
                {
                  RenderComponent(url,file)
                
                }
              </a>
            </Box>
          )
        })
      }

      <Typography variant='caption' color="text.secondary" >{timeAgo}</Typography>

    

    </motion.div>
  )
}

export default memo(MessageComponent)