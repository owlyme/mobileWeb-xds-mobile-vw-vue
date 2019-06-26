'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  ADMIN_BASE_URL: '"http://xingke100.com"',
  APPID: '"wxd516007e58279ff8"',
  API_ROOT: '"http://apitest.xingke100.com"'
})
