import React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import id from "date-fns/locale/id";

import PropTypes from "prop-types";

import InputBasic from "./inputBasic";

export default function TimeInputBasic(props) {
  const { onChange, name, required } = props;
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={id}>
      <TimePicker
        {...props}
        onChange={(value) => {
          onChange({ target: { name, value } });
        }}
        renderInput={(params) => <InputBasic {...params} required={required} />}
      />
    </LocalizationProvider>
  );
}

TimeInputBasic.propTypes = {
  onChange: PropTypes.func,
  required: PropTypes.bool,
  name: PropTypes.string,
};
