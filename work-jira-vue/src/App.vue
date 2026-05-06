<template>
  <div class="container">
    <RouterView />
  </div>
  <LoadingOverlay></LoadingOverlay>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import LoadingOverlay from './components/LoadingOverlay.vue';
import type { IssueStateType } from './types/VSCodeState';
import { registEvent, vscode } from './utils/vscode';

const router = useRouter();

registEvent<IssueStateType[]>('SET_ISSUES', (data) => {
  vscode.setState('issues', data);
});

registEvent<boolean>('SET_HASTOKEN', (data) => {
  vscode.setState('hasToken', data);
  if (!data) {
    router.push('/welcome');
    vscode.resetState();
  } else {
    router.push('/');
  }
});

registEvent('RESET_STATE', () => {
  vscode.resetState();
});
</script>

<style scoped lang="scss">
.container {
  padding: 0 10px;
}
</style>
