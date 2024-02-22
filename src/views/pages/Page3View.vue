<script setup lang="ts">
import { onUnmounted, ref } from 'vue'

const count = ref(0)
const timer = setInterval(() => {
  count.value++
}, 1000)
// To avoid memory leaks, clear the interval when the component is unmounted
onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div>
    <h1>Page 3</h1>
    <p>Run time: {{ count }}</p>
  </div>
</template>

<style scoped></style>
