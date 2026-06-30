import type { RouteRecordRaw } from 'vue-router'

const wpRoutes: RouteRecordRaw[] = [
  {
    path: '/posts',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'posts',
        component: () => import('pages/PostsPage.vue'),
      },
    ],
  },
  {
    path: '/schedule',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'schedule',
        component: () => import('pages/SchedulePage.vue'),
      },
    ],
  },
  {
    path: '/page/:slug',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'wp-page',
        component: () => import('pages/WpPage.vue'),
      },
    ],
  },
  {
    path: '/contact',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'contact',
        component: () => import('pages/ContactPage.vue'),
      },
    ],
  },
]

export default wpRoutes
