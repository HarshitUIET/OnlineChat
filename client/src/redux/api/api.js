import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { server } from '../../components/layout/constants/config';


const api = createApi({

    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/v1/`
    }),

    tagTypes: ['Chat', 'User','Message'],

    endpoints: (builder) => ({
        myChats: builder.query({
            query: () => ({
                url: 'chat/my',
                credentials: "include",
            }),
            providesTags: ['Chat']
        }),
        searchUser: builder.query({
            query: (name) => ({
                url: `user/search?name=${name}`,
                credentials: "include"
            }),
            providesTags: ['User']
        }),
        sendFriendRequest: builder.mutation({
            query: (data) => ({
                url: `user/sendrequest`,
                credentials: "include",
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['User']
        }),
        getNotifications: builder.query({
            query: () => ({
                url: 'user/notifications',
                credentials: "include"
            }),
            keepUnusedDataFor: 0
        }),
        acceptFriendRequest : builder.mutation({
            query: (data) => ({
                url: 'user/acceptrequest',
                credentials: "include",
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Chat']
        }),
        chatDetails : builder.query({
            query : ({chatId,populate=false}) => {
                  
                let url = `chat/${chatId}`;

                if(populate) url+= '?populate=true';
                
                return {
                    url,
                    credentials: "include"
                }
             },
             providesTags : ['Chat']
        }),
        getMessages : builder.query({
            query : ({chatId,page}) =>({
                url : `chat/messages/${chatId}?page=${page}`,
                credentials:"include"
            }),
             keepUnusedDataFor : 0
        }),
        sendAttachments : builder.mutation({
            query: (data) => ({
                url: 'chat/message',
                credentials: "include",
                method: 'POST',
                body: data
            }),

        }),
        myGroups : builder.query({
            query : () => ({
                url : 'chat/my/groups',
                credentials: "include"
             }),
             providesTags : ['Chat']
        }),
        availableFriends : builder.query({
            query : (chatId) => {
                  
                let url = `user/friends`;

                if(chatId) url+= `?chatId=${chatId}`;
                
                return {
                    url,
                    credentials: "include"
                }
             },
             providesTags : ['Chat']
        }),
        newGroup : builder.mutation({
            query : ({name,members}) => ({
                url : 'chat/new',
                method:"POST",
                credentials:"include",
                body : {name,members}
            }),
            invalidatesTags : ['Chat']
        }),
        renameGroup : builder.mutation({
            query : ({chatId,name}) => ({
                url : `chat/${chatId}`,
                method:"PUT",
                credentials:"include",
                body : {name}
            }),
            invalidatesTags : ['Chat']
        }),
        removeGroupMembers : builder.mutation({
            query : ({chatId,userId}) => ({
                url : `chat/removemembers`,
                method:"PUT",
                credentials:"include",
                body : {chatId,userId}
            }),
            invalidatesTags : ['Chat']
        }),
        addGroupMembers : builder.mutation({
            query : ({chatId,members}) => ({
                url : `chat/addmembers`,
                method:"PUT",
                credentials:"include",
                body : {chatId,members}
            }),
            invalidatesTags : ['Chat']
        })
    })

})



export default api;

export const { useMyChatsQuery, useLazySearchUserQuery, useSendFriendRequestMutation,useGetNotificationsQuery,useAcceptFriendRequestMutation,useChatDetailsQuery,useGetMessagesQuery,useSendAttachmentsMutation,useMyGroupsQuery,useAvailableFriendsQuery,useNewGroupMutation,useRenameGroupMutation,useRemoveGroupMembersMutation,useAddGroupMembersMutation } = api;