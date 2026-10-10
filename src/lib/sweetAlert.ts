/** SweetAlert handling — one place to phrase every user-facing alert. */
import { Messages } from "./config";

/**
 * Loaded on first use rather than with the page: it is one of the biggest
 * pieces of the shop's first download, and most visits never show an alert.
 * Fetched quietly once the page is idle, so the first alert is still instant.
 */
const loadSwal = () => import("sweetalert2").then((module) => module.default);

const warmUp = () => void loadSwal();
if ("requestIdleCallback" in window) window.requestIdleCallback(warmUp);
else setTimeout(warmUp, 3000);

export const sweetErrorHandling = async (err: any) => {
  // Axios wraps the server's body in `response.data`; a thrown Error has none.
  const error = err.response?.data ?? err;
  const message = error?.message ?? Messages.error1;
  const Swal = await loadSwal();
  await Swal.fire({
    icon: "error",
    text: message,
    showConfirmButton: false,
  });
};

export const sweetTopSuccessAlert = async (
  msg: string,
  duration: number = 2000,
) => {
  const Swal = await loadSwal();
  await Swal.fire({
    position: "top-end",
    icon: "success",
    title: msg,
    showConfirmButton: false,
    timer: duration,
  });
};

export const sweetTopSmallSuccessAlert = async (
  msg: string,
  duration: number = 2000,
) => {
  const Swal = await loadSwal();
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: duration,
    timerProgressBar: true,
  });

  Toast.fire({ icon: "success", title: msg }).then();
};

export const sweetFailureProvider = async (
  msg: string,
  show_button: boolean = false,
  forward_url: string = "",
) => {
  const Swal = await loadSwal();
  Swal.fire({
    icon: "error",
    title: msg,
    showConfirmButton: show_button,
    confirmButtonText: "OK",
  }).then(() => {
    if (forward_url !== "") {
      window.location.replace(forward_url);
    }
  });
};
