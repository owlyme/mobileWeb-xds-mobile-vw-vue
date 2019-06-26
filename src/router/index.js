import Vue from 'vue'
import Router from 'vue-router'

const Home = () => import('@/pages/home')
const Invite = () => import('@/pages/invite')
const Webpay = () => import("@/pages/webpay/webpay")
const PaySuccess = () => import("@/pages/webpay/paySuccess")
const Orderstatus = () => import("@/pages/webpay/orderStatus")
const Error = () => import("@/pages/error")

Vue.use(Router)
const router = new Router({
  mode: "history",
  base: "mobile",
  routes: [
    {
      path: "/",
      redirect: "/home"
    },
    {
      path: "/home",
      component: Home,
      children: [
        {
          path: "",
          component: Invite
        },
        {
          path: "invite",
          name: "invite",
          component: Invite
        }
      ]
    },
    {
      path: "/pay",
      name: "pay",
      component: Webpay,
      meta: { title: "确认付款" }
    },
    {
      path: "/paysuccess",
      name: "paysuccess",
      porps: true,
      component: PaySuccess,
      meta: { title: "支付成功" }
    },
    {
      path: "/orderstatus",
      name: "orderStatus",
      component: Orderstatus,
      meta: { title: "支付详情" }
    },
    {
      path: "/error",
      name: "error",
      component: Error
    }
  ]
})

const setTitle = (title) => {
  title && (document.querySelector("title").innerText = title)
}

router.beforeEach((to, from, next) => {
  setTitle(to.meta.title)
  next() // 确保一定要调用 next()
})

export default router
