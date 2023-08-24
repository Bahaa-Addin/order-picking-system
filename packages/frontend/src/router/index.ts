// Composables
import { createRouter, createWebHistory } from 'vue-router'

// redirect the base url to the first line picker
const routes = [
  {
    path: '/',
    redirect: '/first-line-picker',
  },
  {
    path: '/first-line-picker',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'FIRST_LINE',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/components/Orders.vue'),
      },
    ],
  },
  {
    path: '/second-line-picker',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'SECOND_LINE',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/components/Orders.vue'),
      },
    ],
  },
  {
    path: '/items',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'ITEMS',
        component: () => import(/* webpackChunkName: "home" */ '@/components/Items.vue'),
      },
      {
        path: ':activeOrderId',
        name: 'PICK_ITEMS',
        component: () => import(/* webpackChunkName: "home" */ '@/components/Items.vue'),
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
