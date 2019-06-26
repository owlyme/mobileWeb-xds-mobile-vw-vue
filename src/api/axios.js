import axios from 'axios'

let reqTimer = null
let resTimer = null
let reqCount = false
let resCount = false
const service = axios.create({
    // withCredentials: true // 允许携带cookie
    baseURL: process.env.API_ROOT
})
service.interceptors.request.use(
    (config) => {
        if (!reqCount) {
            reqCount = true
            reqTimer = setTimeout(() => {
                clearTimeout(reqTimer)
                reqCount = false
            }, 1000)
        }
        return config
    },
    (err) => { Promise.reject(err) }
  )

// http response 服务器响应拦截器，这里拦截401错误，并重新跳入登页重新获取token
service.interceptors.response.use(
    response => response,
    (error) => {
        if (!resCount) {
            resCount = true
            resTimer = setTimeout(() => {
                resCount = false
                clearTimeout(resTimer)
            }, 5000)
        }
        return Promise.reject(error.response)
    })
// service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
export default service
