import { format, sub } from "date-fns";

export const initQuery = {
  sort: "DESC",
  sort_by: "privateQuotaLeft",
  dateFrom: format(sub(new Date(), { months: 1 }), "yyyy-MM-dd"),
  dateTo: format(new Date(), "yyyy-MM-dd"),
};
