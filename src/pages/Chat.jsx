import { AttachFile, Send as SendIcon } from "@mui/icons-material";
import { IconButton, Skeleton, Stack } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileMenu from "../components/dialogs/FileMenu";
import AppLayout from "../components/layout/AppLayout";
import MessageComponent from "../components/shared/MessageComponent";
import { InputBox } from "../components/styles/StyledComponents";
import { orange } from "../constants/color";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../constants/events.js";
import { useErrors, useSocketEvents } from "../hooks/hook.jsx";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api.js";
import { getSocket } from "../socket";
import { useInfiniteScrollTop } from "6pp";
import { setIsFileMenu } from "../redux/reducers/misc.js";
import { removeNewMessagesAlert } from "../redux/reducers/chat.js";
import { TypingLoader } from "../components/layout/Loaders.jsx";
import { useNavigate } from "react-router-dom";

const Chat = ({ chatId }) => {
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const socket = getSocket();
  const { user } = useSelector((state) => state.auth);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchore, setFileMenuAnchore] = useState(null);

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );
  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const members = chatDetails.data?.chat?.members;

  const submitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
    // console.log(message);
  };
  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchore(e.currentTarget);
  };
  // console.log("ancore", fileMenuAnchore);
  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));
    return () => {
      setMessage("");
      setMessages([]);
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const navigate = useNavigate();
  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

  const typingHandler = (e) => {
    setMessage(e.target.value);
    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, [2000]);
  };

  const newMessagesHandler = useCallback(
    (data) => {
      // console.log(data.chatId, chatId, data.chatId === chatId);
      if (data.chatId !== chatId) return;
      setMessages((pre) => [...pre, data.message]);
    },
    [chatId]
  );

  const startTypingListener = useCallback(
    (data) => {
      // console.log(data.chatId, chatId, data.chatId === chatId);
      if (data.chatId !== chatId) return;

      setUserTyping(true);
    },
    [chatId]
  );
  const stopTypingListener = useCallback(
    (data) => {
      // console.log(data.chatId, chatId, data.chatId === chatId);
      if (data.chatId !== chatId) return;

      setUserTyping(false);
    },
    [chatId]
  );
  // const alertListener = useCallback((data) => {}, []);

  const eventHandlers = {
    // [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesHandler,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };
  useSocketEvents(socket, eventHandlers);

  useErrors(errors);
  // console.log(oldMessagesChunk);

  const allMessages = [...oldMessages, ...messages];

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={"#c0c0c0cc"}
        height={"90%"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {allMessages?.map((i) => (
          <>
            <MessageComponent key={i._id} message={i} user={user} />
          </>
        ))}
        {userTyping && <TypingLoader />}
        <div ref={bottomRef} />
      </Stack>

      <form
        style={{
          height: "10%",
        }}
        onSubmit={submitHandler}
      >
        <Stack
          direction={"row"}
          height={"100%"}
          padding={"0.5rem"}
          alignItems={"center"}
          position={"relative"}
        >
          <IconButton
            sx={{
              position: "absolute",
              left: "1rem",
              rotate: "30deg",
            }}
            onClick={handleFileOpen}
          >
            <AttachFile />
          </IconButton>
          <InputBox
            placeholder="Type Message Here"
            value={message}
            onChange={typingHandler}
          />
          <IconButton
            type="submit"
            sx={{
              rotate: "-27deg",
              backgroundColor: orange,
              color: "white",
              marginLeft: "1rem",
              "&:hover": {
                backgroundColor: "error.dark",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>

      <FileMenu anchorE1={fileMenuAnchore} chatId={chatId} />
    </>
  );
};

export default AppLayout()(Chat);
