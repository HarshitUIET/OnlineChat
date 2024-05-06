import React from 'react'
import Applayout from '../components/layout/Applayout'
import { Typography } from '@mui/material';
import {Box} from '@mui/material';
import { grayColor } from '../components/layout/constants/color';

const Home = () => {
  return (
   <Box bgcolor={grayColor} height={"100%"} >
    <Typography variant={"h5"} p={"2rem"} textAlign={"center"}>
      Select a Friend to Chat
    </Typography>
   </Box>
  )
}

export default Applayout()(Home);