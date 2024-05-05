export const modelUser = (data) => {
  if (data) {
    return {
      ...data,
      teacherId: data.teacherId.value,
    };
  }
  return {};
};
