<template>
  <div v-show="commonStore.show" class="full-screen-mask">
    <div class="loader-content">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { registEvent } from '@/utils/vscode';
import { useCommonStore } from '@/stores/useCommonStore';
import { onUnmounted } from 'vue';

const commonStore = useCommonStore();

const removeEvt = registEvent<boolean>('SET_LOADING', (show) => {
  commonStore.show = show;
});

onUnmounted(() => removeEvt());
</script>

<style scoped>
.full-screen-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  background-color: var(--vscode-editor-background);
  opacity: 0.9;

  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--vscode-panel-border);
  border-top: 3px solid var(--vscode-button-background);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: var(--vscode-foreground);
  font-size: 13px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
