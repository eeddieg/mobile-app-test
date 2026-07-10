import type { RouteRecordRaw } from 'vue-router'
import wpRoutes from './wpRoutes'

const indexRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: 'posts' },
  },
  ...wpRoutes,
  {
    path: '/:catchAll(.*)*',
    name: 'error',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default indexRoutes
