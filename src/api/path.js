const url = '/api/mobile'
const url1 = '/api/wechat'
export default {
  verifyCode: url + "/invite/verifyCode", // 请求验证码
  joinCorp: url + "/invite/joinCorp", // 立即加入
  getUserInfo: url + "/invite/getUserInfo", // 立即加入
  getOrderPayInfo: url + "/uPayOrder/getOrderPayInfo", // 扫码获取支付信息接口
  updatePayOrderReturnParam: url + "/uPayOrder/updatePayOrderReturnParam", // 确认支付
  updatePayOrderByPayType: url + "/uPayOrder/updatePayOrderByPayType", // 支付查询接口
  getPayOrderStatus: url + "/uPayOrder/getPayOrderStatus", // 获取订单详情
  enter: url1 + "/enter", // 获取opendId
  wechatConfig: url1 + "/sdkConfig" // 获取sdk配置
}
