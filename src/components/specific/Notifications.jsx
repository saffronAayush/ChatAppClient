import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { memo } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useErrors } from "../../hooks/hook";
import { transformImage } from "../../lib/features";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../../redux/api/api";
import { setIsNotificaion } from "../../redux/reducers/misc";

const Notifications = () => {
  const dispatch = useDispatch();
  const { isLoading, data, error, isError } = useGetNotificationsQuery();

  const { isNotification } = useSelector((state) => state.misc);

  const [acceptRequest] = useAcceptFriendRequestMutation();
  const friendRequestHandler = async ({ _id, accept }) => {
    // console.log(_id, accept);
    dispatch(setIsNotificaion(false));
    try {
      const rest = await acceptRequest({ requestId: _id, accept });

      if (rest.data?.success) {
        toast.success(rest.data?.message);
      } else toast.error(rest.data?.error || "Something went wrong");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const closeHandler = () => dispatch(setIsNotificaion(false));

  useErrors([{ error, isError }]);

  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notification</DialogTitle>
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            {data?.allRequests.length > 0 ? (
              data?.allRequests.map((i) => (
                <NotificationItem
                  sender={i.sender}
                  _id={i._id}
                  handler={friendRequestHandler}
                  key={i._id}
                />
              ))
            ) : (
              <Typography textAlign={"center"}>No New Notification</Typography>
            )}
          </>
        )}
      </Stack>
    </Dialog>
  );
};

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;

  return (
    <>
      <ListItem>
        <Stack
          direction={"row"}
          alignItems={"center"}
          spacing={"0.7rem"}
          sx={{ width: "100%" }}
        >
          <Avatar src={transformImage(avatar)} />
          <Typography
            variant="body1"
            sx={{
              flexGrow: 1,
              display: "-webkit-box",
              width: "100%",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              fontSize: "16px",
              textOverflow: "ellipsis",
            }}
          >
            {`${name} sent you a friend request.`}
          </Typography>
          <Stack
            direction={{
              xs: "column",
            }}
          >
            <Button
              sx={{
                bgcolor: "green",
                color: "wheat",
                fontSize: "10px",
              }}
              onClick={() => handler({ _id, accept: true })}
            >
              Accept
            </Button>
            <Button
              sx={{
                bgcolor: "red",
                color: "wheat",
                fontSize: "10px",
              }}
              onClick={() => handler({ _id, accept: false })}
            >
              Reject
            </Button>
          </Stack>
        </Stack>
      </ListItem>
    </>
  );
});
export default Notifications;
