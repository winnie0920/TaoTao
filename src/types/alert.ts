export type Button = {
  name: string;
  style: string;
  cb: (() => void) | null;
};

export type ConfirmData = {
  title: string;
  content: string;
  buttons: Button[];
};

export type Message = {
  type: "success" | "error" | "warning" | "info";
  class: string;
  icon: string;
  msg: string;
  time: number;
};
