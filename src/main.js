"use strict";

import Vue from 'vue/dist/vue';
import VueRouter from 'vue-router'

const Home = require('./components/Home.vue').default
const Clippings = require('./components/Clippings.vue').default
const App = require('./app.vue').default

import config from '../config'
import styles from './assets/scss/style.scss'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Home, name: 'Home' },
    { path: '/book/:id', component: Clippings, name: 'Clippings' }
  ]
})

window.bus = new Vue({
  data () {
    return {
      markers: [],
      user: undefined
    }
  },
  methods: {
    showMessage(message) {
      window.bus.$emit(config.ACTIONS.SHOW_MESSAGE, message)
    },
    isLoggedIn () {
      return !!(this.user && this.user.username)
    },
    getTitle () {
      return config.ADMIN.TITLE
    }
  }
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
