import React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import id from "date-fns/locale/id";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { TextField } from "@mui/material";

const newTheme = (theme) =>
  createTheme({
    ...theme,
    components: {
      MuiInputBase: {
        styleOverrides: {
          input: { fontSize: "12px" },
          root: { "&.MuiOutlinedInput-root": { borderRadius: "15px" } },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: "rgba(115, 125, 170, 0.70)",
          },
        },
      },
    },
  });

export default function DateInputReactHook(props) {
  const { name, rules, control, isError, helperText } = props;
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value = "" } }) => (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={id}>
          <DatePicker
            inputFormat="dd/MM/yyyy"
            value={value}
            onChange={(value) => {
              onChange(value);
            }}
            renderInput={(props) => (
              <ThemeProvider theme={newTheme}>
                <TextField {...props} helperText={helperText} error={isError} />
              </ThemeProvider>
            )}
          />
        </LocalizationProvider>
      )}
    />
  );
}

DateInputReactHook.propTypes = {
  name: PropTypes.string,
  rules: PropTypes.object,
  control: PropTypes.any,
  isError: PropTypes.bool,
  helperText: PropTypes.string,
};
