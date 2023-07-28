import React from "react";
import { Autocomplete } from "@mui/material";
import PropTypes from "prop-types";

import InputBasic from "./inputBasic";

export default function AutoCompleteInputBasic(props) {
  const { label, required, error, errorMessage, name, onChange, ...otherProps } = props;
  return (
    <Autocomplete
      {...otherProps}
      ChipProps={{ size: "small" }}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      onChange={(_, value) => {
        onChange({ target: { name, value } });
      }}
      renderInput={(params) => (
        <InputBasic {...params} label={label} required={required} error={error} errorMessage={errorMessage} />
      )}
    />
  );
}

AutoCompleteInputBasic.propTypes = {
  label: PropTypes.string,
  name: PropTypes.any,
  required: PropTypes.bool,
  error: PropTypes.bool,
  onChange: PropTypes.func,
  errorMessage: PropTypes.string,
};
