import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// 提示删除成功
Vue.prototype.$notify.deleteOk = function() {
  Vue.prototype.$notify({
    title: 'Success',
    message: '删除成功',
    type: 'success',
    duration: 2000
  })
}

Vue.prototype.$notify.addOk = function() {
  Vue.prototype.$notify({
    title: 'Success',
    message: '添加成功',
    type: 'success',
    duration: 2000
  })
}

Vue.prototype.$message.editOk = function() {
  Vue.prototype.$notify({
    title: 'Success',
    message: '修改成功',
    type: 'success',
    duration: 2000
  })
}

Vue.prototype.$notify.editError = function() {
  Vue.prototype.$notify({
    title: 'Error',
    message: '修改失败',
    type: 'error',
    duration: 2000
  })
}

Vue.prototype.$notify.uploadOk = function() {
  Vue.prototype.$notify({
    title: 'Success',
    message: '上传成功',
    type: 'success',
    duration: 2000
  })
}

Vue.prototype.$notify.uploadError = function(msg) {
  Vue.prototype.$notify({
    title: 'Error',
    message: '上传失败' + (msg ? ': ' + msg : ''),
    type: 'error',
    duration: 2000
  })
}

// 剪贴板
Vue.prototype.$clipboard = {}

Vue.prototype.$message.copyOk = function() {
  Vue.prototype.$notify({
    title: 'Success',
    message: '复制成功',
    type: 'success',
    duration: 2000
  })
}

Vue.prototype.$message.pasteOk = function() {
  Vue.prototype.$notify({
    title: 'Success',
    message: '粘贴成功',
    type: 'success',
    duration: 2000
  })
}

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
