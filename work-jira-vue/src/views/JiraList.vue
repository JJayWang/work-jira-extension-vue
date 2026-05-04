<template>
  <div>
    <div
      style="
        padding: 0 10px 3px;
        font-size: 14px;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background-color: var(--vscode-sideBarSectionHeader-background);
        z-index: 1;
        box-shadow: 0 2px 5px #0003;
      "
    >
      工作清單：{{ jiraList.length }}筆
    </div>
    <div class="jira-list-container">
      <div v-for="item in jiraList" :key="item.key" class="jira-item">
        <div class="key">{{ item.key }}</div>
        <div class="name">{{ item.name }}</div>
        <span class="status">
          {{ item.status.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { vscode } from '@/utils/vscode';
import type { IssueStateType } from '@/types/VSCodeState';

const jiraList = ref<IssueStateType[]>(vscode.getState()?.issues || []);

window.addEventListener('message', (evt) => {
  const message = evt.data;
  switch (message.type) {
    case 'set-data':
      if (message.value && message.value.length) {
        vscode.setState({ issues: message.value });
        jiraList.value = vscode.getState()?.issues || [];
      }
    default:
      console.log('message trigger');
      break;
  }
});
</script>

<style scoped lang="scss">
.jira-list-container {
  margin-top: 25px;

  .jira-item {
    padding: 10px 8px 10px 12px;
    cursor: default;
    color: var(--vscode-list-inactiveSelectionForeground);

    &:hover {
      background-color: var(--vscode-list-hoverBackground);
      border-color: #fff;
    }

    .key {
      font-size: 10px;
      margin-bottom: 3px;
    }

    .name {
      margin-bottom: 5px;
      font-size: 14px;
    }

    .status {
      font-size: 12px;
      border-radius: 3px;
      padding: 0 4px;
      font-weight: 600;
      color: rgb(238, 209, 43);
      background-color: rgb(83, 63, 4);
    }
  }
}
</style>
