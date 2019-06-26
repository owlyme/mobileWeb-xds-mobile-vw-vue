'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ADMIN_BASE_URL: '"http://xingke100.com"',
  APPID: '"wxd516007e58279ff8"',
  API_ROOT: '""'
})
