import React, { useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Table from '../../components/share/Table'
import { Avatar } from '@mui/material'
import { useState } from 'react'
import { dashboardData } from '../../components/layout/constants/sampleData'
import { transformImage } from '../../lib/features'

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

    useEffect(()=>{
        setRows(
            dashboardData.users.map((i)=>({
                ...i,
                id : i._id,
                avatar : transformImage(i.avatar,50)
            }
            ))
        )
    },[])

  return (
    <AdminLayout>
        <Table heading = {"All Users"} columns={columns} rows={rows} />
    </AdminLayout>
  )
}

export default UserManagement