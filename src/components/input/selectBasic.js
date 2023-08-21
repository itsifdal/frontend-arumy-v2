import React from "react";
import { styled } from "@mui/material/styles";

import { FormControl, InputLabel, TextField, MenuItem } from "@mui/material";

const CustomTextField = styled(TextField)((props) => ({
  ".MuiSelect-select": {
    padding: props.size === "small" ? "7px" : "15px",
    fontSize: "14px",
  },
  ".MuiInputBase-root": { borderRadius: "15px" },
  ".MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(115, 125, 170, 0.70)",
  },
}));

const CustomSelect = React.forwardRef((prop, ref) => {
  const { id, label, required, options, errorMessage, ...otherProp } = prop;
  return (
    <FormControl fullWidth>
      <InputLabel
        htmlFor={id}
        sx={{ position: "relative", transform: "none", fontSize: "12px", fontWeight: "bold", marginBottom: "5px" }}
      >
        {String(label).toUpperCase()}
        {required && "*"}
      </InputLabel>
      <CustomTextField id={id} required={required} {...otherProp} ref={ref} helperText={errorMessage}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </CustomTextField>
    </FormControl>
  );
});

export default function SelectBasic(props) {
  return <CustomSelect {...props} />;
}
