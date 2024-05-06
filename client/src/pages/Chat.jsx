import React, { Fragment, useRef } from 'react'
import Applayout from '../components/layout/Applayout'
import { Icon, IconButton, Stack } from '@mui/material';
import { grayColor } from '../components/layout/constants/color';
import { Send as SendIcon ,AttachFile as AttachIcon} from '@mui/icons-material';
import { InputBox } from '../components/style/stylecomponent';
import {orange} from '../components/layout/constants/color';
import FileMenu from '../components/Dialog/FileMenu';



const Chat = () => {

  const containerRef = useRef(null);

  

  return (
     <Fragment>
      <Stack 
      ref = {containerRef}
      boxSizing={"border-box"}
      height={"90%"}
      padding={"1rem"}
      bgcolor={grayColor}
      spacing={"1rem"}
      sx={{
        overflowX:"hidden",
        overflowY:"auto",
      }}
      >
        {/* Chat Messages */  }
      </Stack>
     
      <form 
      style={{
        height:"10%",
      }}
      >
        <Stack
        direction={"row"}
        height={"100%"}
        padding={"1rem"}
        alignItems={"center"}
        position={"relative"}
        >


          <IconButton
          sx={{
            position:"absolute",
            left:"1.5rem"
          }}


          >
            <AttachIcon/>
          </IconButton>

          <InputBox placeholder='Type Message Here...'/>

          <IconButton
          type='submit'
          sx={{
            bgcolor : orange,
            color:"white",
            marginLeft:"1rem",
            padding:"0.5rem",
            "&:hover":{
              bgcolor: "error.dark"
            }
          }}
          >
            <SendIcon/>
          </IconButton>

        </Stack>
      </form>

      <FileMenu  />

     </Fragment>
  )
}

export default Applayout()(Chat);