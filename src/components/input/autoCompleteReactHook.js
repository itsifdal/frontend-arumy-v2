import React, { useState } from "react";
import { Autocomplete } from "@mui/material";
import PropTypes from "prop-types";

import { Controller } from "react-hook-form";
import { CustomTextField } from "./inputBasic";

export default function AutoCompleteReactHook(props) {
  const [open, setOpen] = useState(false);
  const { name, rules, control, options, loading, isError, onChangeCallback, helperText, multiple = false } = props;
  const isLoading = open && options.length === 0 && loading;

  const setSelected = (selected) => {
    if (multiple) {
      return selected ? options.filter((option) => selected.find((select) => option.value === select.value)) : [];
    }
    return selected ? options.find((option) => option.value === selected.value) : null;
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value } }) => (
        <Autocomplete
          multiple={multiple}
          ChipProps={{ size: "small" }}
          open={open}
          value={setSelected(value)}
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
            onChange(newValue);
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
  multiple: PropTypes.bool,
};
