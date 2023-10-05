export const bookingStatus = [
  {
    value: "",
    label: "Semua Status",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "kadaluarsa",
    label: "Kadaluarsa",
  },
  {
    value: "ijin",
    label: "Ijin",
  },
  {
    value: "batal",
    label: "Hangus",
  },
  {
    value: "konfirmasi",
    label: "Masuk",
  },
];

export const bookingStatusObj = {
  pending: {
    value: "pending",
    label: "Pending",
    color: "warning",
  },
  kadaluarsa: {
    value: "kadaluarsa",
    label: "Kadaluarsa",
    color: "secondary",
  },
  ijin: {
    value: "ijin",
    label: "Ijin",
    color: "primary",
  },
  batal: {
    value: "batal",
    label: "Hangus",
    color: "error",
  },
  konfirmasi: {
    value: "konfirmasi",
    label: "Masuk",
    color: "success",
  },
};
