import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export const toastSuccess = (message: string) => {
  Toastify({
    text: message,
    duration: 4000,
    close: true,
    gravity: "top",
    position: "right",
    backgroundColor: "#16a34a", // green-600
    stopOnFocus: true,
  }).showToast();
};

export const toastError = (message: string) => {
  Toastify({
    text: message,
    duration: 4500,
    close: true,
    gravity: "top",
    position: "right",
    backgroundColor: "#dc2626",
    stopOnFocus: true,
  }).showToast();
};

export const toastWarning = (message: string) => {
  Toastify({
    text: message,
    duration: 4500,
    close: true,
    gravity: "top",
    position: "right",
    backgroundColor: "#f59e0b",
    stopOnFocus: true,
  }).showToast();
};
