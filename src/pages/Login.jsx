import AccountCircle from "@mui/icons-material/AccountCircle";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import "./Login.css"; // Import the CSS file

const StyledPaper = styled(Paper)({
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderRadius: "10px",

  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
});

const ProfilePicPreview = styled("div")({
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  position: "relative", // Position for the icon
});

const ProfilePic = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const CameraIconButton = styled(IconButton)({
  backgroundColor: "#fff", // White background for visibility
  position: "relative",
  top: "-40px",
  right: "-200px",
  borderRadius: "50%",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
});

// main program starts
const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  // login submition
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Logging in...");
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username,
          password,
        },
        config
      );
      // console.log(data);
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // signup or register the user
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Signing in...");
    const formData = new FormData();
    formData.append("avatar", profilePhoto);
    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("username", username);
    formData.append("password", password);

    try {
      const { data } = await axios.post(`${server}/api/v1/user/new`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(userExists(data.user));
      toast.success(data?.message, { id: toastId });
    } catch (err) {
      toast.error(err?.response?.data?.message || "something went wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (file && file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB. Please select a smaller file.");
      return;
    } // Ensure this logs the correct file object
    setProfilePhoto(file);
    setProfilePhotoPreview(URL.createObjectURL(file));
  };

  return (
    <Container maxWidth="xs" className="container">
      <StyledPaper elevation={3} className="styled-paper">
        {isLogin && (
          <Box sx={{ mt: 4, mb: 2, textAlign: "center" }}>
            <Typography variant="h4">Login</Typography>
          </Box>
        )}

        {isLogin ? (
          <form onSubmit={handleLoginSubmit}>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              type="password"
              label="Password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={isLoading}
            >
              Login
            </Button>
            <Button
              variant="text"
              fullWidth
              sx={{ mt: 1 }}
              onClick={() => setIsLogin(false)}
            >
              Don't have an account? Register
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            {" "}
            <ProfilePicPreview className="profile-pic-preview">
              {profilePhotoPreview ? (
                <ProfilePic src={profilePhotoPreview} alt="Profile Preview" />
              ) : (
                <AccountCircle
                  sx={{
                    width: "100%",
                    height: "100%",
                    color: "#3f51b5",
                  }}
                />
              )}
            </ProfilePicPreview>
            <label htmlFor="profile-photo">
              <CameraIconButton component="span" className="camera-icon">
                <PhotoCamera />
              </CameraIconButton>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="profile-photo"
                type="file"
                onChange={handlePhotoChange}
              />
            </label>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label="Bio"
              fullWidth
              margin="normal"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
            />
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              type="password"
              label="Password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={isLoading}
            >
              Register
            </Button>
            <Button
              variant="text"
              fullWidth
              sx={{ mt: 1 }}
              onClick={() => setIsLogin(true)}
            >
              Already have an account? Login
            </Button>
          </form>
        )}
      </StyledPaper>
    </Container>
  );
};

export default LoginPage;
