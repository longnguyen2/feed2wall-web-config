import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../components/Home';
import SlideshowConfig from "../components/SlideshowConfig";
import WifiConfig from "../components/WifiConfig";
import License from "../components/License";

const routes = [
  { path: '', name: 'Home', component: Home },
  { path: '/config', name: 'Config', component: SlideshowConfig },
  { path: '/wifi', name: 'Wifi', component: WifiConfig },
  { path: '/license', name: 'License', component: License }
];

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes
});

export default router;