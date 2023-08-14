import React from "react";
import { styled } from "@mui/material/styles";

import { FormControl, InputLabel, InputBase, NativeSelect, FormHelperText } from "@mui/material";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    borderRadius: "15px",
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #9da4c4",
    fontSize: 14,
    height: "48px",
    padding: "0px 32px 0px 15px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}));

const CustomNativeSelect = React.forwardRef((prop, ref) => {
  const { id, label, required, options, errorMessage, error, ...otherProp } = prop;
  return (
    <FormControl error={error} fullWidth>
      <InputLabel
        htmlFor={id}
        sx={{ position: "relative", transform: "none", fontSize: "12px", fontWeight: "bold", marginBottom: "5px" }}
      >
        {label && String(label).toUpperCase()}
        {required && "*"}
      </InputLabel>
      <NativeSelect id={id} required={required} ref={ref} input={<BootstrapInput />} {...otherProp}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </NativeSelect>
      {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  );
});

export default function NativeSelectBasic(props) {
  return <CustomNativeSelect {...props} />;
}
