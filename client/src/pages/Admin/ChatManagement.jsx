import React, { useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Table from '../../components/share/Table'
import { Avatar, Skeleton, Stack } from '@mui/material'
import { useState } from 'react'
import { dashboardData } from '../../components/layout/constants/sampleData'
import { transformImage } from '../../lib/features'
import AvatarCard from '../../components/share/AvatarCard'
import { useDispatch } from 'react-redux'
import { useGetChatStatsQuery } from '../../redux/api/api'
import { useErrors } from '../../hooks/hook'

const columns = [
    {
        field : "id",
        headerName : "ID",
        headerClassName : "table-header",
        width : 200,
    },
    {
        field : "avatar",
        headerName : "Avatar",
        headerClassName : "table-header",
        width : 150,
        renderCell : (params) => {
            return (
                <AvatarCard avatar={params.row.avatar} />
            )
        }
    },
    {
        field : "name",
        headerName : "Name",
        headerClassName : "table-header",
        width : 200,
    },
    {
        field : "groupChat",
        headerName : "Group Chat",
        headerClassName : "table-header",
        width : 200,
    },
    {
        field : "totalMembers",
        headerName : "Total Members",
        headerClassName : "table-header",
        width :120,
    },
    {
        field : "members",
        headerName : "Members",
        headerClassName : "table-header",
        width : 400,
        renderCell: (params) => <AvatarCard max={100} 
         avatar={params.row.members}
        />

    },
    {
        field : "totalMessages",
        headerName : "Total Messages",
        headerClassName : "table-header",
        width : 120,
    },
    {
        field : "creator",
        headerName : "created By",
        headerClassName : "table-header",
        width : 250,
        renderCell: (params) => (
            <Stack direction="row" alignItems={"center"} spacing={1}>
                <Avatar alt={params.row.creator.name} src={params.row.creator.avatar} />
                <span>{params.row.creator.name}</span>
            </Stack>
        )
    
    }
]

const ChatManagement = () => {


    const dipatch = useDispatch();

    const getChats = useGetChatStatsQuery("");

    console.log(getChats.data);


    const eventArr = [
        {isError : getChats.isError},
        {error : getChats.error}
    ]

    useErrors(eventArr);

    const [rows,setRows] = useState([]);

    useEffect(()=>{
        if(getChats.data) {
            setRows(
                getChats?.data?.chats.map((i)=>({
                    ...i,
                    id : i._id,
                    avatar : i.avatar.map((i)=>transformImage(i,50)),
                    members : i.members.map((i)=>transformImage(i.avatar,50)),
                    creator : {
                        name : i.creator.name,
                        avatar : transformImage(i.creator.avatar,50)
                    }
                }
                ))
            )
        }
    }
    ,[getChats.data])

  return (
    <AdminLayout>
        {
            getChats.isLoading ? <Skeleton height={"100vh"} /> :
            <Table heading = {"All Chats"} columns={columns} rows={rows} />
        }
        
    </AdminLayout>
  )
}


export default ChatManagement