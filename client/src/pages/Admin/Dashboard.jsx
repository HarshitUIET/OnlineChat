import React from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { Box, Container, Paper, Typography } from '@mui/material'
import { AdminPanelSettings as AdminPanelSettingsIcon,Group,Notifications as NotificationsIcon, Group as GroupIcon , Person as PersonIcon , Message as MessageIcon } from '@mui/icons-material'
import { Stack } from '@mui/material'
import { SearchField,CurveButton } from '../../components/style/stylecomponent'
import moment from 'moment'
import { DoughnutChart, LineChart } from '../../components/specific/Charts'


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
    spacing="2rem"
    justifyContent="space-between"
    alignItems={"center"}
    margin={"2rem 0"}
    >
        <Widget title={"Users"} value={34} Icon={<PersonIcon/>} />
        <Widget title={"Chats"} value={3}  Icon={<GroupIcon/>} />
        <Widget title={"Messages"} value={450} Icon={<MessageIcon/>} />
    </Stack>

  return (
    <AdminLayout>
        <Container component={"main"} >
            {Appbar}

            <Stack direction={"row"}  flexWrap={"wrap"}
            justifyContent={"center"}
            alignItems={{
                xs:"center",
                lg:"stretch"
            }}

            sx={{
                gap:"2rem"
            }}

            >
               <Paper
                elevation={3}
                sx={{
                    padding:"2rem 3.5rem",
                    borderRadius:"1rem",
                    width : "100%",
                    maxWidth:"45rem",
                   
                }}
               >
                <Typography variant={"h4"} margin={"2rem 0"} >Last Messages</Typography>
                 <LineChart value={[23,42,13,19,11]} />
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
                maxWidth:"25rem"
              }}
              >
                <DoughnutChart 
                 labels={["Single Chats","Group Chats"]}
                  value={[23,66]}
                />

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


const Widget = ({title,value,Icon}) =>
 <Paper
  sx={{
    padding:"2rem",
    margin: "2rem 0",
    borderRadius:"1rem",
    width:"20rem"
  }}
 
 >
       <Stack alignItems={"center"} spacing={"1rem"}  >
        <Typography
          sx={{
            color: "rgba(0,0,0,0.7)",
            borderRadius: "50%",
            border : `5px solid rgba(0,0,0,0.9)`,
            width: "5rem",
            height : "5rem",
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
          }}
        
        
        >
            {value}
        
        </Typography>
        <Stack 
         direction={"row"} alignItems={"center"}  spacing={"1rem"}
        >
            {Icon}
            <Typography>{title}</Typography>
        </Stack>
       </Stack>
</Paper>


export default Dashboard