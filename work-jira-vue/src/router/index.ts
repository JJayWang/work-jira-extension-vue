import { createMemoryHistory, createRouter } from 'vue-router';

const router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layout/MainLaylout.vue'),
      children: [
        { path: '', redirect: '/list' },
        {
          path: 'list',
          component: () => import('@/views/JiraList.vue'),
        },
      ],
    },
  ],
});

export default router;
