import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Typography, MenuItem, Avatar, Button, Stack } from '@mui/material';
// components
import axios from 'axios';
import MenuPopover from '../../components/MenuPopover';
// mocks_
import account from '../../_mock/account';

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const anchorRef = useRef(null);

  const [user, setUser] = useState();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  const [open, setOpen] = useState(null);
  
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };
  
  const navigate = useNavigate();

  const onLogout = () => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/login/logout`)
      .then(() => {
        localStorage.clear();
        navigate('/login', { replace: true });
      })
  };
  

  return (
    <>
      <Button
        ref={anchorRef}
        onClick={handleOpen}
        fullWidth
        sx={{
          justifyContent: 'flex-start',
          maxWidth: '230px',
          gap: 2,
          p: 1
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" sx={{ width: 51, height: 51 }} />
        <Stack>
          <Typography noWrap sx={{fontWeight: '700', fontSize: '20px'}}>{user?.name}</Typography>
          <Typography noWrap sx={{fontSize: '16px'}}>{user?.role}</Typography>
        </Stack>
      </Button>

      <MenuPopover
        noArrow
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <MenuItem onClick={onLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
