<template>
  <div>
    <div class="jira-list-header">工作清單：{{ jiraList.length }}筆</div>
    <div class="jira-list-container">
      <div v-for="item in jiraList" :key="item.key" class="jira-item">
        <div>
          <div class="key">{{ item.key }}</div>
          <div class="name">{{ item.name }}</div>
          <span class="status">
            {{ item.status.name }}
          </span>
        </div>
        <span class="codicon codicon-gear"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onMounted } from 'vue';
import { vscode, registEvent } from '@/utils/vscode';
import type { IssueStateType } from '@/types/VSCodeState';

const jiraList = ref<IssueStateType[]>(vscode.getState()?.issues || []);

const removeEvt = registEvent<IssueStateType[]>('SET_ISSUES', (data) => {
  vscode.setState('issues', data);
  jiraList.value = vscode.getState().issues;
});

onMounted(() => {
  jiraList.value = vscode.getState().issues;
});

onUnmounted(() => removeEvt());
</script>

<style scoped lang="scss">
.jira-list-header {
  padding: 0 10px 3px;
  font-size: 14px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: var(--vscode-sideBarSectionHeader-background);
  z-index: 1;
  box-shadow: 0 2px 5px #0003;
}

.jira-list-container {
  margin-top: 25px;

  .jira-item {
    padding: 10px 8px 10px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
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
