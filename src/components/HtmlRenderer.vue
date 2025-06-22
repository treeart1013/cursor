<template>
  <div class="html-renderer" v-html="htmlContent"></div>
</template>

<script setup lang="ts">
defineProps<{
  htmlContent: string;
}>();
</script>

<style>
/* Scoped style is not used here to allow global-like styling for v-html content */
.html-renderer h1,
.html-renderer h2,
.html-renderer h3 {
  color: var(--color-heading);
  margin-top: 1.5em;
  margin-bottom: 0.8em;
}

.html-renderer p {
  line-height: 1.7;
}

.html-renderer ul,
.html-renderer ol {
  padding-left: 2em;
}

.html-renderer li {
  margin-bottom: 0.5em;
}

.html-renderer pre {
  background-color: #0d1117; /* GitHub-like dark background */
  color: #c9d1d9;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Courier New', Courier, monospace;
}

.html-renderer code {
  font-family: 'Courier New', Courier, monospace;
  background-color: rgba(110, 118, 129, 0.4);
  padding: 0.2em 0.4em;
  border-radius: 4px;
}

.html-renderer pre code {
  background-color: transparent;
  padding: 0;
}

.html-renderer table {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
}

.html-renderer th,
.html-renderer td {
  border: 1px solid var(--color-border);
  padding: 8px 12px;
  text-align: left;
}

.html-renderer th {
  background-color: #2a2a2a;
}
</style> 

<style scoped>
.html-content {
  line-height: 1.4;
}

.html-content :deep(p) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.html-content :deep(h2) {
  font-size: 1.15em;
  font-weight: 600;
  margin-top: 1.2em;
  margin-bottom: 0.5em;
}

.html-content :deep(h3) {
  font-size: 1.1em;
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 0.4em;
}

.html-content :deep(ul),
.html-content :deep(ol) {
  padding-left: 24px;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.html-content :deep(li) {
  margin-bottom: 0.2em;
}

.html-content :deep(code) {
  background-color: rgba(0, 0, 0, 0.2);
  padding: 2px 4px;
  border-radius: 4px;
  font-family: 'Courier New', Courier, monospace;
}

.html-content :deep(pre) {
  background-color: rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 8px;
  overflow-x: auto;
  margin-top: 0.5em;
}

.html-content :deep(pre code) {
  padding: 0;
  background-color: transparent;
}
</style> 