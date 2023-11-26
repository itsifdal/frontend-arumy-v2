import { toast } from "react-toastify";

export function onSuccessToast(response, callback) {
  toast.success(response.data.message, {
    position: "top-center",
    autoClose: 5000,
    theme: "colored",
  });
  if (callback) callback();
}

export function onErrorToast(error, callback) {
  if (error) {
    toast.error(error.response?.data?.message || "Terjadi kesalahan pada sistem.", {
      position: "top-center",
      autoClose: 5000,
      theme: "colored",
    });
    if (callback) callback();
  }
}
