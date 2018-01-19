// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './validate'
import errorWatch from "@/common/js/util/errorWatch"
import store from "./store/store";

import "babel-polyfill";

Vue.config.productionTip = false;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  store,
  router,
  components: {App}
});

errorWatch();