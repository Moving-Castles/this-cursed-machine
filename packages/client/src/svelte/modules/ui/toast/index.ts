import { writable, get } from "svelte/store";

export type ToastType = "warning" | "error"

export interface Toast {
  type: ToastType
  message: HTMLElement | string
  timestamp: DOMHighResTimeStamp
  disappear?: boolean
}

export const toasts = writable([] as Toast[])

export function toastMessage(message: string, toastOptions?: { type?: ToastType, disappear?: boolean }) {
  const toast: Toast = {
    message,
    type: toastOptions?.type || "warning",
    timestamp: performance.now(),
    disappear: toastOptions?.disappear || true
  }
  toasts.set([...get(toasts), toast])
}