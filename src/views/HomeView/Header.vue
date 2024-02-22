<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { TabType } from './Index.vue'

const props = defineProps({
  tabs: {
    type: Array as () => TabType[],
    required: true
  },
  activeIndex: {
    type: Number,
    required: true
  }
})

const emit = defineEmits<{
  (event: 'onActive', message: number): void
  (event: 'onClose', message: number): void
}>()

const onCloseTab = (path: string) => {
  const index = props.tabs.findIndex((tab) => tab.path === path)
  emit('onClose', index)
}

const onActive = (path: string) => {
  const index = props.tabs.findIndex((tab) => tab.path === path)
  emit('onActive', index)
}
</script>

<template>
  <header>
    <div
      v-for="tab in props.tabs"
      :key="tab.path"
      @click="onActive(tab.path)"
      :class="['tab', { active: props.activeIndex === props.tabs.indexOf(tab) }]"
    >
      <div>
        {{ tab.name }}
      </div>
      <div class="close" @click="onCloseTab(tab.path)">X</div>
    </div>
  </header>
</template>
<style scoped>
header {
  width: 100vw;
  height: 4rem;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  border-bottom: 1px solid black;
  background-color: aliceblue;
}
header div {
  padding: 1rem;
  cursor: pointer;
}

.tab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  border-right: 1px solid black;
}
.active {
  background-color: red;
  color: white;
}
</style>
