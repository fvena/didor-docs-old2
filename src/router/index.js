import Vue from 'vue';
import VueRouter from 'vue-router';

// Views
import HomeView from '@/views/Home.view.vue';
import DocsLayout from '@/views/Docs.view.vue';

// Not found route - 404
import NotFoundView from '@/views/NotFound.view.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: {
      name: 'home',
    },
  },

  // Home route
  {
    path: '/home',
    component: HomeView,
    name: 'home',
  },

  // Docs routes
  {
    path: '/:section*',
    name: 'section',
    component: DocsLayout,
  },

  // Routes not found - 404
  {
    path: '/404',
    name: '404',
    component: NotFoundView,
  },
  {
    path: '*',
    redirect: {
      name: '404',
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
