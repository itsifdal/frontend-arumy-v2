import { forwardRef } from "react";
import PropTypes from "prop-types";

// @mui
import { Box, Stack, Card } from "@mui/material";

import IMAGES from "../constants/images";

const LoginLayout = forwardRef(({ children }, ref) => (
  <Box
    ref={ref}
    minHeight="100vh"
    sx={{
      backgroundImage: `url(${IMAGES.LOGIN_BG})`,
      backgroundPositionY: "center",
      backgroundPositionX: "center",
      backgroundSize: "cover",
      display: "flex",
    }}
  >
    <Box maxWidth={480} width="100%" margin="auto" paddingBottom={5}>
      <Stack alignItems="center">
        <img
          src={IMAGES.ILLUSTRATION_LOGIN}
          alt="owly login"
          style={{ width: "207px", height: "207px", transform: "rotate(-3.071deg)" }}
        />
        <Card
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            mt: "-25px",
            py: "55px",
            px: "33px",
            mb: "60px",
            zIndex: "2",
            borderRadius: "20px",
            boxShadow: "3px 4px 30px 0px rgba(0, 0, 0, 0.15)",
          }}
        >
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
