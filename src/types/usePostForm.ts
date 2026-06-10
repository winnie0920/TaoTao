import { isRequired, minLength, validate } from "@/utils/validators";

export function usePostForm() {
  const form = ref({
    title: "",
    content: "",
    country: "",
    category: "",
    tags: [] as number[],
  });

  const rules = {
    title: [isRequired("標題必填")],
    content: [isRequired("內容必填"), minLength(10, "內容至少10字")],
    country: [isRequired("請選國家")],
    category: [isRequired("請選分類")],
  };

  const submitValidate = () => {
    const errors = validate(form.value, rules);
    if (errors) {
      return Object.values(errors).join("\n");
    }
    return null;
  };

  return {
    form,
    rules,
    submitValidate,
  };
}
