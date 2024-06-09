import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Snackbar,
  TextField,
} from "@mui/material";

import { fetchLogin } from "@/networks/libs/auth";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@mui/lab";

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

function AuthLogin({ title, subtitle, subtext }: loginType) {
  const router = useRouter();
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: "",
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const login = async () => {
    setIsloading(true);

    await fetchLogin({
      email: email,
      password: password,
    })
      .then((response) => {
        setIsloading(false);
        localStorage.setItem("token", response?.data?.data?.token);
        localStorage.setItem("email", response?.data?.data?.email);
        localStorage.setItem("name", response?.data?.data?.name);

        router.push("/");
      })
      .catch((error) => {
        setIsloading(false);
        setSnackbar({
          isOpen: true,
          message: "Silahkan cek email dan password anda!",
        });
      });
  };

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbar.isOpen}
        message={snackbar.message}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login();
        }}
      >
        <Stack>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="Email"
              mb="5px"
            >
              Email
            </Typography>
            <TextField
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              variant="outlined"
              fullWidth
              type="email"
            />
          </Box>
          <Box mt="25px">
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="password"
              mb="5px"
            >
              Password
            </Typography>
            <TextField
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              variant="outlined"
              fullWidth
            />
          </Box>
        </Stack>
        <Box mt={4}>
          <LoadingButton
            loading={isLoading}
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
          >
            Sign In
          </LoadingButton>
        </Box>
      </form>
      {subtitle}
    </>
  );
}

export default AuthLogin;
