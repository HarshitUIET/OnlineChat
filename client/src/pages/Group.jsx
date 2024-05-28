import React from 'react'
import Applayout from '../components/layout/Applayout'
import { Grid } from '@mui/material'

const Group = () => {
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
   Gro details
    </Grid>
   
  </Grid>
  )
}

export default Group;