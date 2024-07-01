import { InputLabel } from "@mui/material";
import PropTypes from "prop-types";

export default function CustomInputLabel({ children, htmlFor }) {
  return (
    <InputLabel
      htmlFor={htmlFor}
      sx={{
        position: "relative",
        transform: "none",
        fontSize: "12px",
        fontWeight: "bold",
        marginBottom: "5px",
      }}
    >
      {children}
    </InputLabel>
  );
}

CustomInputLabel.propTypes = {
  children: PropTypes.node,
  htmlFor: PropTypes.string,
};
