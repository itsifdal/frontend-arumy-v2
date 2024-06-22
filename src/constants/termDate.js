const getYear = () => new Date().getFullYear();

const termDateModel = (year) => [
  {
    termYear: year,
    termValue: 1,
    value: `1-${year}`,
    label: `Term 1 - ${year}`,
  },
  {
    termYear: year,
    termValue: 2,
    value: `2-${year}`,
    label: `Term 2 - ${year}`,
  },
  {
    termYear: year,
    termValue: 3,
    value: `3-${year}`,
    label: `Term 3 - ${year}`,
  },
  {
    termYear: year,
    termValue: 4,
    value: `4-${year}`,
    label: `Term 4 - ${year}`,
  },
];
export const termDate = [
  {
    termYear: "",
    termValue: "",
    value: "",
    label: "-- Silahkan pilih term --",
  },
  ...termDateModel(getYear() - 1),
  ...termDateModel(getYear()),
  ...termDateModel(getYear() + 1),
];
