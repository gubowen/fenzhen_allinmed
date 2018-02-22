import Vue from 'vue'
import Router from 'vue-router'
import login from '@/Login'
import userlist from '@/userlist_rebuild'


import baseInfo from '@/components/sickParts/baseInfo'
import mainSpeak from '@/components/sickParts/mainSpeak'
import nowSick from '@/components/sickParts/nowSick'
import oldSick from '@/components/sickParts/oldSick'
import checkBody from '@/components/sickParts/checkBody'
import majorCheck from '@/components/sickParts/majorCheck'
import setting from '@/components/setting'
Vue.use(Router);

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
          {name: 'mainSpeak', path: '/home/mainSpeak/', component: mainSpeak},
        {name: 'baseInfo', path: '/home/baseInfo/', component: baseInfo},
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

