import { createMemoryHistory, createRouter } from 'vue-router';
import { vscode } from '@/utils/vscode';

const router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'welcome',
      path: '/welcome',
      component: () => import('@/views/TheWelcome.vue'),
    },
    {
      path: '/',
      component: () => import('@/layout/MainLaylout.vue'),
      children: [
        { path: '', redirect: '/list' },
        {
          path: 'list',
          component: () => import('@/views/JiraList.vue'),
        },
        {
          path: 'issue',
          component: () => import('@/views/IssueInfo.vue'),
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const hasToken = vscode.getState('hasToken');
  if (to.name !== 'welcome' && !hasToken) {
    next('/welcome');
    return false;
  }

  next();
});

export default router;
