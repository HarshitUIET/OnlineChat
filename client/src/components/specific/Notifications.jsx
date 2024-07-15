import { Dialog, DialogTitle, Skeleton, Stack, Typography } from '@mui/material'
import React from 'react'
import { sampleNotifiactions } from '../layout/constants/sampleData'
import { memo } from 'react'
import { Avatar, Button, ListItem } from '@mui/material'
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../../redux/api/api'
import { useAsyncMutation, useErrors } from '../../hooks/hook'
import { useDispatch, useSelector } from 'react-redux'
import {setIsNotification} from '../../redux/reducers/misc'
import toast from 'react-hot-toast'



const Notifications = () => {

  const {isNotification} = useSelector(state => state.misc);

  const dispatch = useDispatch();

  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  const { isLoading, isError, data, error } = useGetNotificationsQuery();


  const friendRequestHandler = async ({_id,accept}) => {
       dispatch(setIsNotification(false));
       await acceptRequest("Accepting Request",{requestId:_id,accept});
  }

  const closeHandler = () => {
     dispatch(setIsNotification(false));
  }

  useErrors([{ error, isError }]);

  console.log("Notification data is ", data);

  return (
    <Dialog open={isNotification} onClose={closeHandler}>


      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"} >
        <DialogTitle>Notifications</DialogTitle>

        {
          isLoading ? (
            <Skeleton />
          ) : (
            <>
              {
                data?.allRequests.length > 0 ? (
                  data?.allRequests?.map(({ sender, _id }) => (
                    <NotificationItem
                      sender={sender}
                      _id={_id}
                      handler={friendRequestHandler}
                      key={_id}
                    />
                  ))
                )

                  :

                  <Typography textAlign={"center"}>0 Notifications</Typography>
              }
            </>
          )
        }

      </Stack>
    </Dialog>
  )
}

const NotificationItem = memo(({ sender, handler, _id }) => {

  const { name, avatar } = sender;


  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar />
        <Typography
          variant={"body1"}
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >
          {`${name} sent you a friend request`}

        </Typography>

        <Stack direction={{
          xs: "column",
          sm: "row"
        }}>
          <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
          <Button color='error' onClick={() => handler({ _id, accept: false })}>Reject</Button>

        </Stack>

      </Stack>
    </ListItem>
  );
});


export default Notifications