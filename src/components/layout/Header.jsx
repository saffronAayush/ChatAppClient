import {
  Add as AddIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Notifications as NotificationIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Backdrop,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { lazy, Suspense } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { orange } from "../../constants/color.js";
import { server } from "../../constants/config.js";
import { userNotExists } from "../../redux/reducers/auth.js";
import { resetNotificationCount } from "../../redux/reducers/chat.js";
import {
  setIsMobile,
  setIsNewGroup,
  setIsNotificaion,
  setIsSearch,
} from "../../redux/reducers/misc.js";

// Lazy load the Search component
const Search = lazy(() => import("../specific/Search.jsx"));
const Notification = lazy(() => import("../specific/Notifications.jsx"));
const NewGroups = lazy(() => import("../specific/NewGroups.jsx"));

const Header = () => {
  const { isSearch, isNewGroup, isNotification } = useSelector(
    (state) => state.misc
  );
  const { notificationCount } = useSelector((state) => state.chat);

  // const [isNewGroups, setIsNewGroups] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMobile = () => {
    dispatch(setIsMobile(true));
  };
  const openSearch = () => {
    dispatch(setIsSearch(true));
  };
  const openNewGroup = () => {
    dispatch(setIsNewGroup(true));
  };
  const openNotification = () => {
    dispatch(setIsNotificaion(true));
    dispatch(resetNotificationCount());
  };
  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExists());
      toast.success("Loged out successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "something went wrong");
    }
  };
  const navigateToGroup = () => {
    navigate("/groups");
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <AppBar
          position="static"
          sx={{
            bgcolor: orange,
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Chattu
            </Typography>
            <Box
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              <IconButton color="inherit" onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
              }}
            />
            <Box>
              <Tooltip title="Search">
                <IconButton color="inherit" size="large" onClick={openSearch}>
                  <SearchIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="New Group">
                <IconButton color="inherit" size="large" onClick={openNewGroup}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Manage Group">
                <IconButton
                  color="inherit"
                  size="large"
                  onClick={navigateToGroup}
                >
                  <GroupIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Notifications">
                <IconButton
                  color="inherit"
                  size="large"
                  onClick={openNotification}
                >
                  {notificationCount ? (
                    <Badge badgeContent={notificationCount} color="error">
                      <NotificationIcon />
                    </Badge>
                  ) : (
                    <NotificationIcon />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title="Logout">
                <IconButton
                  color="inherit"
                  size="large"
                  onClick={logoutHandler}
                >
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <Search />
        </Suspense>
      )}
      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <Notification />
        </Suspense>
      )}
      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <NewGroups />
        </Suspense>
      )}
    </>
  );
};

export default Header;
