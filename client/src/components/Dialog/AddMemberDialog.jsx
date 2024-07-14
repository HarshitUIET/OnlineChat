import { Dialog, DialogTitle, Skeleton, Stack } from '@mui/material'
import React from 'react'
import { sampleUsers } from '../layout/constants/sampleData'
import UserItem from '../share/UserItem'
import { useState } from 'react'
import { Button, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setIsAddMember } from '../../redux/reducers/misc'
import { useAsyncMutation, useErrors } from '../../hooks/hook'
import { useAddGroupMembersMutation, useAvailableFriendsQuery } from '../../redux/api/api'


const AddMemberDialog = ({chatId}) => {

   const dispatch = useDispatch();

   const {isAddMember} = useSelector((state)=>state.misc);

   const [addMember,isLoadingAddGroupMember] = useAsyncMutation(useAddGroupMembersMutation);

   const {isLoading,error,isError,data} = useAvailableFriendsQuery(chatId);

   console.log(data?.friends);

   const [members,setMembers] = useState(sampleUsers);
   const [selectedMembers,setSelectedMembers] = useState([]);

   const selectMemberHandler = (id) => { 
     setSelectedMembers((prev)=>{
         if(prev.includes(id)){
            return prev.filter((item)=>item!==id);
         }
         return [...prev,id];
      });
   }

     const closeHandler = () => {
        dispatch(setIsAddMember(false));
     }

        const addMemberSubmitHandler = () => {  
           console.log("Selected Members are ",selectedMembers);
           addMember("Adding Members....",{chatId,members:selectedMembers});
           closeHandler();
        }

        const eventsarr = [
            {
               isError,error
            }
        ]

        useErrors(eventsarr);

  return (
    <Dialog open={isAddMember} onClose={closeHandler}>
        <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
           <DialogTitle textAlign={"center"} >Add Member</DialogTitle> 
           <Stack spacing={"1rem"}>
            {
               isLoading ? <Skeleton/> : data?.friends?.length>0 ? (
                  data?.friends?.map((member)=>{
                        return <UserItem key={member._id} user={member} handler={selectMemberHandler}
                         isAdded={selectedMembers.includes(member._id)}
                        />
                    })
                ) : (
                    <Typography textAlign={"center"} >No Friends</Typography>
                ) 
            }
           </Stack>
           <Stack 
           direction={"row"}
           justifyContent={"space-evenly"}
           alignItems={"center"}
           >
            <Button color="error" onClick={closeHandler} >Cancel</Button>
            <Button variant="contained" onClick={addMemberSubmitHandler} disabled={isLoadingAddGroupMember} >Add</Button>
           </Stack>
        </Stack>
    </Dialog>
  )
}





export default AddMemberDialog