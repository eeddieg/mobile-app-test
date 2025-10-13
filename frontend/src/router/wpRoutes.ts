import type { RouteRecordRaw } from 'vue-router';

const wpRoutes: RouteRecordRaw[] = [
  {
    path: '/test',
    name: 'test',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/WPContentPage.vue') }],
  },

];

export default wpRoutes;
