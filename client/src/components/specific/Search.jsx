import { useInputValidation } from '6pp'
import { Search as SearchIcon } from '@mui/icons-material'
import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../../redux/api/api'
import { setIsSearch } from '../../redux/reducers/misc'
import UserItem from '../share/UserItem'
import toast from 'react-hot-toast'
import { useAsyncMutation } from '../../hooks/hook'


const Search = () => {

  const dispatch = useDispatch();

  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest,isLoadingSendfriend] = useAsyncMutation(useSendFriendRequestMutation);

  const {isSearch} = useSelector(state => state.misc);

  const [users, setUsers] = useState([]);

  

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

  const AddfriendHandler = async (id) => {
     await sendFriendRequest("Sending Friend Request...",{userId:id})
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