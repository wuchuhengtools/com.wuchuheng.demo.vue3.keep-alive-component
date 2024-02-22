<script setup lang="ts">
import Nav from './Nav.vue'
import Header from './Header.vue'
import { ref, watch, type Ref, h, type Component, defineComponent, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { subpageRoutes, subpagePrefixPath } from '@/router'

const openedPaths: Ref<string[]> = ref([])
// To store the component that has been rendered.
const cacheTabs: Map<string, Component> = new Map()
// To store the name of the keep-alive component.
const keepAliveNames: Ref<string[]> = ref([])
const activePath: Ref<string> = ref('')

// Add a listener to listen to the route change, and then add the new tab to the openedPaths array, and set the opendedPath.
const route = useRoute()
watch(route, (to) => {
  console.log(`route change to ${to.path}`)

  const hasOpenedTab = openedPaths.value.find((tab) => tab === to.path)
  if (!hasOpenedTab) {
    const { path, component: newComponent } = subpageRoutes.find(
      (page) => `${subpagePrefixPath}${page.path}` === to.path
    )!
    const newPath = `${subpagePrefixPath}${path}`
    openedPaths.value = [...openedPaths.value, newPath]
    // Create a new component with the specified name to keep the component alive.
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
    // If the tab has been opened, set the activePath to the current path.
    const tab = openedPaths.value.find((tab) => tab === to.path)!
    activePath.value = tab
  }
})
const router = useRouter()
const onActiveTab = (path: string) => {
  console.log('onActiveTab', path)
  router.push(path)
}
const onCloseTab = (path: string) => {
  console.log('onCloseTab', path)
  openedPaths.value = openedPaths.value.filter((tab) => tab !== path)
  if (activePath.value === path) {
    // Close the current tab, and then open a new tab from the openedPaths array or open the home page.
    if (openedPaths.value.length > 0) {
      const newPath = openedPaths.value[openedPaths.value.length - 1]
      router.push(newPath)
    } else {
      const homePath = '/'
      router.push(homePath)
    }
  }
  console.log('openedPaths', openedPaths.value)
}

onMounted(() => {
  // If the openedPaths array is empty and the current path is subpage path, add the current path to the openedPaths array.
  const currentPath = route.path
  const isOpend = openedPaths.value.find((tab) => tab === currentPath)
  const isSubpage = subpageRoutes.find((page) => `${subpagePrefixPath}${page.path}` === currentPath)
  if (isSubpage && !isOpend) {
    openedPaths.value = [...openedPaths.value, currentPath]
    // Create a new component with the specified name to keep the component alive.
    const { component: newComponent } = subpageRoutes.find(
      (page) => `${subpagePrefixPath}${page.path}` === currentPath
    )!
    const cachedCompoent = defineComponent({
      name: currentPath,
      render() {
        return h(newComponent as Component)
      }
    })
    cacheTabs.set(currentPath, cachedCompoent)
    keepAliveNames.value.push(currentPath)
    activePath.value = currentPath
  }
})
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
