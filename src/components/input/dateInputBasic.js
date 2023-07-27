import React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import PropTypes from "prop-types";

import InputBasic from "./inputBasic";

export default function DateInputBasic(props) {
  const { onChange, name } = props;
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        {...props}
        onChange={(value) => {
          onChange({ target: { name, value } });
        }}
        renderInput={(params) => <InputBasic {...params} />}
      />
    </LocalizationProvider>
  );
}

DateInputBasic.propTypes = {
  onChange: PropTypes.func,
  name: PropTypes.func,
};
