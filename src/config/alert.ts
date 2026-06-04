export const alertConfig = {
  success: {
    class: "bg-white border-emerald-500 text-emerald-500",
    icon: "Msg-Happy",
  },
  error: {
    class: "bg-white border-red-500 text-red-500",
    icon: "Msg-Sad",
  },
  warning: {
    class: "bg-white border-yellow-500 text-yellow-500",
    icon: "Msg-Warn",
  },
  info: {
    class: "bg-white border-sky-500 text-sky-500",
    icon: "Msg-Info",
  },
} as const;
