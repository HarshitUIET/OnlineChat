import React from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { Box, Container, Paper, Typography } from '@mui/material'
import { AdminPanelSettings as AdminPanelSettingsIcon,Group,Notifications as NotificationsIcon, Group as GroupIcon , Person as PersonIcon } from '@mui/icons-material'
import { Stack } from '@mui/material'
import { SearchField,CurveButton } from '../../components/style/stylecomponent'
import moment from 'moment'


const Appbar = (
    <Paper elevation={3}
     sx={{
        padding:"2rem" ,
        margin:"2rem 0",
        borderRadius:"1rem",
     }}
    >
        <Stack direction="row" alignItems="center"
        spacing={"1rem"} >
            <AdminPanelSettingsIcon sx={{fontSize:"3rem"}}/>
            <SearchField placeholder="Search..."/>

            <CurveButton>Search</CurveButton>
            <Box flexGrow={1}/>
            <Typography
             sx={{
                display:{
                    xs:"none",
                    sm:"block"
                }
             }}
            >
                {moment().format("dddd, D MMMM YYYY")}
            </Typography>
            <NotificationsIcon/>
        </Stack>

    </Paper>
)

const Dashboard = () => {

    const Widgets = <Stack
    direction={{
        xs:"column",
        sm:"row"
    }}
    ></Stack>

  return (
    <AdminLayout>
        <Container component={"main"} >
            {Appbar}

            <Stack direction={"row"} spacing={"2rem"} flexWrap={"wrap"} >
               <Paper
                elevation={3}
                sx={{
                    padding:"2rem 3.5rem",
                    borderRadius:"1rem",
                    width : "100%",
                    maxWidth:"45rem",
                    height:"25rem",
                }}
               >
                <Typography variant={"h4"} margin={"2rem 0"} >Last Messages</Typography>
                 {"chat"}
               </Paper>
               
              <Paper
              elevation={3}
              sx={{
                padding:"1rem",
                borderRadius:"1rem",
                display:"flex",
                justifyContent:"center",
                alignItems:"center",
                width:{
                    xs:"100%",
                    sm:"50%"
                },
                position:"relative",
                width:"100%",
                maxWidth:"25rem",
                height:"25rem"

              }}
              >
                {"Dougnut chart"}

                <Stack
              position={"absolute"}
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              spacing={"0.5rem"}
              width={"100%"}
              height={"100%"}
              >
                <GroupIcon/>
                <Typography>Vs</Typography>
                <PersonIcon/>
              </Stack>


              </Paper>

             
            </Stack>

            {Widgets}

        </Container>
    </AdminLayout>
  )
}



export default Dashboard