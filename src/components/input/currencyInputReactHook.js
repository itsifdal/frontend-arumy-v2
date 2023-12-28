import React from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import { NumericFormat } from "react-number-format";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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

const NumericFormatCustom = React.forwardRef((props, ref) => {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
      prefix=""
    />
  );
});

NumericFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const CurrencyInputReactHook = (props) => {
  const { name, rules, control, isError, helperText } = props;
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value } }) => (
        <ThemeProvider theme={newTheme}>
          <TextField
            name={name}
            value={value}
            onChange={onChange}
            helperText={helperText}
            error={isError}
            InputProps={{
              inputComponent: NumericFormatCustom,
            }}
          />
        </ThemeProvider>
      )}
    />
  );
};

CurrencyInputReactHook.propTypes = {
  name: PropTypes.string,
  rules: PropTypes.object,
  control: PropTypes.any,
  isError: PropTypes.bool,
  helperText: PropTypes.string,
};

export default CurrencyInputReactHook;
