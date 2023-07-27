export const initialBookingFormState = {
  values: {
    roomId: "",
    teacherId: "",
    user_group: "",
    instrumentId: "",
    tgl_kelas: "",
    cabang: "",
    jam_booking: "",
    jenis_kelas: "",
    durasi: "",
    status: "pending",
  },
  errors: {
    roomId: "",
    teacherId: "",
    user_group: "",
    instrumentId: "",
    tgl_kelas: "",
    cabang: "",
    jam_booking: "",
    jenis_kelas: "",
    durasi: "",
    status: "",
  },
};

export function validateBookingForm(values) {
  const errors = {};
  if (!values.roomId) {
    errors.roomId = "roomId is required";
  }
  if (!values.teacherId) {
    errors.teacherId = "teacherId is required";
  }
  if (!values.instrumentId) {
    errors.instrumentId = "instrumentId is required";
  }
  if (!values.user_group) {
    errors.user_group = "user_group is required";
  }
  if (!values.tgl_kelas) {
    errors.tgl_kelas = "tgl_kelas is required";
  }
  if (!values.cabang) {
    errors.cabang = "cabang is required";
  }
  if (!values.jam_booking) {
    errors.jam_booking = "jam_booking is required";
  }
  if (!values.jenis_kelas) {
    errors.jenis_kelas = "jenis_kelas is required";
  }
  if (!values.durasi) {
    errors.durasi = "durasi is required";
  }
  if (!values.status) {
    errors.status = "status is required";
  }
  return errors;
}

export function bookingFormReducer(state, payload) {
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
            [payload.name]: validateBookingForm(values)[payload.name],
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
      ...initialBookingFormState,
    };
  }
  return state;
}
