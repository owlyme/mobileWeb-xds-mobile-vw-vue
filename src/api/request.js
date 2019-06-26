import Vue from 'vue'
import Path from './path'
import Http from './http'

export default function () {
  Vue.prototype.Path = Path
  Vue.prototype.$post = function (url, args) {
    return Http.Post(url, args)
  }
  Vue.prototype.$get = function (url, args) {
    return Http.Get(url, args)
  }
  Vue.prototype.verifyCode = function (args) {
    return Http.Post(Path.verifyCode, args)
  }
  Vue.prototype.joinCorp = function (args) {
    return Http.Post(Path.joinCorp, args)
  }
  Vue.prototype.getUserInfo = function (args) {
    return Http.Post(Path.getUserInfo, args)
  }
  Vue.prototype.getOrderPayInfo = function (args) {
    return Http.Post(Path.getOrderPayInfo, args)
  }
  Vue.prototype.payOrder = function (args) {
    return Http.Post(Path.payOrder, args)
  }
}
