import { format } from "date-fns";

export const modelPayment = (data) => {
  if (data) {
    delete data.termPlaceholder;
    return {
      ...data,
      tgl_bayar: format(data.tgl_bayar, "yyyy-MM-dd"),
      paketId: data.paketId.value,
      studentId: data.studentId.value,
    };
  }
  return {};
};
