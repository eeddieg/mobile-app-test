import type { RouteRecordRaw } from 'vue-router';
// import wpRoutes from './wpRoutes';

const indexRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'main-home',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', name: "home", component: () => import('pages/IndexPage.vue') }],
  },
  // ...wpRoutes,
  {
    path: '/test',
    name: 'main-test',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', name: "test", component: () => import('pages/WPContentPage.vue') }],
  },
  {
    path: '/:catchAll(.*)*',
    name: 'error',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default indexRoutes;
