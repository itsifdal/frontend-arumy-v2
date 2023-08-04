import React from "react";
import { Autocomplete, CircularProgress, FormControl, InputLabel } from "@mui/material";
import PropTypes from "prop-types";

import { CustomTextField } from "./inputBasic";

export default function AutoCompleteBasic(props) {
  const { isLoading, id, label, required, error, errorMessage, ...otherProps } = props;
  return (
    <Autocomplete
      {...otherProps}
      isOptionEqualToValue={(option, value) => option.label === value.label}
      getOptionLabel={(option) => option.label}
      renderInput={(params) => (
        <FormControl fullWidth>
          <InputLabel
            htmlFor={id}
            sx={{ position: "relative", transform: "none", fontSize: "12px", fontWeight: "bold", marginBottom: "5px" }}
          >
            {String(label).toUpperCase()}
            {required && "*"}
          </InputLabel>
          <CustomTextField
            error={error}
            helperText={errorMessage}
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
        </FormControl>
      )}
    />
  );
}

AutoCompleteBasic.propTypes = {
  isLoading: PropTypes.bool,
  required: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
};
