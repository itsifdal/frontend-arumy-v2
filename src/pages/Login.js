import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// @mui
import { Box, Stack, IconButton, InputAdornment,Card, Link, Typography, FormControl, TextField, Button } from '@mui/material';

// components
import axios from 'axios';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import Iconify from '../components/Iconify';
import Page from '../components/Page';
// hooks
import useResponsive from '../hooks/useResponsive';

import IMAGES from '../constant/images';

export default function Login() {
  const smUp = useResponsive('up', 'sm');

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser]         = useState('');

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser  = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, [email]);

  if(user){
    navigate('/dashboard/app', { replace: true });
  }

  // login the user
  const handleSubmit = async e => {
    e.preventDefault();
    const data = { email, password };
    // send the email and password to the server
    await axios.post(`${process.env.REACT_APP_BASE_URL}/api/login`, data
      ).then(res => {
        navigate('/dashboard/app', { replace: true });
        // set the state of the user
        setUser(res.data);
        // store the user in localStorage
        localStorage.setItem("user", JSON.stringify(res.data));
      }).catch((error) => {
        if (error.res) {
          console.log(error.res.status);
        }
        setOpenAlert(true)
      });
  };

  return (
    <Page title="Login">
      <Box
        minHeight="100vh"
        style={{
          backgroundImage:`url(${IMAGES.LOGIN_BG})`,
          backgroundPositionY:'center',
          backgroundPositionX:'center',
          backgroundSize:'cover',
          display: 'flex'
        }}
      >
        <Box maxWidth={480} width="100%" margin="auto">
          <Stack alignItems="center">
            <img src={IMAGES.ILLUSTRATION_LOGIN} alt="owly login" style={{width: '207px', height: '207px', transform: 'rotate(-3.071deg)'}} />
            <Card style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              marginTop: '-25px',
              paddingTop: 55,
              paddingBottom: 55,
              paddingLeft: 33,
              paddingRight: 33,
              marginBottom: 60
            }}>
              <Typography variant="h4" align="center">
                Sign in
              </Typography>

              { user ? (
                <Typography align="center" sx={{ color: 'text.secondary' }}>Enter your details below. {user.id}</Typography>
              ) : (  
                <Typography align="center" sx={{ color: 'text.secondary' }}>Enter your details below.</Typography>
              )}

              <FormControl fullWidth >
                <Collapse in={openAlert}>
                  <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                  >
                    Login Details Incorrect. Please try again.
                  </Alert>
                </Collapse>

                <TextField required id="outlined-required email" margin="normal" label="Enter Email"  name="email" 
                  value={email} 
                  onChange={(e) => {setEmail(e.target.value)}} 
                />
                <TextField required id="outlined-required password" margin="normal" label="Enter Password"  name="password" 
                  value={password} onChange={(e) => {setPassword(e.target.value)}}
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }} 
                />

                <Link variant="subtitle2" underline="hover" component={RouterLink} to="/ForgotPassword" color="secondary" marginBottom={1}>
                  Forgot password?
                </Link>

                <Button variant="contained" type="submit" onClick={handleSubmit} size="large" color="warning">Login</Button>
              </FormControl>
              
              {!smUp && (
                <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                  Don't have an account?{' '}
                  <Link variant="subtitle2" component={RouterLink} to="/register">
                    Get started
                  </Link>
                </Typography>
              )}
            </Card>
            <img src={IMAGES.LOGO_WHITE} alt="logo login" style={{height: '86px', width: '369px'}} />
          </Stack>
        </Box>
      </Box>
    </Page>
  );
}
