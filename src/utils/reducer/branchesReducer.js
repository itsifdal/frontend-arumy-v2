export const initialBranchFormState = {
  values: {
    nama_cabang: "",
  },
  errors: {
    nama_cabang: "",
  },
};

export function validateBranchForm(values) {
  const errors = {};
  if (!values.nama_cabang) {
    errors.nama_cabang = "Nama cabang is required";
  }
  return errors;
}

export function branchFormReducer(state, payload) {
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
            [payload.name]: validateBranchForm(values)[payload.name],
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
      ...initialBranchFormState,
    };
  }
  return state;
}
