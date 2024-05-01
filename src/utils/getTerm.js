import { isWithinInterval } from "date-fns";

export const getTerm = (date) => {
  const toDate = new Date(date);
  return Math.floor(toDate.getMonth() / 3);
};

export const getTermByDate = (date) => {
  const pureDate = new Date(date);
  const thisYear = pureDate.getFullYear();
  let returnTerm = 1;

  const theInterval = [
    { start: new Date(`${thisYear - 1}-12-25`), end: new Date(`${thisYear}-3-24`) },
    { start: new Date(`${thisYear}-3-25`), end: new Date(`${thisYear}-6-24`) },
    { start: new Date(`${thisYear}-6-25`), end: new Date(`${thisYear}-9-24`) },
    { start: new Date(`${thisYear}-9-25`), end: new Date(`${thisYear}-12-24`) },
  ];

  for (let i = 0; i < theInterval.length; i += 1) {
    if (
      isWithinInterval(pureDate, {
        start: theInterval[i].start,
        end: theInterval[i].end,
      })
    ) {
      returnTerm = i + 1;
    }
  }

  return returnTerm;
};
