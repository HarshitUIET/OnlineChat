import { Dialog , DialogTitle, Typography} from '@mui/material'
import React, { useState } from 'react'
import { Stack } from '@mui/material'
import UserItem from '../share/UserItem'
import { sampleUsers } from '../layout/constants/sampleData'
import { TextField } from '@mui/material'
import { Button } from '@mui/material'
import { useInputValidation } from '6pp'

const NewGroup = () => {

  const [members,setMembers] = useState([]);
  const [selectedMembers,setSelectedMembers] = useState([]);

  const groupName = useInputValidation("");

  const selectMemberHandler = (id) => {


    
      setSelectedMembers((prev)=> 
    prev.includes(id) ? prev.filter((i)=> i !== id) : [...prev,id]
  )
  }


  const submitHandler = () => {
    console.log("Create Group");
  }

  const closeHandler = () => {
    console.log("Close");
  }


  return (
    <Dialog open onClose={closeHandler}>
      <Stack p={{xs:"1rem" , sm:"3rem"}} maxwidth={"25rem"} spacing={"2rem"} >

        <DialogTitle textAlign={"center"} variant='h4'>New Group</DialogTitle>

        <TextField label= "Group Name" value={groupName.value} onChange={groupName.changeHandler}/>

        <Typography>Members</Typography>

       <Stack>
        {
          sampleUsers.map((i)=>{
            return  <UserItem user={i} key = {i._id} handler ={selectMemberHandler} isAdded={selectedMembers.includes(i._id)} />
          })
        }
       </Stack>

       <Stack direction={"row"} justifyContent={'space-evenly'}  spacing={"1rem"} >
        <Button color="error" variant="contained" size='large'>Cancel</Button>
        <Button variant="contained" size='large' onClick={submitHandler}>Create</Button>
       </Stack>

       </Stack>
    </Dialog>
  )
}

export default NewGroup