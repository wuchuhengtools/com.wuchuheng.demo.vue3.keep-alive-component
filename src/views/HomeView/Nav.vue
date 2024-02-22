<script setup lang="ts">
import { subpageRoutes } from '@/router'
// Add 2 props to the Nav component, tabs and activeIndex
import { RouterLink } from 'vue-router'
</script>
<template>
  <nav>
    <div v-for="page in subpageRoutes" :key="page.name" @click="$router.push(page.path)">
      <RouterLink :to="page.path">
        {{ page.name }}
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>
nav {
  background-color: darkgoldenrod;
  width: 20vh;
}
nav div {
  padding: 1rem;
  border-bottom: 1px solid black;
  cursor: pointer;
}
</style>
