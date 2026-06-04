import type { RouteRecordRaw } from 'vue-router';

const wpRoutes: RouteRecordRaw[] = [
  {
    path: '/schedule',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'schedule',
        component: () => import('pages/SchedulePage.vue')
      }
    ]
  },

];

export default wpRoutes;
