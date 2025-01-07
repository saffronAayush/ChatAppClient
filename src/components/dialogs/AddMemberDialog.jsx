import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAddGroupMemberMutation,
  useAvailableFriendsQuery,
} from "../../redux/api/api";
import { setIsAddMember } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

const AddMemberDialog = ({ chatId }) => {
  const dispatch = useDispatch();
  const { isAddMember } = useSelector((st) => st.misc);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const { isLoading, data, isError, error } = useAvailableFriendsQuery(chatId);
  const [addMembers, isLoadingAddMembers] = useAsyncMutation(
    useAddGroupMemberMutation
  );

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((curr) => curr !== id) : [...prev, id]
    );
  };

  const addMemberSubmitHanlder = () => {
    addMembers("Adding Memebers...", { chatId, members: selectedMembers });
    closeHandler();
  };
  const closeHandler = () => {
    dispatch(setIsAddMember(false));
  };

  useErrors([{ isError, error }]);
  return (
    <Dialog open={isAddMember} onClose={closeHandler}>
      <Stack p={"1rem"} width={"20rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
        <Stack spacing={"1rem"}>
          {isLoading ? (
            <Skeleton />
          ) : data?.friends?.length > 0 ? (
            data?.friends?.map((i) => {
              return (
                <>
                  {" "}
                  <UserItem
                    key={i._id}
                    user={i}
                    handler={selectMemberHandler}
                    isAdded={selectedMembers.includes(i._id)}
                  />
                </>
              );
            })
          ) : (
            <Typography textAlign={"center"}>No Friends</Typography>
          )}
        </Stack>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
        >
          <Button onClick={closeHandler} variant="outlined" color="error">
            Cancel
          </Button>
          <Button
            onClick={addMemberSubmitHanlder}
            variant="contained"
            disabled={isLoadingAddMembers}
          >
            Submit Change
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddMemberDialog;
