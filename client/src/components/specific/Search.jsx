import { useInputValidation } from '6pp'
import { Dialog, DialogTitle, Input, Stack, TextField } from '@mui/material'
import React from 'react'
import {Search as SearchIcon} from '@mui/icons-material'
import { InputAdornment } from '@mui/material'
import { List, ListItem, ListItemText } from '@mui/material'
import UserItem from '../share/UserItem'
import { sampleUsers } from '../layout/constants/sampleData'
import { useState } from 'react'


const Search = () => {


  const [users, setUsers] = useState(sampleUsers);

  let isLoadingSendfriend = false;  

  const search = useInputValidation("");


  const AddfriendHandler = (id) => {
    console.log(id);
  }

  return (
    <Dialog open>
       <Stack p={"2rem"} direction={"column"} width={"25rem"} >
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField 
        label=""
        variant="outlined"
        value = {search.value}
        onChange = {search.changeHandler}
        size='small'
        InputProps={{
          startAdornment:(
            <InputAdornment position="start">
              <SearchIcon/>
            </InputAdornment>
          )
        }}
        />

       <List>
         {
          users.map((user)=>(
             <UserItem key={user._id} user={user} handler={AddfriendHandler} handlerIsLoading={isLoadingSendfriend} />
          )) 
         }
       </List>

       </Stack>
    </Dialog>
  )
}

export default Search