import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useCommonStore = defineStore('commonStore', () => {
  const show = ref(false);
  return { show };
});
