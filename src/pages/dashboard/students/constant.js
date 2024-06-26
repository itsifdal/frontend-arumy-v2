import { getTerm } from "../../../utils/getTerm";

export const initQuery = {
  sort: "DESC",
  sort_by: "privateQuotaLeft",
  term: getTerm(new Date()) + 1,
  termYear: new Date().getFullYear(),
};
