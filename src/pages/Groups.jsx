import {
  Add as AddIcon,
  ArrowBack,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  Menu,
} from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { lazy, memo, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LayoutLoader } from "../components/layout/Loaders";
import AvatarCard from "../components/shared/AvatarCard";
import UserItem from "../components/shared/UserItem";
import { Link } from "../components/styles/StyledComponents";
import { useAsyncMutation, useErrors } from "../hooks/hook";
import {
  useChatDetailsQuery,
  useDeleteChatMutation,
  useMyGroupsQuery,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
} from "../redux/api/api";
import { setIsAddMember } from "../redux/reducers/misc";

const ConfirmDeleteDialog = lazy(() =>
  import("../components/dialogs/ConfirmDeleteDialog")
);
const AddMemberDialog = lazy(() =>
  import("../components/dialogs/AddMemberDialog")
);

const Groups = () => {
  const dispatch = useDispatch();
  const { isAddMember } = useSelector((state) => state.misc);
  const chatId = useSearchParams()[0].get("group");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameUdatedValue, setGroupNameUdatedValue] = useState("");
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const navigate = useNavigate();

  const [updateGroup, isLoadingGroupName] = useAsyncMutation(
    useRenameGroupMutation
  );

  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(
    useRemoveGroupMemberMutation
  );

  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(
    useDeleteChatMutation
  );

  const myGroups = useMyGroupsQuery();

  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );

  const [members, setMembers] = useState([]);
  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    },
  ];
  useErrors(errors);

  const navigateBack = () => {
    navigate("/");
  };

  const handleMobile = () => {
    setIsMobileMenuOpen((pre) => !pre);
  };
  const handleMobileClose = () => {
    setIsMobileMenuOpen(false);
  };

  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("Updating Group name...", {
      chatId,
      name: groupNameUdatedValue,
    });
  };
  const openconfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);

    // console.log("confirm delete hadler");
  };
  const closeconfiremDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };
  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true));
    // console.log("open add member handler");
  };

  const deleteHandler = () => {
    // console.log("in delete goup ");
    navigate("/groups");
    deleteGroup("Deleting Group...", chatId);
    closeconfiremDeleteHandler();
  };

  const removeMemberHandler = (userId) => {
    removeMember("Removing Members...", { chatId, userId });
  };
  // useEffect(() => {
  //   if (chatId) {
  //     setGroupName(`GroupName ${chatId}`);
  //     setGroupNameUdatedValue(`GroupName ${chatId}`);
  //   }
  //   return () => {
  //     setGroupName("");
  //     setGroupNameUdatedValue("");
  //     setIsEdit(false);
  //   };
  // }, [chatId]);
  useEffect(() => {
    if (groupDetails.data) {
      setGroupName(groupDetails.data.chat.name);
      setGroupNameUdatedValue(groupDetails.data.chat.name);
      setMembers(groupDetails?.data?.chat?.members);
    }
    return () => {
      setGroupName("");
      setGroupNameUdatedValue("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data, chatId]);

  const IcondBtns = (
    <>
      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
            position: "fixed",
            right: "1rem",
            top: "1rem",
          },
        }}
      >
        <IconButton onClick={handleMobile}>
          <Menu />
        </IconButton>
      </Box>

      <Tooltip title="back">
        <IconButton
          sx={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            bgcolor: "#1c1c1c",
            color: "white",
            ":hover": {
              bgcolor: "rgba(0,0,0,0.7)",
            },
          }}
          onClick={navigateBack}
        >
          <ArrowBack />
        </IconButton>
      </Tooltip>
    </>
  );

  const GroupName = (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      spacing={"1rem"}
      padding={"3rem"}
    >
      {isEdit ? (
        <>
          <TextField
            value={groupNameUdatedValue}
            onChange={(e) => setGroupNameUdatedValue(e.target.value)}
          />
          <IconButton onClick={updateGroupName} disabled={isLoadingGroupName}>
            <DoneIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography variant="h4">{groupName}</Typography>
          <IconButton
            onClick={() => setIsEdit(true)}
            disabled={isLoadingGroupName}
          >
            <EditIcon />
          </IconButton>
        </>
      )}
    </Stack>
  );
  const ButtonGroup = (
    <>
      <Stack
        direction={{
          sm: "row",
          xs: "column-reverse",
        }}
        spacing={"1rem"}
        p={{
          sm: "1rem",
          xs: "0",
          md: "1rem 4rem",
        }}
      >
        <Button
          size="large"
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={openconfirmDeleteHandler}
        >
          Delete Group
        </Button>
        <Button
          size="large"
          variant="contained"
          onClick={openAddMemberHandler}
          startIcon={<AddIcon />}
        >
          Add Member
        </Button>
      </Stack>
    </>
  );
  return myGroups.isLoading ? (
    <LayoutLoader />
  ) : (
    <Grid container height={"100vh"}>
      <Grid
        item
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },
        }}
        sm={4}
        height={"100%"}
        // bgcolor={"bisque"}
      >
        <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "1rem 3rem",
        }}
      >
        {IcondBtns}

        {groupName ? (
          <>
            {GroupName}
            <Typography
              margin={"2rem"}
              alignSelf={"flex-start"}
              variant="body1"
            >
              Members
            </Typography>
            <Stack
              maxWidth={"45rem"}
              width={"100%"}
              boxSizing={"border-box"}
              padding={{
                sm: "1rem",
                md: "1rem 4rem",
                xs: "0",
              }}
              spacing={"2rem"}
              // bgcolor={"yellow"}
              height={"50vh"}
              overflow={"auto"}
            >
              {/* members */}

              {isLoadingRemoveMember ? (
                <CircularProgress />
              ) : (
                members?.map((i) => {
                  return (
                    <UserItem
                      key={i._id}
                      user={i}
                      isAdded
                      styling={{
                        boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",
                        padding: "1rem 2rem",
                        borderRadius: "1rem",
                        // maxWidth: "400px",
                      }}
                      handler={removeMemberHandler}
                    />
                  );
                })
              )}
            </Stack>
            {ButtonGroup}
          </>
        ) : (
          <Typography
            textAlign={"center"}
            variant="h3"
            alignContent={"center"}
            marginTop={"4rem"}
          >
            Explore Your Groups
          </Typography>
        )}
      </Grid>

      {isAddMember && (
        <Suspense fallback={<Backdrop open />}>
          <AddMemberDialog chatId={chatId} />
        </Suspense>
      )}

      {confirmDeleteDialog && (
        <Suspense fallback={<Backdrop open />}>
          <ConfirmDeleteDialog
            open={confirmDeleteDialog}
            handleClose={closeconfiremDeleteHandler}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}

      <Drawer
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileClose}
      >
        <GroupsList
          myGroups={myGroups?.data?.groups}
          chatId={chatId}
          w={"40"}
        />
      </Drawer>
    </Grid>
  );
};

const GroupsList = ({ w = "100%", myGroups = [], chatId }) => {
  return (
    <Stack
      width={w}
      sx={{
        backgroundImage: "linear-gradient(rgb(255 255 209),rgb(249 159 159))",
        height: "100%",
        minWidth: "240px",
        overflow: "auto",
      }}
    >
      {myGroups.length > 0 ? (
        myGroups.map((group) => (
          <GroupsListItem key={group._id} group={group} chatId={chatId} />
        ))
      ) : (
        <Typography textAlign={"center"} padding={"1rem"}>
          No Groups
        </Typography>
      )}
    </Stack>
  );
};
const GroupsListItem = memo(({ group, chatId }) => {
  const { _id, name, avatar } = group;
  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault();
      }}
    >
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <AvatarCard avatar={avatar} />
        <Typography>{name}</Typography>
      </Stack>
    </Link>
  );
});
export default Groups;
