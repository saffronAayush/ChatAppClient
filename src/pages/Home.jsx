import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Box, Typography } from "@mui/material";

const Home = () => {
    return (
        <Box bgcolor={"#c0c0c0"} height={"100%"}>
            <Typography p={"2rem"} variant="h5" textAlign={"center"}>
                Select a Friend to chat.
            </Typography>
        </Box>
    );
};

export default AppLayout()(Home);
