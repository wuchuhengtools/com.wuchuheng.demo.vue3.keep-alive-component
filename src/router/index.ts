import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView/Index.vue'
import Page1 from '../views/pages/Page1View.vue'
import Page2 from '../views/pages/Page2View.vue'
import Page3 from '../views/pages/Page3View.vue'
import { defineComponent, h, type Component } from 'vue'

const subpageRoutes: RouteRecordRaw[] = [
  { path: 'page1', name: 'page1', component: Page1 },
  { path: 'page2', name: 'page2', component: Page2 },
  { path: 'page3', name: 'page3', component: Page3 }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: subpageRoutes
      // children: subpageRoutes.map((route) => {
      //   const renamedComponent = defineComponent({
      //     name: `/tmp`,
      //     render() {
      //       return h(route.component as Component)
      //     }
      //   })
      //   return { path: route.path, name: route.name, component: renamedComponent }
      // })
    }
  ]
})

export { subpageRoutes }
export default router
