export const initialTeacherFormState = {
  values: {
    nama_pengajar: "",
    telepon: "",
  },
  errors: {
    nama_pengajar: "",
    telepon: "",
  },
};

export function validateTeacherForm(values) {
  const errors = {};
  if (!values.nama_pengajar) {
    errors.nama_pengajar = "Nama Pengajar ruang is required";
  }
  if (!values.telepon) {
    errors.telepon = "Telepon pengajar is required";
  }
  return errors;
}

export function teacherFormReducer(state, payload) {
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
            [payload.name]: validateTeacherForm(values)[payload.name],
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
      ...initialTeacherFormState,
    };
  }
  return state;
}
