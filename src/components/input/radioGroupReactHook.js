import React from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { RadioGroup, FormControlLabel, Radio, FormHelperText } from "@mui/material";

export default function RadioGroupReactHook(props) {
  const { name, rules, control, options, isError, helperText } = props;
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value } }) => (
        <>
          <RadioGroup row aria-labelledby={name} name={name} value={value} onChange={onChange}>
            {options.map((option) => (
              <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
            ))}
          </RadioGroup>

          {isError && <FormHelperText>{helperText}</FormHelperText>}
        </>
      )}
    />
  );
}

RadioGroupReactHook.propTypes = {
  name: PropTypes.string,
  rules: PropTypes.object,
  control: PropTypes.any,
  options: PropTypes.array,
  isError: PropTypes.bool,
  helperText: PropTypes.string,
};
