<template>
  <div>{{ $route.params.id }}</div>
  {{ issue }}
  <button class="vscode-btn-style" @click="$router.push('/list')">回列表</button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { vscode } from '@/utils/vscode';

const issue = ref({});

onMounted(() => {
  issue.value = vscode.getState('issue');
  // vscode.postMessage({ type: 'test' });
});

onUnmounted(() => vscode.setState('issue', {}));
</script>

<style scoped lang="scss"></style>
