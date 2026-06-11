import { computed, ref } from "vue";

export type Tag = {
  id: number;
  name: string;
};

export function usePostTags(form: any) {
  const allTags = ref<Tag[]>([
    { id: 1, name: "Vue" },
    { id: 2, name: "Java" },
    { id: 3, name: "Spring" },
    { id: 4, name: "TypeScript" },
    { id: 5, name: "Docker" },
  ]);

  const selectedTags = computed(() =>
    allTags.value.filter((t) => form.value.tags.includes(t.id)),
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
    allTags,
    selectedTags,
    toggleTag,
    removeTag,
  };
}
