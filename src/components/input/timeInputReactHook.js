import React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import id from "date-fns/locale/id";
import { FormHelperText, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PropTypes from "prop-types";

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

export default function TimeInputReactHook(props) {
  const { name, errorMessage, rules, control, isError, helperText, onChangeCallback } = props;
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value = "" } }) => (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={id}>
          <TimePicker
            value={value}
            onChange={(value) => {
              onChange(value);

              if (onChangeCallback) {
                onChangeCallback(value);
              }
            }}
            renderInput={(props) => (
              <ThemeProvider theme={newTheme}>
                <TextField {...props} helperText={helperText} error={isError} />
              </ThemeProvider>
            )}
          />
          {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
        </LocalizationProvider>
      )}
    />
  );
}

TimeInputReactHook.propTypes = {
  name: PropTypes.string,
  errorMessage: PropTypes.string,
  rules: PropTypes.object,
  control: PropTypes.any,
  isError: PropTypes.bool,
  helperText: PropTypes.string,
  onChangeCallback: PropTypes.func,
};
