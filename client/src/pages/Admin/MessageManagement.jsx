import React from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { useState,useEffect } from 'react'
import { dashboardData } from '../../components/layout/constants/sampleData'
import { fileformat, transformImage } from '../../lib/features'
import moment from 'moment'
import Table from '../../components/share/Table'
import { Avatar, Skeleton, Stack } from '@mui/material'
import RenderComponent from '../../components/share/RenderComponent'
import { Box } from '@mui/system'
import { useGetMessagesQuery, useGetMessagesStatsQuery } from '../../redux/api/api'
import { useErrors } from '../../hooks/hook'

const columns = [
    {
        field : "id",
        headerName : "ID",
        headerClassName : "table-header",
        width : 200,
    },
    {
        field : "attachments",
        headerName : "Attachments",
        headerClassName : "table-header",
        width : 200,
        renderCell : (params) => {
            
            
            const {attachments} = params.row;   
           
            return attachments?.length > 0 ? 
            attachments.map((i)=>{
                const url = i.url;
                
                const file = fileformat(url);
                
                return <Box key={i.public_id}>
                <a href={url} target='_blank' download style={{
                    color:"black",
                  }}>
                   {RenderComponent(url,file)}
                </a>
                </Box>
            }
            ) : "No Attachments";
        }
    },
    {
        field : "content",
        headerName : "Content",
        headerClassName : "table-header",
        width : 400,
    },
    {
        field : "sender",
        headerName : "Sent By",
        headerClassName : "table-header",
        width : 200,
        renderCell : (params) => {
        return  <Stack direction={"row"} spacing={"1rem"} alignItems={"center"} >
         <Avatar alt={params.row.sender.name} src={params.row.sender.avatar} />
         <span> {params.row.sender.name}</span>
         </Stack>
        }
},
    {
        field : "chat",
        headerName : "Chat",
        headerClassName : "table-header",
        width : 220,
    },
    {
        field : "groupChat",
        headerName : "Group Chat",
        headerClassName : "table-header",
        width : 100,
    }
    ,{
        field : "createdAt",
        headerName : "Time",
        headerClassName : "table-header",
        width : 250,
    }
]


const MessageManagement = () => {

    const [rows,setRows] = useState([]);

    const getMessages = useGetMessagesStatsQuery();

    console.log("Get Messages data is ",getMessages.data);

    const eventArr = [
        {error : getMessages.error},
        {isError : getMessages.isError}
    ]

    useErrors(eventArr);

    useEffect(()=>{
        if(getMessages.data) {
            setRows(
                getMessages?.data?.messages.map((i)=>({
                    ...i,
                    id : i._id,
                    sender : {
                        name : i.sender.name,
                        avatar : transformImage(i.sender.avatar,50)
                    },
                    createdAt : moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a")
                }
                ))
            )
        }
    }
    ,[getMessages.data])

  return (
    <AdminLayout>
        {
            getMessages.isLoading ? <Skeleton height={"100vh"} /> :

            <Table 
            heading={"All Messages"} columns={columns} rows={rows} rowHeight={200}   />
        
        }
      
    </AdminLayout>
  )
}

export default MessageManagement