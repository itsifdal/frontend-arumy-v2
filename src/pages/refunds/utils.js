import { format } from "date-fns";

export const modelRefund = (data) => {
  if (data) {
    delete data.termPlaceholder;
    return {
      ...data,
      transfer_date: format(data.transfer_date, "yyyy-MM-dd"),
      paketId: data.paketId.value,
      studentId: data.studentId.value,
    };
  }
  return {};
};
