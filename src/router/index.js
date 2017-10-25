import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import login from '@/Login'
import userlist from '@/userlist_rebuild'


import baseInfo from '@/components/baseInfo'
import mainSpeak from '@/components/mainSpeak'
import nowSick from '@/components/nowSick'
import oldSick from '@/components/oldSick'
import checkBody from '@/components/checkBody'
import majorCheck from '@/components/majorCheck'
import setting from '@/components/setting'
Vue.use(Router);
Vue.use(VueResource);

export default new Router({
  routes: [
    {
      path:"/",
      redirect:"/home",
    },
    {
      path: '/login', name: 'login', component: login
    },
    {
      path: '/home', name: 'home', component: userlist,
      children: [
        {name: 'baseInfo', path: '/home/baseInfo/', component: baseInfo},
        {name: 'mainSpeak', path: '/home/mainSpeak/', component: mainSpeak},
        {name: 'nowSick', path: '/home/nowSick/', component: nowSick},
        {name: 'oldSick', path: '/home/oldSick/', component: oldSick},
        {name: 'checkBody', path: '/home/checkBody/', component: checkBody},
        {name: 'majorCheck', path: '/home/majorCheck/', component: majorCheck}]
    },
    {
      path: '/setting', name: 'setting', component: setting
    }
  ],
  linkActiveClass: "active",
  history: 'true',
  hashbang: false
});

