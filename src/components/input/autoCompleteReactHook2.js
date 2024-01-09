import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";

import { CustomTextField } from "./inputBasic";

export default function ControllableStates(props) {
  const [open, setOpen] = React.useState(false);
  const { options, loading, name, control, rules, value } = props;
  const isLoading = open && options.length === 0 && loading;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange } }) => (
        <div>
          <div>{`value: ${value !== null ? `'${value}'` : "null"}`}</div>
          <br />
          <Autocomplete
            open={open}
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
            }}
            value={value}
            onChange={(_, newValue) => {
              console.log("ew", newValue);
              if (newValue) {
                onChange(newValue?.value);
                // onChangeCallback(newValue);
              }
            }}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            getOptionLabel={(option) => option.label}
            options={options}
            loading={isLoading}
            renderInput={(params) => (
              <CustomTextField
                {...params}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </div>
      )}
    />
  );
}

ControllableStates.propTypes = {
  name: PropTypes.string,
  rules: PropTypes.object,
  control: PropTypes.any,
  value: PropTypes.object,
  options: PropTypes.array,
  loading: PropTypes.bool,
  onChangeCallback: PropTypes.func,
  isError: PropTypes.bool,
  helperText: PropTypes.string,
};
