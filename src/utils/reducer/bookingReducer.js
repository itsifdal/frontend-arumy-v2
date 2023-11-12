import { parse } from "date-fns";

export const initialBookingFormState = {
  values: {
    roomId: { value: "", label: "" },
    teacherId: { value: "", label: "" },
    user_group: [],
    instrumentId: { value: "", label: "" },
    tgl_kelas: new Date(),
    cabang: "",
    jam_booking: parse("09:00", "HH:mm", new Date()),
    jam_selesai_booking: parse("09:45", "HH:mm", new Date()),
    jenis_kelas: "privat",
    durasi: 45,
    status: "",
    notes: "",
  },
  errors: {
    roomId: "",
    teacherId: "",
    user_group: "",
    instrumentId: "",
    tgl_kelas: "",
    cabang: "",
    jam_booking: "",
    jam_selesai_booking: "",
    jenis_kelas: "",
    durasi: "",
    status: "",
    notes: "",
  },
};

export function validateBookingForm(values) {
  const errors = {};
  if (!values.roomId) {
    errors.roomId = "Ruangan wajib diisi";
  }
  if (!values.teacherId) {
    errors.teacherId = "Pengajar wajib diisi";
  }
  if (!values.instrumentId) {
    errors.instrumentId = "Alat musik wajib diisi";
  }
  if (!values.user_group) {
    errors.user_group = "Murid wajib diisi";
  }
  if (!values.tgl_kelas) {
    errors.tgl_kelas = "Tanggal kelas wajib diisi";
  }
  if (!values.jam_booking) {
    errors.jam_booking = "Jam mulai kelas wajib diisi";
  }
  if (!values.jam_selesai_booking) {
    errors.jam_selesai_booking = "Jam selesai kelas wajib diisi";
  }
  if (!values.jenis_kelas) {
    errors.jenis_kelas = "Jenis kelas wajib diisi";
  }
  if (values.jenis_kelas === "group" && values.user_group?.length < 2) {
    errors.user_group = "Kelas group minimal 2 murid";
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
