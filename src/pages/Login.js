import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useMutation } from "react-query";
// @mui
import { IconButton, InputAdornment, Link, Typography, FormControl, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

// components
import Collapse from "@mui/material/Collapse";
import Alert from "@mui/material/Alert";
import Iconify from "../components/Iconify";
import Page from "../components/Page";
import { fetchHeader } from "../constants/fetchHeader";

import LoginLayout from "../layouts/LoginLayout";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");

  const submitLogin = useMutation(({ email, password }) => {
    const data = { email, password };
    // send the email and password to the server
    return axios.post(`${process.env.REACT_APP_BASE_URL}/api/login`, data, {
      headers: fetchHeader,
    });
  });

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, [email]);

  if (user) {
    navigate("/app/dashboard", { replace: true });
  }

  // login the user
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { email, password };
    submitLogin.mutate(data, {
      onSuccess: (res) => {
        navigate("/app/dashboard", { replace: true });
        // set the state of the user
        setUser(res.data);
        // store the user in localStorage
        localStorage.setItem("user", JSON.stringify(res.data));
      },
      onError: (error) => {
        if (error.res) {
          console.log(error.res.status);
        }
        setOpenAlert(true);
      },
    });
  };

  return (
    <Page title="Login">
      <LoginLayout>
        <Typography variant="h3" align="center" fontWeight={"bold"} color={"primary.darker"}>
          Sign in
        </Typography>

        {user ? (
          <Typography align="center" sx={{ color: "text.secondary" }}>
            Enter your details below. {user.id}
          </Typography>
        ) : (
          <Typography align="center" sx={{ color: "text.secondary" }}>
            Enter your details below.
          </Typography>
        )}

        <FormControl fullWidth>
          <Collapse in={openAlert}>
            <Alert severity="error" sx={{ mb: 2 }}>
              Login Details Incorrect. Please try again.
            </Alert>
          </Collapse>

          <TextField
            required
            id="outlined-required email"
            margin="normal"
            label="Enter Email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <TextField
            required
            id="outlined-required password"
            margin="normal"
            label="Enter Password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Link
            variant="subtitle2"
            underline="hover"
            component={RouterLink}
            to="/forgotpassword"
            color="secondary"
            marginBottom={1}
          >
            Forgot password?
          </Link>

          <LoadingButton
            loading={submitLogin.isLoading}
            variant="contained"
            type="submit"
            onClick={handleSubmit}
            size="large"
            color="warning"
          >
            Login
          </LoadingButton>
        </FormControl>
      </LoginLayout>
    </Page>
  );
}
