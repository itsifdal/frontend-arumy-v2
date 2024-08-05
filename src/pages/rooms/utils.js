import { cleanQuery } from "../../utils/cleanQuery";

export const modelRoom = (data) => {
  if (data) {
    return cleanQuery({
      ...data,
      cabangId: data.cabangId?.value || null,
    });
  }
  return {};
};
