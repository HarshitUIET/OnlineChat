import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notificationCount : 0,
    newMessageAlert : [
      {
        chatId : "",
        count : 0,
      }
    ]
}



const chatSlice = createSlice({
    name : "chat",
    initialState,
    reducers : {
      incrementNotification : (state) => {
        state.notificationCount += 1;
      },
      resetNotification : (state) => {
        state.notificationCount = 0;
      },
      setNewMessagesAlert : (state,action) => {

        const index = state.newMessageAlert.findIndex((item)=> item.chatId === action.payload.chatId);

        if(index !== -1 ) {
          state.newMessageAlert[index].count += 1;
        }
        else {
          state.newMessageAlert.push({
            chatId : action.payload.chatId,
            count : 1
          });
        }

      },
      clearNewMessagesAlert : (state,action) => {

        state.newMessageAlert = state.newMessageAlert.filter((item)=> item.chatId !== action.payload);

      }
    }
})

export default chatSlice;

export const {incrementNotification,resetNotification,setNewMessagesAlert,clearNewMessagesAlert} = chatSlice.actions;