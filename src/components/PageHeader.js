import { Container, Stack, Typography, Box } from "@mui/material";
import PropTypes from "prop-types";

export default function PageHeader({ title, rightContent, leftContent }) {
  return (
    <Box
      sx={{
        background: "#FFF",
        boxShadow: "0px 4px 20px 0px rgba(0, 0, 0, 0.05)",
        position: "sticky",
        top: 0,
        right: 0,
        left: 0,
      }}
    >
      <Container maxWidth="xl">
        <Stack direction="row" paddingY={[1, 3]} justifyContent={"space-between"} alignItems={"center"}>
          <Stack direction="row" alignItems={"center"}>
            <Box>{leftContent}</Box>
            <Typography
              as="h3"
              fontSize={{ xs: "16px", sm: "35px" }}
              sx={{
                color: "primary.main",
              }}
            >
              {title}
            </Typography>
          </Stack>
          <Box>{rightContent}</Box>
        </Stack>
      </Container>
    </Box>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  rightContent: PropTypes.node,
  leftContent: PropTypes.node,
};
