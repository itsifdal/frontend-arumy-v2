import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import PropTypes from "prop-types";

import { CustomTextField } from "./inputBasic";

export const AutoCompleteReactHook1 = React.forwardRef((props, ref) => {
  const { options = [], loading, defaultValues, ...otherProps } = props;
  delete otherProps.value;
  const [open, setOpen] = React.useState(false);
  const isLoading = open && options.length === 0 && loading;

  return (
    <Autocomplete
      ref={ref}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      getOptionLabel={(option) => option.label}
      options={options}
      loading={isLoading}
      defaultValue={options.find((option) => option.value === defaultValues)}
      renderInput={(params) => (
        <CustomTextField
          {...otherProps}
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
  );
});

AutoCompleteReactHook1.propTypes = {
  options: PropTypes.array,
  loading: PropTypes.bool,
  defaultValues: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default AutoCompleteReactHook1;
