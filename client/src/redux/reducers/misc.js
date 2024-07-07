import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isNewGroup : false,
    isSearch : false,
    isNotification : false,
    isAddMember : false,
    isFileMenu : false,
    isDeleteMenu : false,
    uploadingLoader : false,
    isMobile : false,
    selectedDeleteChat : {
        chatId : '',
        groupChat : false,
    }
}

const miscSlice = createSlice({
    name : 'misc',
    initialState,
    reducers : {
        setIsNewGroup : (state,action) => {
            state.isNewGroup = action.payload;
        },
        setIsSearch : (state,action) => {
            state.isSearch = action.payload;
        },
        setIsNotification : (state,action) => {
            state.isNotification = action.payload;
        },
        setIsAddMember : (state,action) => {
            state.isAddMember = action.payload;
        },
        setIsFileMenu : (state,action) => {
            state.isFileMenu = action.payload;
        },
        setIsDeleteMenu : (state,action) => {
            state.isDeleteMenu = action.payload;
        },
        setUploadingLoader : (state,action) => {
            state.uploadingLoader = action.payload;
        },  
        setIsMobile : (state,action) => {
            state.isMobile = action.payload;
        },
        setSelectedDeleteChat : (state,action) => {
            state.selectedDeleteChat = action.payload;
        }
    }
})

export default miscSlice;

export const { setIsNewGroup, setIsSearch, setIsNotification, setIsAddMember, setIsFileMenu, setIsDeleteMenu, setUploadingLoader, setIsMobile, setSelectedDeleteChat } = miscSlice.actions;