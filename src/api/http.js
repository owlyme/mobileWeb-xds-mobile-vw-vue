import axios from './axios'
// get请求
function Get(url, args = {}) {
  args.timestamp = new Date().getTime()
  return new Promise(function (resolve, reject) {
    axios.get(url, { params: args })
      .then(function (r) {
        resolve(r)
      }).catch(function (err) {
        reject(err)
      })
  })
}

function Post(url, args) {
  return new Promise(function (resolve, reject) {
    axios.post(url, args)
    .then(function (r) {
      resolve(r)
    }).catch(function (err) {
      reject(err)
    })
  })
}

export default {
  Post,
  Get
}
