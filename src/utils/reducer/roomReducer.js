export const initialRoomFormState = {
  values: {
    nama_ruang: "",
    lokasi_cabang: "",
  },
  errors: {
    nama_ruang: "",
    lokasi_cabang: "",
  },
};

export function validateRoomForm(values) {
  const errors = {};
  if (!values.nama_ruang) {
    errors.nama_ruang = "Nama ruang is required";
  }
  if (!values.lokasi_cabang) {
    errors.lokasi_cabang = "Lokasi cabang is required";
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
