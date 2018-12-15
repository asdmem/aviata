import Vue from 'vue';
import App from './App.vue';
import { formatCurrency } from './filters/format.currency.filter';
import { formatTravelTime } from './filters/travel.time.filter';

Vue.config.productionTip = false;

Vue.filter('formatCurrency', formatCurrency);
Vue.filter('formatTravelTime', formatTravelTime);
new Vue({
  render: (h) => h(App),
}).$mount('#app');
