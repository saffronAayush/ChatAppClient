import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectRoute from "./components/auth/ProtectRoute";
import { LayoutLoader } from "./components/layout/Loaders";
import axios from "axios";
import { server } from "./constants/config.js";
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from "./redux/reducers/auth.js";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./socket.jsx";

// import Rough from "./pages/rough";
// import Home from "./pages/Home";
// import Login from "./pages/Login.jsx";
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
// const Rough = lazy(() => import("./pages/rough"));

const App = () => {
  const { user, loader } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // console.log(server);
    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then((res) => {
        // console.log(res);
        dispatch(userExists(res?.data?.user));
      })
      .catch((err) => {
        // console.log(err);
        dispatch(userNotExists());
      });
  }, []);

  return loader ? (
    <LayoutLoader />
  ) : (
    <>
      {/* <Suspense fallback={<div>Loading...</div>}>
                <Rough />
            </Suspense> */}

      <BrowserRouter>
        <Suspense fallback={<LayoutLoader />}>
          <Routes>
            <Route
              element={
                <SocketProvider>
                  <ProtectRoute user={user} />
                </SocketProvider>
              }
            >
              <Route path="/" element={<Home />} />
              <Route path="/chat/:chatId" element={<Chat />} />
              <Route path="/groups" element={<Groups />} />
            </Route>

            {/* <Route
                            path="/login"
                            element={
                                <ProtectRoute user={!user} redirect="/">
                                    <Login />
                                </ProtectRoute>
                            }

                        /> */}
            <Route
              path="/login"
              element={
                <ProtectRoute user={!user} redirect="/">
                  <Login />
                </ProtectRoute>
              }
            >
              <Route path="/login" element={<Login />} />
            </Route>

            <Route
              path="/*"
              element={<div>Kaha aa gaya chutiye, page hi nahi hai ye to</div>}
            />
          </Routes>
        </Suspense>
        <Toaster position="bottom-center" />
      </BrowserRouter>
    </>
  );
};

export default App;
