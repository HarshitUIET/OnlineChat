import React, { useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Table from '../../components/share/Table'
import { Avatar, Skeleton } from '@mui/material'
import { useState } from 'react'
import { dashboardData } from '../../components/layout/constants/sampleData'
import { transformImage } from '../../lib/features'
import { useGetUserStatsQuery } from '../../redux/api/api'
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
                <Avatar alt={params.row.name} src={params.row.avatar} />
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
        field : "username",
        headerName : "Username",
        headerClassName : "table-header",
        width : 200,
    },
    {
        field : "friends",
        headerName : "Friends",
        headerClassName : "table-header",
        width : 200,
    },
    {
        field : "groups",
        headerName : "Groups",
        headerClassName : "table-header",
        width : 200,
    }
]

const UserManagement = () => {

    const [rows,setRows] = useState([]);

    const getUserStats = useGetUserStatsQuery("");

    console.log(getUserStats);

    useEffect(()=>{
        if(getUserStats.data) {
            setRows(
                getUserStats?.data?.users.map((i)=>({
                    ...i,
                    id : i._id,
                    avatar : transformImage(i.avatar,50)
                }
                ))
            )
        }
    },[getUserStats.data])

    const eventArr = [
        {error : getUserStats.error},
        {isError : getUserStats.isError},
    ]

    useErrors(eventArr);

  return (
    <AdminLayout>
        {
            getUserStats.isLoading ?

            <Skeleton height={"100vh"} /> :
 
            <Table heading = {"All Users"} columns={columns} rows={rows} />
        
        }
    </AdminLayout>
  )
}

export default UserManagement