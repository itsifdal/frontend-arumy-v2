import React from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { Checkbox, FormGroup, FormControlLabel, FormHelperText } from "@mui/material";

export default function CheckBoxReactHook(props) {
  const { name, rules, control, isError, helperText, label } = props;
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value = false } }) => (
        <>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={value} onChange={onChange} inputProps={{ "aria-label": "controlled" }} />}
              label={label}
            />
          </FormGroup>
          {isError && <FormHelperText>{helperText}</FormHelperText>}
        </>
      )}
    />
  );
}

CheckBoxReactHook.propTypes = {
  name: PropTypes.string,
  rules: PropTypes.object,
  control: PropTypes.any,
  isError: PropTypes.bool,
  helperText: PropTypes.string,
  label: PropTypes.string,
};
