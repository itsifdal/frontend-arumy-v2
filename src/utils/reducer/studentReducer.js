export const initialStudentFormState = {
  values: {
    nama_murid: "",
    nama_wali: "",
    nomor_va: "",
    telepon: "",
  },
  errors: {
    nama_murid: "",
    nama_wali: "",
    nomor_va: "",
    telepon: "",
  },
};

export function validateStudentForm(values) {
  const errors = {};
  if (!values.nama_murid) {
    errors.nama_murid = "Nama Murid ruang is required";
  }
  if (!values.nama_wali) {
    errors.nama_wali = "Nama Wali cabang is required";
  }
  if (!values.nomor_va) {
    errors.nomor_va = "Nomor VA cabang is required";
  }
  if (!values.telepon) {
    errors.telepon = "Telepon cabang is required";
  }
  return errors;
}

export function studentFormReducer(state, payload) {
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
            [payload.name]: validateStudentForm(values)[payload.name],
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
      ...initialStudentFormState,
    };
  }
  return state;
}
