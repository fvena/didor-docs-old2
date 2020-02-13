import Vue from 'vue';
import SvgIcon from 'vue-svgicon';
import Components from 'components'; // eslint-disable-line
import Demo from './components/Demo.component.vue';
import App from './App.vue';

import 'styles'; // eslint-disable-line

Vue.config.productionTip = false;
Vue.config.devtools = false;

Vue.component('Demo', Demo);
Vue.use(Components);
Vue.use(SvgIcon, {
  tagName: 'az-icon',
  classPrefix: 'az',
});

new Vue({
  render: h => h(App),
}).$mount('#app');
