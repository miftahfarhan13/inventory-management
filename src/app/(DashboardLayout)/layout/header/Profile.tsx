import React, { useState } from "react";
import { Avatar, Box, Menu, IconButton } from "@mui/material";

import { fetchLogout } from "@/networks/libs/auth";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@mui/lab";

const Profile = () => {
  const router = useRouter();
  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const [isLoadingLogout, setisLoadingLogout] = useState(false);
  const handleLogout = async () => {
    setisLoadingLogout(true);
    await fetchLogout(localStorage.getItem("token") || "")
      .then((response) => {
        localStorage.clear();
        router.replace("/authentication/login");
        setisLoadingLogout(false);
      })
      .catch((error) => {
        localStorage.clear();
        router.replace("/authentication/login");
        setisLoadingLogout(false);
      });
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src="/images/profile/user-1.jpg"
          alt="image"
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "200px",
          },
        }}
      >
        {/* <MenuItem>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <IconMail width={20} />
          </ListItemIcon>
          <ListItemText>My Account</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <IconListCheck width={20} />
          </ListItemIcon>
          <ListItemText>My Tasks</ListItemText>
        </MenuItem> */}
        <Box py={1} px={2}>
          <LoadingButton
            onClick={handleLogout}
            loading={isLoadingLogout}
            variant="outlined"
            color="primary"
            fullWidth
          >
            Logout
          </LoadingButton>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
