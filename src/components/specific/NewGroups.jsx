import { useInputValidation } from "6pp";
import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SampleUsers } from "../../constants/SampleData";
import UserItem from "../shared/UserItem";
import {
  useAvailableFriendsQuery,
  useNewGroupMutation,
} from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { setIsNewGroup } from "../../redux/reducers/misc";
import toast from "react-hot-toast";

const NewGroups = () => {
  const dispatch = useDispatch();
  const { isNewGroup } = useSelector((state) => state.misc);

  const { isError, isLoading, error, data } = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);
  const errors = [
    {
      isError,
      error,
    },
  ];
  useErrors(errors);
  const [members, setmembers] = useState(SampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const groupName = useInputValidation("");
  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((curr) => curr !== id) : [...prev, id]
    );
  };

  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name required");
    if (selectedMembers.length < 2)
      return toast.error("Bhai DM hi kar le Group kya bana raha hai");

    // Creating group ;
    newGroup("Creating New Group", {
      name: groupName.value,
      members: selectedMembers,
    });

    closeHandler();
  };

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };
  return (
    <Dialog onClose={closeHandler} open={isNewGroup}>
      <Stack p={{ xs: "1rem", sm: "3rem" }} width={"25rem"} spacing={1}>
        <DialogTitle textAlign={"center"} variant="contained">
          New Group
        </DialogTitle>
        <TextField
          label="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
        />
        <Typography variant="body2">Members</Typography>

        <Stack>
          {isLoading ? (
            <Skeleton />
          ) : (
            data?.friends?.map((i) => {
              return (
                <UserItem
                  key={i._id}
                  user={i}
                  handler={selectMemberHandler}
                  isAdded={selectedMembers.includes(i._id)}
                />
              );
            })
          )}
        </Stack>
        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button variant="outlined" color="error" onClick={closeHandler}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={submitHandler}
            disabled={isLoadingNewGroup}
          >
            Create Group
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroups;
