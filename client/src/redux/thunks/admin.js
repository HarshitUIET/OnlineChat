import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../components/layout/constants/config";


const admminLogin = createAsyncThunk('admin/login',async (secretKey) => {
    try {
        
        const {data} = await axios.post(`${server}/api/v1/admin/verify`,{secretKey},{
            withCredentials:true,
            headers:{
                'Content-Type':'application/json'
            }
        })
        return data.message;
    } catch (error) {
        console.log(error);
        throw error.response.data.message;
    }
})

const getAdmin = createAsyncThunk('admin/getAdmin',async () => {
    try {
        
        const {data} = await axios.get(`${server}/api/v1/admin`,{
            withCredentials:true,
        })
        return data.admin;
    } catch (error) {
        console.log(error);
        throw error.response.data.message;
    }
})

const adminLogout = createAsyncThunk('admin/logout',async () => {
    try {
        
        const {data} = await axios.get(`${server}/api/v1/admin/logout`,{
            withCredentials:true,
        })
        return data.message;
    } catch (error) {
        console.log(error);
        throw error.response.data.message;
    }
})



export {admminLogin,getAdmin,adminLogout};