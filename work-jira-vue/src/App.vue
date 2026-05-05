<template>
  <div class="container">
    <RouterView />
  </div>
  <LoadingOverlay></LoadingOverlay>
</template>

<script setup lang="ts">
import LoadingOverlay from './components/LoadingOverlay.vue';
</script>

<style scoped lang="scss">
.container {
  padding: 0 4px;
}
</style>
