import VueRouter from 'vue-router';
import axios from 'axios';

import Home from '../components/Home';
import SlideshowConfig from "../components/main-components/SlideshowConfig";
import WifiConfig from "../components/main-components/WifiConfig";
import License from "../components/main-components/License";
import Authorizing from "../components/Authorizing"

const routes = [
  { path: '', name: 'Home', component: Home, meta: { requiresAuth: true }},
  { path: '/config', name: 'Config', component: SlideshowConfig, meta: { requiresAuth: true }},
  { path: '/wifi', name: 'Wifi', component: WifiConfig, meta: { requiresAuth: true }},
  { path: '/license', name: 'License', component: License, meta: { requiresAuth: true }},
  { path: '/authorize', name: 'Authorizing', component: Authorizing }
];

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const isAuthorized = !!localStorage.getItem('isAuthorized');
    if (isAuthorized) next();
    else next({
      path: '/authorize',
      query: { redirect: to.fullPath }
    });
  } else {
    next();
  }
});

export default router;