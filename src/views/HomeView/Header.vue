<script setup lang="ts">
import { subpagePrefixPath, subpageRoutes } from '@/router'
import { defineProps, defineEmits, reactive, watch, ref } from 'vue'
import { useRoute, type RouteRecordRaw } from 'vue-router'

type TabType = {
  path: string
  name: string
}

const props = defineProps({
  opendedPathList: {
    type: Array as () => string[],
    required: true
  }
})

const tabs = ref<TabType[]>([])
const pathMapRoute: Map<string, RouteRecordRaw> = new Map()
subpageRoutes.forEach((route) => pathMapRoute.set(`${subpagePrefixPath}${route.path}`, route))

watch(
  () => props.opendedPathList,
  (opendedPathList) => {
    console.log('opendedPathList', opendedPathList)
    const newTabs: TabType[] = []
    opendedPathList.forEach((path) => {
      if (pathMapRoute.has(path)) {
        const route = pathMapRoute.get(path)!
        newTabs.push({ path, name: route.name as string })
      }
      tabs.value = newTabs
    })
  },
  { immediate: true }
)

// Listen the router change, and then get the new path to set the active tab.
const activePath = ref('')
const route = useRoute()
watch(route, (to) => {
  activePath.value = to.path
})

const emit = defineEmits<{
  (event: 'onActive', message: number): void
  (event: 'onClose', message: number): void
}>()

const onCloseTab = (path: string) => {
  throw new Error('Not implemented')
  // const index = props.tabs.findIndex((tab) => tab.path === path)
  // emit('onClose', index)
}

const onActive = (path: string) => {
  throw new Error('Not implemented')
  // const index = props.tabs.findIndex((tab) => tab.path === path)
  // emit('onActive', index)
}
</script>

<template>
  <header>
    <div
      v-for="tab in tabs"
      :key="tab.path"
      @click="onActive(tab.path)"
      :class="['tab', { active: tab.path === activePath }]"
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
