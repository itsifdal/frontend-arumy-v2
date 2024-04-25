export const getTerm = (date) => {
  const toDate = new Date(date);
  return Math.floor(toDate.getMonth() / 3);
};
