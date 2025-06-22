<template>
  <div class="logo-container">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-icon">
        <path d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H18L22 22V4C22 2.9 21.1 2 20 2Z" fill="#3b82f6"/>
        <circle cx="8.5" cy="10" r="1.5" fill="white"/>
        <circle cx="15.5" cy="10" r="1.5" fill="white"/>
    </svg>
    <span class="logo-text">Chatmon</span>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
}

.logo-icon {
    transform: translateY(-2px);
}

.logo-text {
  font-size: 1.4rem;
  font-weight: bold;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}
</style> 