import { useHomeStore } from "@/stores/homeStore";

export function usePostTags(form: any) {
  const homeStore = useHomeStore();

  const selectedTags = computed(() =>
    homeStore.tags.filter((t) => form.value.tags.includes(t.id)),
  );

  const toggleTag = (id: number) => {
    const idx = form.value.tags.indexOf(id);
    if (idx > -1) form.value.tags.splice(idx, 1);
    else form.value.tags.push(id);
  };

  const removeTag = (id: number) => {
    form.value.tags = form.value.tags.filter((t: number) => t !== id);
  };

  return {
    selectedTags,
    toggleTag,
    removeTag,
  };
}
