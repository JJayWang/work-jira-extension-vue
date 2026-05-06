<template>
  <h3>尚未設定 Token</h3>
  <button class="vscode-btn-style" @click="onSettingClick">設定 Token</button>
</template>

<script setup lang="ts">
import { vscode } from '@/utils/vscode';

const onSettingClick = () => {
  vscode.postMessage({ type: 'SETTING_TOKEN' });
};
</script>

<style scoped lang="scss"></style>
