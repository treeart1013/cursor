<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue';

const route = useRoute();
const isLoginRoute = computed(() => route.name === 'login');
</script>

<template>
  <div :class="{ 'default-layout': !isLoginRoute }">
    <RouterView />
  </div>
</template>

<style scoped>
.default-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
