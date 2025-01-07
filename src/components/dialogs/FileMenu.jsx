import {
  AudioFile as AudioIcon,
  Image as ImageIcon,
  UploadFile,
  VideoFile,
} from "@mui/icons-material";
import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from "@mui/material";
import React, { useRef } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useSendAttachmentsMutation } from "../../redux/api/api";
import { setIsFileMenu, setUploadLoader } from "../../redux/reducers/misc";

const FileMenu = ({ anchorE1, chatId }) => {
  const dispatch = useDispatch();
  const { isFileMenu } = useSelector((state) => state.misc);

  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);

  const [sendAttachments] = useSendAttachmentsMutation();

  const selectImage = () => imageRef.current?.click();
  const selectAudio = () => audioRef.current?.click();
  const selectVideo = () => videoRef.current?.click();
  const selectFile = () => fileRef.current?.click();

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);
    if (files.length <= 0) return;
    if (files.length > 5) {
      return toast.error("Too many files to send");
    }

    dispatch(setUploadLoader(true));
    const toastId = toast.loading(`Uploading ${key}...`);
    dispatch(setIsFileMenu(false));

    try {
      const myForm = new FormData();
      myForm.append("chatId", chatId);
      files.forEach((file) => myForm.append("files", file));

      const res = await sendAttachments(myForm);
      if (res?.data) toast.success(`${key} sent successfully`, { id: toastId });
      else toast.error(`Failed to send ${key}`, { id: toastId });
    } catch (err) {
      toast.error(err, { id: toastId });
    } finally {
      dispatch(setUploadLoader(false));
    }
  };
  return (
    <Menu
      anchorEl={anchorE1}
      open={isFileMenu}
      onClose={() => dispatch(setIsFileMenu(false))}
    >
      <MenuList>
        <MenuItem onClick={selectImage}>
          <Tooltip title="Image">
            <ImageIcon />
          </Tooltip>
          <ListItemText style={{ marginLeft: "0.4rem" }}>Image</ListItemText>
          <input
            type="file"
            multiple
            accept="image/png, image/jpeg, image/gif"
            style={{ display: "none" }}
            onChange={(e) => fileChangeHandler(e, "Images")}
            ref={imageRef}
          />
        </MenuItem>

        <MenuItem onClick={selectAudio}>
          <Tooltip title="Audio">
            <AudioIcon />
          </Tooltip>
          <ListItemText style={{ marginLeft: "0.4rem" }}>Audio</ListItemText>
          <input
            type="file"
            multiple
            accept="audio/mpeg, audio/wav, audio/ogg"
            style={{ display: "none" }}
            onChange={(e) => fileChangeHandler(e, "Audios")}
            ref={audioRef}
          />
        </MenuItem>

        <MenuItem onClick={selectVideo}>
          <Tooltip title="Video">
            <VideoFile />
          </Tooltip>
          <ListItemText style={{ marginLeft: "0.4rem" }}>Video</ListItemText>
          <input
            type="file"
            multiple
            accept="video/mp4, video/webm, video/ogg"
            style={{ display: "none" }}
            onChange={(e) => fileChangeHandler(e, "Videos")}
            ref={videoRef}
          />
        </MenuItem>

        <MenuItem onClick={selectFile}>
          <Tooltip title="File">
            <UploadFile />
          </Tooltip>
          <ListItemText style={{ marginLeft: "0.4rem" }}>File</ListItemText>
          <input
            type="file"
            multiple
            accept="*"
            style={{ display: "none" }}
            onChange={(e) => fileChangeHandler(e, "Files")}
            ref={fileRef}
          />
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default FileMenu;
