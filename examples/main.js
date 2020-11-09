import Vue from 'vue'
import App from './App.vue'
import Case from '../packages/index'
Vue.config.productionTip = false
Vue.use(Case)
new Vue({
  render: h => h(App),
}).$mount('#app')
