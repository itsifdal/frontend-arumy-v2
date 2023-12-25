import React, { useState } from "react";
import { Autocomplete } from "@mui/material";
import PropTypes from "prop-types";

import { Controller } from "react-hook-form";
import { CustomTextField } from "./inputBasic";

export default function AutoCompleteReactHook(props) {
  const [open, setOpen] = useState(false);
  const { name, rules, control, value, options, loading, isError, onChangeCallback, helperText } = props;
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange } }) => (
        <Autocomplete
          open={open}
          value={value}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          isOptionEqualToValue={(option, value) => option.label === value?.label}
          getOptionLabel={(option) => option.label}
          options={options}
          loading={loading}
          onChange={(_, newValue) => {
            if (newValue) {
              onChange(newValue?.value);
              onChangeCallback(newValue);
            }
          }}
          renderInput={(params) => <CustomTextField {...params} helperText={helperText} error={isError} />}
        />
      )}
    />
  );
}

AutoCompleteReactHook.propTypes = {
  name: PropTypes.string,
  rules: PropTypes.object,
  control: PropTypes.any,
  value: PropTypes.object,
  options: PropTypes.array,
  loading: PropTypes.bool,
  onChangeCallback: PropTypes.func,
  isError: PropTypes.bool,
  helperText: PropTypes.string,
};
