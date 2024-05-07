import { cleanQuery } from "../../utils/cleanQuery";

export const modelUser = (data) => {
  if (data) {
    return cleanQuery({
      ...data,
      teacherId: data.teacherId?.value || null,
    });
  }
  return {};
};
