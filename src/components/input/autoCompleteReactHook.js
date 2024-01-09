import React, { useState } from "react";
import { Autocomplete } from "@mui/material";
import PropTypes from "prop-types";

import { Controller } from "react-hook-form";
import { CustomTextField } from "./inputBasic";

export default function AutoCompleteReactHook(props) {
  const [open, setOpen] = useState(false);
  const { name, rules, control, options, loading, isError, onChangeCallback, helperText } = props;
  const isLoading = open && options.length === 0 && loading;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value } }) => (
        <Autocomplete
          open={open}
          value={value ? options.find((option) => option.value === value) : null}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          isOptionEqualToValue={(option, value) => option.label === value?.label}
          getOptionLabel={(option) => option.label}
          options={options}
          loading={isLoading}
          onChange={(_, newValue) => {
            onChange(newValue?.value);
            if (onChangeCallback) {
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
  options: PropTypes.array,
  loading: PropTypes.bool,
  onChangeCallback: PropTypes.func,
  isError: PropTypes.bool,
  helperText: PropTypes.string,
};
