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
    path: '/news',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'news',
        component: () => import('pages/PostsPage.vue'),
        props: {
          title:        'ΝΕΑ-ΑΝΑΚΟΙΝΩΣΕΙΣ',
          categorySlug: 'νέα-ανακοινώσεις',        }
      }
    ]
  },
  {
    path: '/arthra',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'arthra',
        component: () => import('pages/PostsPage.vue'),
        props: () => ({
          title:        'ΕΠΙΣΤΗΜΟΝΙΚΑ ΑΡΘΡΑ',
          categorySlug: 'επιστημονικά-άρθρα',
        })
      }
    ]
  },
  {
    path: '/videos',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'videos',
        component: () => import('pages/VideosPage.vue'),
      }
    ]
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
