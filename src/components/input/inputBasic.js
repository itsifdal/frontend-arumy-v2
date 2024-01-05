import React from "react";
import { styled } from "@mui/material/styles";

import { FormControl, InputLabel, TextField } from "@mui/material";

export const CustomTextField = styled(TextField)({
  input: {
    fontSize: "12px",
  },
  textarea: {
    fontSize: "12px",
  },
  ".MuiInputBase-root": { borderRadius: "15px" },
  ".MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(115, 125, 170, 0.70)",
  },
});

const CustomInput = React.forwardRef((prop, ref) => {
  const { id, label, required, errorMessage, ...otherProp } = prop;
  return (
    <FormControl fullWidth>
      <InputLabel
        htmlFor={id}
        sx={{ position: "relative", transform: "none", fontSize: "12px", fontWeight: "bold", marginBottom: "5px" }}
      >
        {String(label).toUpperCase()}
        {required && "*"}
      </InputLabel>
      <CustomTextField id={id} required={required} {...otherProp} ref={ref} helperText={errorMessage} />
    </FormControl>
  );
});

export default function InputBasic(props) {
  return <CustomInput {...props} />;
}
