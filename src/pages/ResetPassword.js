/* eslint-disable */
import { Link as RouterLink, useParams } from "react-router-dom";
import { useState } from "react";
// form
import { useMutation } from "react-query";
// @mui
import { IconButton, InputAdornment, Link, Typography, FormControl, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import axios from "axios";
import Iconify from "../components/Iconify";
import Page from "../components/Page";
import Collapse from "@mui/material/Collapse";
import Alert from "@mui/material/Alert";
import LoginLayout from "../layouts/LoginLayout";

export default function ResetPassword() {
  const [openAlert, setOpenAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [openAlert500, setOpenAlert500] = useState(false);
  const params = useParams();

  const submitResetPassword = useMutation(({ password }) => {
    if (params.token) {
      const data = { password };
      return axios.post(`${process.env.REACT_APP_BASE_URL}/api/resetpassword/${params.token}`, data);
    }
  });

  const onSubmit = () => {
    const data = {
      password,
    };
    submitResetPassword.mutate(data, {
      onSuccess: (res) => {
        if (res.status === 200) {
          //navigate('/login', { replace: true });
          setOpenAlert(true);
        }
        console.log(res);
      },
      onError: (error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setOpenAlert500(true);
        } else if (error.request) {
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      },
    });
  };

  return (
    <Page title="Forgot Password">
      <LoginLayout>
        <Typography variant="h3" align="center" fontWeight={"bold"} color={"primary.darker"}>
          Reset Password
        </Typography>

        <Typography align="center" sx={{ color: "text.secondary", mb: 5 }}>
          Enter new password below.
        </Typography>

        <FormControl>
          <Collapse in={openAlert}>
            <Alert sx={{ mb: 2 }}>
              Reset Password berhasil,
              <Link variant="subtitle2" component={RouterLink} to="/login">
                Silahkan Login Kembali
              </Link>
            </Alert>
          </Collapse>
          <Collapse in={openAlert500}>
            <Alert severity="error" sx={{ mb: 2 }}>
              Uih, error submitting input.
            </Alert>
          </Collapse>
          <TextField
            required
            margin="normal"
            id="outlined-required"
            name="password"
            label="Password"
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

          <LoadingButton
            size="large"
            type="submit"
            variant="contained"
            loading={submitResetPassword.isLoading}
            color="warning"
            onClick={onSubmit}
          >
            Send Email
          </LoadingButton>
        </FormControl>
      </LoginLayout>
    </Page>
  );
}
