import Vue from 'vue';
import SvgIcon from 'vue-svgicon';
import Didor from 'components'; // eslint-disable-line
import Demo from './components/Demo.component.vue';
import App from './App.vue';

import 'styles'; // eslint-disable-line

Vue.component('Demo', Demo);
Vue.use(Didor);
Vue.use(SvgIcon, {
  tagName: 'az-icon',
  classPrefix: 'az',
});

new Vue({
  render: h => h(App),
}).$mount('#app');
