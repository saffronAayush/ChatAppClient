import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectRoute = ({ user, redirect = "/login" }) => {
    if (!user) {
        return <Navigate to={redirect} />;
    }
    return <Outlet />;
};

export default ProtectRoute;
