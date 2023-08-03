import React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import id from "date-fns/locale/id";
import { FormHelperText, FormControl } from "@mui/material";

import PropTypes from "prop-types";

import InputBasic from "./inputBasic";

export default function TimeInputBasic(props) {
  const { onChange, name, required, errorMessage, error } = props;
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={id}>
      <FormControl error={error} fullWidth>
        <TimePicker
          {...props}
          onChange={(value) => {
            onChange({ target: { name, value } });
          }}
          renderInput={(params) => <InputBasic {...params} required={required} />}
        />
        {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
      </FormControl>
    </LocalizationProvider>
  );
}

TimeInputBasic.propTypes = {
  onChange: PropTypes.func,
  required: PropTypes.bool,
  error: PropTypes.bool,
  name: PropTypes.string,
  errorMessage: PropTypes.string,
};
