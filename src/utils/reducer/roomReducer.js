export const initialRoomFormState = {
  values: {
    nama_ruang: "",
    cabangId: "",
  },
  errors: {
    nama_ruang: "",
    cabangId: "",
  },
};

export function validateRoomForm(values) {
  const errors = {};
  if (!values.nama_ruang) {
    errors.nama_ruang = "Nama ruang is required";
  }
  if (!values.cabangId) {
    errors.cabangId = "Cabang is required";
  }
  return errors;
}

export function roomFormReducer(state, payload) {
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
            [payload.name]: validateRoomForm(values)[payload.name],
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
      ...initialRoomFormState,
    };
  }
  return state;
}
