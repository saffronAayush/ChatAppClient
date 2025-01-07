import { useInputValidation } from "6pp";
import { Dialog, DialogTitle, List, Stack, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";
import { setIsSearch } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";
import { useAsyncMutation } from "../../hooks/hook";

const Search = () => {
  const [users, setusers] = useState([]);

  const [searchUser] = useLazySearchUserQuery();

  const dispatch = useDispatch();
  const { isSearch } = useSelector((s) => s.misc);

  const search = useInputValidation("");

  // const [sendFriendRequest] = useSendFriendRequestMutation();
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );

  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending Friend Request...", { userId: id });
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      // console.log(search.value);

      searchUser(search.value).then(({ data }) => {
        // console.log(data);
        setusers(data.users);
      });
      // .catch((e) => console.log(e));
    }, 500);
    return () => {
      clearTimeout(timeOutId);
    };
  }, [search.value]);

  return (
    <Dialog open={isSearch} onClose={() => dispatch(setIsSearch(false))}>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
          placeholder={"Search"}
          variant={"outlined"}
          value={search.value}
          onChange={search.changeHandler}
          size="small"
        />
        <List>
          {users.map((i) => (
            <UserItem
              key={i._id}
              user={i}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingSendFriendRequest}
            />
          ))}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;
