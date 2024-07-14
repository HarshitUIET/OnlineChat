import { Dialog , DialogTitle, Skeleton, Typography} from '@mui/material'
import React, { useState } from 'react'
import { Stack } from '@mui/material'
import UserItem from '../share/UserItem'
import { TextField } from '@mui/material'
import { Button } from '@mui/material'
import { useInputValidation } from '6pp'
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../redux/api/api'
import { useAsyncMutation, useErrors } from '../../hooks/hook'
import { useDispatch, useSelector } from 'react-redux'
import { setIsNewGroup } from '../../redux/reducers/misc'
import toast from 'react-hot-toast'

const NewGroup = () => {

  const dispatch = useDispatch();

  const {isNewGroup} = useSelector((state)=> state.misc);

   const {isLoading,error,isError,data} = useAvailableFriendsQuery();

  const [members,setMembers] = useState([]);
  const [selectedMembers,setSelectedMembers] = useState([]);

  const groupName = useInputValidation("");

  const selectMemberHandler = (id) => {
      setSelectedMembers((prev)=> 
    prev.includes(id) ? prev.filter((i)=> i !== id) : [...prev,id]
  )
  }

  const errors = [{
    isError,
    error
  }]

  useErrors(errors);

  const [newGroup,isNewGroupLoading] = useAsyncMutation(useNewGroupMutation);

  const submitHandler = () => {
     if(!groupName.value) return toast.error("Group Name is required");

     if(selectedMembers.length <2 ) return toast.error("Group should have atleast 3 members");

      newGroup("Creating Group ...",{name:groupName.value,members:selectedMembers})


     closeHandler();

  }

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  }


  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack p={{xs:"1rem" , sm:"3rem"}} maxwidth={"25rem"} spacing={"2rem"} >

        <DialogTitle textAlign={"center"} variant='h4'>New Group</DialogTitle>

        <TextField label= "Group Name" value={groupName.value} onChange={groupName.changeHandler}/>

        <Typography>Members</Typography>

       <Stack>
        {
          isLoading ? <Skeleton/> :
           data?.friends?.map((i)=>{
            return  <UserItem user={i} key = {i._id} handler ={selectMemberHandler} isAdded={selectedMembers.includes(i._id)} />
          })
        }
       </Stack>

       <Stack direction={"row"} justifyContent={'space-evenly'}  spacing={"1rem"} >
        <Button color="error" variant="contained" size='large' onClick={closeHandler}>Cancel</Button>
        <Button variant="contained" size='large' onClick={submitHandler}disabled={isNewGroupLoading}>Create</Button>
       </Stack>

       </Stack>
    </Dialog>
  )
}

export default NewGroup