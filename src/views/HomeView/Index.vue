<script setup lang="ts">
import Nav from './Nav.vue'
import Header from './Header.vue'
import { ref, watch, type Ref, h, type Component, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { subpageRoutes } from '@/router'

export type TabType = {
  path: string
  name: string
  // vnode: ReturnType<typeof h>
}

const openedTabs: Ref<TabType[]> = ref([])
const activeTabIndex: Ref<number> = ref(0)
// To store the component that has been rendered.
const cacheTabs: Map<string, Component> = new Map()
// To store the name of the keep-alive component.
const keepAliveNames: Ref<string[]> = ref([])
const activeName: Ref<string> = ref('')

// Add a listener to listen to the route change, and then add the new tab to the openedTabs array, and set the activeTabIndex to the new tab index
const route = useRoute()
watch(route, (to) => {
  const hasOpenedTab = openedTabs.value.find((tab) => tab.path === to.path)
  if (!hasOpenedTab) {
    const prefixRoute = '/'
    const subPage = subpageRoutes.find((page) => `${prefixRoute}${page.path}` === to.path)!
    const name = subPage.name as string
    openedTabs.value = [
      ...openedTabs.value,
      {
        path: to.path,
        name
        // vnode: h(subPage.component as Component)
      }
    ]
    // Cache a new tab.
    const cachedCompoent = defineComponent({
      name,
      render() {
        return h(subPage.component as Component)
      }
    })
    cacheTabs.set(name, cachedCompoent)
    keepAliveNames.value.push(name)
    activeName.value = name

    activeTabIndex.value = openedTabs.value.length - 1
  } else {
    // If the tab is already opened, set the activeTabIndex to the tab index
    const tab = openedTabs.value.find((tab) => tab.path === to.path)
    activeName.value = tab!.name
    activeTabIndex.value = openedTabs.value.findIndex((tab) => tab.path === to.path)
  }
})
const onActiveTab = (index: number) => {
  activeTabIndex.value = index
}
const onCloseTab = (index: number) => {
  openedTabs.value.splice(index, 1)
  if (index === activeTabIndex.value) {
    if (openedTabs.value.length === 0) {
      activeTabIndex.value = -1
    } else {
      activeTabIndex.value = openedTabs.value.length - 1
    }
  }
}
// check openedTabs has included that activeTabIndex
</script>
<template>
  <main>
    <Header
      :tabs="openedTabs"
      :activeIndex="activeTabIndex"
      @onActive="onActiveTab"
      @onClose="onCloseTab"
    />
    <div id="wrap">
      <Nav />
      <div>
        <KeepAlive :include="keepAliveNames" v-if="keepAliveNames.length > 0">
          <component :is="cacheTabs.get(activeName)" />
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
