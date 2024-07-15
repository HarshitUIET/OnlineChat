import { createSlice } from "@reduxjs/toolkit";
import { adminLogout, admminLogin, getAdmin } from "../thunks/admin";
import toast from "react-hot-toast";

const initialState = {
    user: null,
    isAdmin : false,
    loader: true,
};


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        userExists: (state, action) => {
            state.user = action.payload;
            state.loader = false;
        },
        userNotExists : (state) => {
            state.user = null;
            state.loader = false;
        }
    },
    extraReducers : (builder) => {
        builder
        .addCase(admminLogin.fulfilled, (state, action) => {
            state.isAdmin = true;
            toast.success(action.payload);
        })
       .addCase(admminLogin.rejected, (state, action) => {
            state.isAdmin = false;
            toast.error(action.error.message);
        })
        .addCase(getAdmin.fulfilled, (state, action) => {
            if(action.payload) {
                state.isAdmin = true;
            } else {
                state.isAdmin = false;
            }
         })
         .addCase(getAdmin.rejected, (state, action) => {
            state.isAdmin = false;
         })
         .addCase(adminLogout.fulfilled, (state, action) => {
            state.isAdmin = false;
            toast.success(action.payload);
         })

    }
})

export const { userExists, userNotExists } = authSlice.actions;

export default authSlice;