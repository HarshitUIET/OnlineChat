import React from 'react'
import Applayout from '../components/layout/Applayout'
import { Typography } from '@mui/material';
import {Box} from '@mui/material';

const Home = () => {
  return (
   <Box bgcolor={"rgba(0,0,0,0.1)"} height={"100%"} >
    <Typography variant={"h5"} p={"2rem"} textAlign={"center"}>
      Select a Friend to Chat
    </Typography>
   </Box>
  )
}

export default Applayout()(Home);