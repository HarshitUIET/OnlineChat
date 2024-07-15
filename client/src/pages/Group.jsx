import React, { Suspense, lazy, memo, useEffect } from 'react'
import { Backdrop, Box, Button, Drawer, Grid , IconButton, Skeleton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { matBlack } from '../components/layout/constants/color'
import { useNavigate } from 'react-router-dom'
import { Add as AddIcon,Delete as DeleteIcon, KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon, Edit as EditIcon, Done as DoneIcon } from '@mui/icons-material'
import { useState } from 'react'
import {Link} from '../components/style/stylecomponent'
import AvatarCard from '../components/share/AvatarCard'
import {sampleUsers, samplechats} from '../components/layout/constants/sampleData'
import { useSearchParams } from 'react-router-dom'
import UserItem from '../components/share/UserItem'
import { useAddGroupMembersMutation, useAvailableFriendsQuery, useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMembersMutation, useRenameGroupMutation } from '../redux/api/api'
import { useAsyncMutation, useErrors } from '../hooks/hook'
import { LayoutLoader } from '../components/layout/Loaders'
import { useDispatch, useSelector } from 'react-redux'
import { setIsAddMember } from '../redux/reducers/misc'



const ConfirmDeleteDialog = lazy(()=>import('../components/Dialog/ConfirmDeleteDialog') )

const AddMemberDialog = lazy(()=>import('../components/Dialog/AddMemberDialog') )


const Group = () => {

  const {isAddMember} = useSelector((state)=>state.misc);

  const dispatch = useDispatch();

  const navigate  = useNavigate();

  const chatId = useSearchParams()[0].get('group');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [members,setMembers] = useState([]);

  const [isEdit,setIsEdit] = useState(false);

  const myGroups = useMyGroupsQuery();

  console.log(myGroups.data);

  const [groupName,setGroupName] = useState('');
  const [groupNameUpdatedValue,setGroupNameUpdatedValue] =
  useState('');

  const [confirmDeleteDialog,setConfirmDeleteDialog] = useState(false);

   const groupDetails = useChatDetailsQuery({chatId,populate:true},{skip : !chatId});

   const [updateGroup,isLoadingGroupName] = useAsyncMutation(useRenameGroupMutation);

   const [removeMember,isLoadingRemoveGroupMember] = useAsyncMutation(useRemoveGroupMembersMutation);

   const [deleteGroup,isLoadingDeleteGroup] = useAsyncMutation(useDeleteChatMutation);

   useEffect(()=>{
    
    const group = groupDetails.data;

    if(group) {
      setGroupName(group.chat.name);
      setGroupNameUpdatedValue(group.chat.name);
      setMembers(group.chat.members);
    }

    return ()=> {
      setGroupName('');
      setGroupNameUpdatedValue('');
      setMembers([]);
      setIsEdit(false);
    }

   },[groupDetails.data])



  const errors = [{
    isError:myGroups.isError,
    error:myGroups.error
  }]

  useErrors(errors);

  const handleMobile = () => {
    setIsMobileMenuOpen((prev)=>!prev);
  }

  const handleMobileClose = () => {
    setIsMobileMenuOpen(false);
  }

  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("Updating Group Name",{chatId,name:groupNameUpdatedValue});
  }

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
    console.log("Delete Group");
  }

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  }

  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true));
  }

  const deleteHandler = () => {
    deleteGroup("Deleting Group...",chatId)
    closeConfirmDeleteHandler();
    navigate("/group");
  }

  const removeMemberHandler = (id) => {
    removeMember("Removing Member.....",{chatId,userId:id})
  }


   const IconBtn = <>

     <Box
      sx={{
        display:{
          xs:"block",
          sm:"none"
        },
        position:"fixed",
        right:"1rem",
        top:"1rem",
        }
      }
     >
      <IconButton onClick={handleMobile}>
        <MenuIcon/>
      </IconButton>
     </Box>
     <Tooltip title="back" >
      <IconButton
       sx={{
          position:"absolute",
          top: "2rem",
          left: "2rem",
          bgcolor:matBlack,
          ":hover" : {
            bgcolor:"rgba(0,0,0,0.7)",
          },
          color:"white",
       }}
       onClick={()=>navigate('/')}
      >
       <KeyboardBackspaceIcon/>
      </IconButton>
     </Tooltip>
   </>

   const GroupName = (
   <Stack
    direction={"row"}
    alignItems={"center"}
    justifyContent={"center"}
    spacing={"1rem"}
    padding={"3rem"}
   >
    {
       
      isEdit ? (
     <>
           <TextField value={groupNameUpdatedValue}
            onChange={(e)=>setGroupNameUpdatedValue(e.target.value)}
           />
           <IconButton onClick={updateGroupName} disabled={isLoadingGroupName} >
            <DoneIcon/>
           </IconButton>
      </>
      ) :
    ( 
    <>
       <Typography variant="h4">{groupName}</Typography> <IconButton onClick={()=>setIsEdit(true)} disabled={isLoadingGroupName} >
        <EditIcon/>
        </IconButton>
      </>
      )}
   </Stack>
   )

   const ButtonGroup = (
   <Stack 
   direction={{
    sm:"row",
    xs:"column-reverse"
   }}
   spacing={"1rem"}
   p={{
    sm:"1rem",
    xs:"0",
    md:"1rem 4rem"
   }}
   >
     <Button size='large'  color="error" startIcon={<DeleteIcon/>} onClick={openConfirmDeleteHandler} >Delete Group</Button>
     <Button variant="contained" color="primary" startIcon={<AddIcon/>} onClick={openAddMemberHandler} >Add Member</Button>
   </Stack>
   )

  return myGroups.isLoading ? <LayoutLoader/> :  (
  <Grid container height={'100vh'} >
   <Grid 
   item 
   sx={{
    display:{
      xs:"none",
      sm:"block"
    },
   }}
   sm={4} 
   bgcolor = {"bisque"}
   >
   <GroupList myGroups={myGroups?.data?.groups} chatId={chatId} />
   </Grid>

   <Grid 
   item 
   xs={12}
    sm={8}
    sx={{
      display:"flex",
      flexDirection:"column",
      alignItems:"center",
      padding : "1rem 3rem",
      position: "relative"
    }}
    >
    {
      IconBtn
    }

    {
      groupName && (
        <>
          {GroupName}

          <Typography 
          margin={"2rem"}
          alignSelf={"flex-start"}
          variant='body1'
          >
            Members
          </Typography>

          <Stack
          maxWidth={"45rem"}
          width={"100%"}
          box-sizing={"border-box"}
          padding={{
            sm:"1rem",
            xs:"0",
            md:"1rem 4rem"
          }}
          spacing={"2rem"}
          height={"50vh"}
          overflow={"auto"}
          >
           {
            isLoadingRemoveGroupMember ? <Skeleton/> :
            members.map((i)=>{
            return <UserItem key={i._id} user={i} 
              isAdded 
              styling={{
                boxShadow:"0 0 0.5rem rgba(0,0,0,0.2)",
                padding:"1rem 2rem",
                borderRadius:"0.5rem",
              }}
              handler={removeMemberHandler}
             />
            })
           }
          </Stack>

          {ButtonGroup}

        </>
      )
    }

    </Grid>

    {
      isAddMember && (
        <Suspense fallback={<Backdrop open/>} >
          <AddMemberDialog chatId={chatId} />
        </Suspense>
      )
    }

    {
      confirmDeleteDialog && 
      <Suspense fallback={<Backdrop open/>} >
        <ConfirmDeleteDialog open={confirmDeleteDialog} handleClose={closeConfirmDeleteHandler} deleteHandler={deleteHandler} />
      </Suspense>
    }

    <Drawer 
     sx={{
      display:{
        xs:"block",
        sm:"none"
      },  
     }}
    open={isMobileMenuOpen} onClose={handleMobileClose}>
       <GroupList chatId={chatId} w={'50vw'} myGroups={myGroups?.data?.groups} />
    </Drawer>

  </Grid>
  )
}

const GroupList = ({w='100%',myGroups=[],chatId}) => (
  <Stack 
   sx={{
      bgcolor:"bisque",
      height:"100vh",
      overflow:"auto",
   }}
  width={w}>
    {
      myGroups.length>0 ? (
        myGroups.map((group)=>{
          return <GroupListItem key={group._id} group={group} chatId={chatId} />
        })
      ) : (
        <Typography textAlign={"center"} padding="1rem" >
          No groups
        </Typography>
      )
    }


  </Stack>
)


const GroupListItem = memo(({group,chatId}) => {
   const {avatar,name,_id} = group;
   return (
    <Link to={`?group=${_id}`}
     onClick={(e)=> {
      if(chatId === _id){
        e.preventDefault();
     }}
    }
    >
      <Stack direction="row" alignItems="center" spacing={"1rem"} >
        <AvatarCard avatar={avatar} />
        <Typography>{name}</Typography>
      </Stack>
    </Link>

   )})


export default Group;