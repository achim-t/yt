import Vue from 'vue'
import App from './App.vue'
import PouchVue from 'pouch-vue'
import PouchDB from 'pouchdb-browser'
import pf from 'pouchdb-find'
import plf from 'pouchdb-live-find'

PouchDB.plugin(pf)
PouchDB.plugin(plf)



Vue.config.productionTip = false
Vue.use(PouchVue, {
  pouch: PouchDB,
  defaultDB: 'yt_pouch'
})

new Vue({
  render: h => h(App),
}).$mount('#app')
