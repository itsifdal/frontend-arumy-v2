export const initialUserFormState = {
  values: {
    name: "",
    email: "",
    password: "",
    role: "",
    teacherId: "",
  },
  errors: {
    name: "",
    email: "",
    password: "",
    role: "",
    teacherId: "",
  },
};

export function validateUserForm(values) {
  const errors = {};
  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(values.email)) {
    errors.email = "Email is invalid";
  }
  if (!values.name) {
    errors.name = "Name is required";
  }
  if (!values.password) {
    errors.password = "Password is required";
  }
  if (!values.role) {
    errors.role = "Role is required";
  }
  return errors;
}

export function userFormReducer(state, payload) {
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
            [payload.name]: validateUserForm(values)[payload.name],
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
      ...initialUserFormState,
    };
  }
  return state;
}
