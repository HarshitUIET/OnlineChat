import { Dialog, DialogTitle, Stack } from '@mui/material'
import React from 'react'
import { sampleUsers } from '../layout/constants/sampleData'
import UserItem from '../share/UserItem'
import { useState } from 'react'
import { Button, Typography } from '@mui/material'


const AddMemberDialog = ({addMember,isLoadingAddMember,chatId}) => {

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
        setSelectedMembers([]);
        setMembers([]);
     }

        const addMemberSubmitHandler = () => {  
           closeHandler();
        }

  return (
    <Dialog open onClose={closeHandler}>
        <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
           <DialogTitle textAlign={"center"} >Add Member</DialogTitle> 
           <Stack spacing={"1rem"}>
            {
                members.length>0 ? (
                    members.map((member)=>{
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
            <Button variant="contained" onClick={addMemberSubmitHandler} disabled={isLoadingAddMember} >Add</Button>
           </Stack>
        </Stack>
    </Dialog>
  )
}





export default AddMemberDialog