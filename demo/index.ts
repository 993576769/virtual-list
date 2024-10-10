import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App';
import Demo1 from './demo-1.vue';
import Demo2 from './demo-2.vue';

const routes = [
  {
    path: '/demo-1',
    component: Demo1,
  },
  {
    path: '/demo-2',
    component: Demo2,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const app = createApp(App);

app.use(router);

app.mount('#app');
