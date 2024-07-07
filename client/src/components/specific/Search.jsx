import { useInputValidation } from '6pp'
import { Dialog, DialogTitle, Input, Stack, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import {Search as SearchIcon} from '@mui/icons-material'
import { InputAdornment } from '@mui/material'
import { List, ListItem, ListItemText } from '@mui/material'
import UserItem from '../share/UserItem'
import { sampleUsers } from '../layout/constants/sampleData'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsSearch } from '../../redux/reducers/misc'
import { useLazySearchUserQuery } from '../../redux/api/api'


const Search = () => {

  const dispatch = useDispatch();

  const [searchUser] = useLazySearchUserQuery();

  const {isSearch} = useSelector(state => state.misc);

  const [users, setUsers] = useState([]);

  let isLoadingSendfriend = false;  

  const search = useInputValidation("");

  const searchCloseHandler = () => {
     dispatch(setIsSearch(false));
  }


  useEffect(()=> {

    const timeOutId = setTimeout(()=>{
      searchUser(search.value)
      .then(({data}) =>setUsers(data.users))
      .catch((e)=>console.log(e));
    },1000)

    return () => {
      clearTimeout(timeOutId);
    }
  },[search.value])

  const AddfriendHandler = (id) => {
    console.log(id);
  }

  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
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