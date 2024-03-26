import React from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const newTheme = (theme) =>
  createTheme({
    ...theme,
    components: {
      MuiInputBase: {
        styleOverrides: {
          input: { fontSize: "12px" },
          root: {
            select: { lineHeight: "1" },
            "&.MuiOutlinedInput-root": { borderRadius: "15px" },
          },
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

export default function SelectReactHook(props) {
  const { name, rules, control, isError, helperText, options, onChangeCallback } = props;
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value } }) => (
        <ThemeProvider theme={newTheme}>
          <TextField
            select
            value={value}
            error={isError}
            SelectProps={{
              native: true,
            }}
            helperText={helperText}
            onChange={(v) => {
              onChange(v.target.value);
              if (onChangeCallback) {
                onChangeCallback(v.target.value);
              }
            }}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        </ThemeProvider>
      )}
    />
  );
}

SelectReactHook.propTypes = {
  name: PropTypes.string,
  rules: PropTypes.object,
  control: PropTypes.any,
  isError: PropTypes.bool,
  helperText: PropTypes.string,
  options: PropTypes.array,
  onChangeCallback: PropTypes.func,
};
