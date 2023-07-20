import { Container, Stack, Typography, Box } from "@mui/material";
import PropTypes from "prop-types";

export default function PageHeader({ title, rightContent }) {
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
      <Container>
        <Stack direction="row" paddingY={3} justifyContent={"space-between"}>
          <Typography
            variant="h4"
            sx={{
              color: "primary.main",
            }}
          >
            {title}
          </Typography>
          <Box>{rightContent}</Box>
        </Stack>
      </Container>
    </Box>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  rightContent: PropTypes.node,
};
