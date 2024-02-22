<script setup lang="ts">
import Nav from './Nav.vue'
import Header from './Header.vue'
import { ref, watch, type Ref, h, type Component, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { subpageRoutes, subpagePrefixPath } from '@/router'

const openedPaths: Ref<string[]> = ref([])
// To store the component that has been rendered.
const cacheTabs: Map<string, Component> = new Map()
// To store the name of the keep-alive component.
const keepAliveNames: Ref<string[]> = ref([])
const activePath: Ref<string> = ref('')

// Add a listener to listen to the route change, and then add the new tab to the openedTabs array, and set the activeTabIndex to the new tab index
const route = useRoute()
watch(route, (to) => {
  const hasOpenedTab = openedPaths.value.find((tab) => tab === to.path)
  if (!hasOpenedTab) {
    const { path, component: newComponent } = subpageRoutes.find(
      (page) => `${subpagePrefixPath}${page.path}` === to.path
    )!
    const newPath = `${subpagePrefixPath}${path}`
    openedPaths.value = [...openedPaths.value, newPath]
    // Cache a new tab.
    const cachedCompoent = defineComponent({
      name: newPath,
      render() {
        return h(newComponent as Component)
      }
    })
    cacheTabs.set(newPath, cachedCompoent)
    keepAliveNames.value.push(newPath)
    activePath.value = newPath
  } else {
    // If the tab has been opened, set the activeName to the tab name.
    const tab = openedPaths.value.find((tab) => tab === to.path)!
    activePath.value = tab
  }
})
const onActiveTab = (index: number) => {
  throw new Error('Not implemented')
}
const onCloseTab = (index: number) => {
  throw new Error('Not implemented')
}
</script>
<template>
  <main>
    <Header :opendedPathList="openedPaths" @onActive="onActiveTab" @onClose="onCloseTab" />
    <div id="wrap">
      <Nav />
      <div>
        <KeepAlive :include="keepAliveNames" v-if="keepAliveNames.length > 0">
          <component :is="cacheTabs.get(activePath)" />
        </KeepAlive>
      </div>
    </div>
  </main>
</template>

<style scoped>
#wrap {
  display: flex;
  flex-direction: row;
  height: 100vh;
}
</style>
