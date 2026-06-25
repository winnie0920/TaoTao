export type Rule = (value: any) => true | string;

export type Field = {
  type: "input" | "textarea" | "select";
  name: string;
  label: string;
  placeholder?: string;
  options?: { id: number; key: string; name: string }[];
  rules?: Rule[];
  col?: 1 | 2;
};

export type UploadImage = {
  file: File;
  preview?: string;
};
