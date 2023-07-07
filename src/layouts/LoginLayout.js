import { forwardRef } from 'react';
import PropTypes from 'prop-types';

// @mui
import { Box, Stack, Card } from '@mui/material';

import IMAGES from '../constant/images';

const LoginLayout = forwardRef(({ children }, ref) => (
  <Box ref={ref}
    minHeight="100vh"
    style={{
      backgroundImage:`url(${IMAGES.LOGIN_BG})`,
      backgroundPositionY:'center',
      backgroundPositionX:'center',
      backgroundSize:'cover',
      display: 'flex'
    }}
  >
    <Box maxWidth={480} width="100%" margin="auto" paddingBottom={5}>
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
          {children}
        </Card>
        <img src={IMAGES.LOGIN_LOGO} alt="logo login" />
      </Stack>
    </Box>
  </Box>
));

LoginLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LoginLayout;