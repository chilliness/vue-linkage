import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import LinkageBase from './components/linkageBase';

Vue.config.productionTip = false;
Vue.use(LinkageBase);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
