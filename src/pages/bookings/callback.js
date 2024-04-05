import { toast } from "react-toastify";

export const onSuccessToast = (response, callback) => {
  toast.success(response.data.message, {
    position: "top-center",
    autoClose: 5000,
    theme: "colored",
  });
  if (callback) callback();
};

export const onErrorToast = (error, callback) => {
  if (error) {
    toast.error(error.response?.data?.message || "Booking Error", {
      position: "top-center",
      autoClose: 5000,
      theme: "colored",
    });
    if (callback) callback();
  }
};
