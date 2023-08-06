import React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import id from "date-fns/locale/id";

import PropTypes from "prop-types";

import InputBasic from "./inputBasic";

export default function DateInputBasic(props) {
  const { onChange, name, required, disableValidation } = props;
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={id}>
      <DatePicker
        {...props}
        inputFormat="dd/MM/yyyy"
        onChange={(value) => {
          onChange({ target: { name, value } });
        }}
        renderInput={(params) => <InputBasic {...params} error={!disableValidation} required={required} />}
      />
    </LocalizationProvider>
  );
}

DateInputBasic.propTypes = {
  onChange: PropTypes.func,
  required: PropTypes.bool,
  name: PropTypes.string,
  disableValidation: PropTypes.bool,
};
