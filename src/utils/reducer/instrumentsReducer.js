export const initialInstrumentFormState = {
  values: {
    nama_instrument: "",
  },
  errors: {
    nama_instrument: "",
  },
};

export function validateInstrumentForm(values) {
  const errors = {};
  if (!values.nama_instrument) {
    errors.nama_instrument = "Nama instrument is required";
  }
  return errors;
}

export function instrumentFormReducer(state, payload) {
  if (payload.type === "change-field") {
    const values = {
      ...state.values,
      [payload.name]: payload.value,
    };
    return {
      ...state,
      values,
      errors: payload.isEnableValidate
        ? {
            ...state.errors,
            [payload.name]: validateInstrumentForm(values)[payload.name],
          }
        : state.errors,
    };
  }
  if (payload.type === "change-error") {
    return {
      ...state,
      errors: payload.value,
    };
  }
  if (payload.type === "reset-field") {
    return {
      ...initialInstrumentFormState,
    };
  }
  return state;
}
