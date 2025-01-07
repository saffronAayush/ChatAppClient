import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
import {
  Face as FaseIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalenderIcon,
} from "@mui/icons-material";
import moment from "moment";
import { transformImage } from "../../lib/features";
const Profile = ({ user }) => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar
        src={transformImage(user?.avatar?.url)}
        sx={{
          width: 200,
          height: 200,
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid white",
        }}
      />
      <ProfileCard heading={"Bio"} text={user?.bio} />
      <ProfileCard
        Icon={<UserNameIcon />}
        heading={"Username"}
        text={user?.username}
      />
      <ProfileCard Icon={<FaseIcon />} heading={"Name"} text={user?.name} />
      <ProfileCard
        Icon={<CalenderIcon />}
        heading={"Joined"}
        text={moment(user?.createdAt).fromNow()}
      />
    </Stack>
  );
};

const ProfileCard = ({ text, Icon, heading }) => {
  return (
    <Stack
      spacing={"1rem"}
      direction={"row"}
      alignItems={"center"}
      color={"white"}
      textAlign={"center"}
    >
      {Icon && Icon}
      <Stack>
        <Typography variant={"body1"}>{text}</Typography>
        <Typography color={"gray"} variant="caption">
          {heading}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Profile;
