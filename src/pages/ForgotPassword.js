import { useState } from "react";
// form
import { useMutation } from "react-query";
// @mui
import { Typography, FormControl, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import axios from "axios";
import Collapse from "@mui/material/Collapse";
import Alert from "@mui/material/Alert";
import Page from "../components/Page";

import LoginLayout from "../layouts/LoginLayout";

// ----------------------------------------------------------------------

export default function ForgotPassword() {
  // const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const [openAlert, setOpenAlert] = useState(false);
  const [openAlert500, setOpenAlert500] = useState(false);

  const submitForgotPassword = useMutation(({ email }) => {
    const data = { email };
    return axios.post(`${process.env.REACT_APP_BASE_URL}/api/forgotpassword`, data, {
      headers: { "x-api-key": process.env.REACT_APP_API_KEY },
    });
  });

  const onSubmit = () => {
    const data = {
      email,
    };
    submitForgotPassword.mutate(data, {
      onSuccess: (res) => {
        if (res.status === 200) {
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
        <Typography align="center" variant="h4" gutterBottom>
          Forgot Password
        </Typography>

        <Typography align="center" sx={{ color: "text.secondary", mb: 5 }}>
          Enter your email below.
        </Typography>

        <FormControl>
          <Collapse in={openAlert}>
            <Alert sx={{ mb: 2 }}>We've sent the link, Check your Email!</Alert>
          </Collapse>
          <Collapse in={openAlert500}>
            <Alert severity="error" sx={{ mb: 2 }}>
              Uih, this email is not registered.
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

          <LoadingButton
            size="large"
            type="submit"
            variant="contained"
            loading={submitForgotPassword.isLoading}
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
