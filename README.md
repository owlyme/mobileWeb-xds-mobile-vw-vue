# mobile

> yktmoblie

## 路由地址参数
http://192.168.0.53:8081/mobile/pay?orderId=123456&userId=123455（订单支付详情信息）
- orderId获取某某的订单基础详情信息(关联产品和产品价格及用户和用户的公司)
- payType和ip获取订单状态（完成状态，异常状态，审核状态）及支付更变订单状态的参数（完成状态）
http://192.168.0.53:8081/mobile/paySuccess?orderId=123456&userId=123455（支付成功的回调，订单支付信息及支付方式）
- orderId获取某某的订单基础详情信息
http://192.168.0.53:8081/mobile/orderStauts?orderId=123456&userId=123455&payType=1（订单详情信息及订单关联的支付信息）
- orderId=123456获取某某的订单基础详情信息(关联产品和产品价格及用户和用户的公司)
- orderId=123456及type获取支付列表信息

http://192.168.0.53:8081/mobile/pay?orderId=8417655&type=3&userId=103&outTradeNo=828417655

## 支付坑
- 商家参数格式有误，请联系商家/商家存在未配置的参数，请联系商家解决
```
原因： 回跳地址的域名（点击后新的URL）与申请H5支付时提交的授权域名（Referer的值）不匹配，，在商户配置支付安全域名
```
- sdk
- 商家存在未配置的参数，请联系商家解决

- 后台prepay_id拿到，在android机闪了支付面板，ios弹"支付签名验证失败"
  ```
  安全域名、目录未正确设置，参与签名的值与调用的值不一致（如timestamp签名时动态取，回显时也动态取）等
  最新微信支付提供的SDK代码中，统一下单接口sign_type是置为 HMAC-SHA256 而不是使用默认的 MD5，而公众号内发起支付的签名只能使用 MD5，正是这种不一致导致了签名验证错误，将统一下单的签名类型改成MD5即可。
  1.微信接口返回的 签名（sign） 不能直接给h5，需要再次签名,自己手动签名
  2.  const md5=crypto.createHash("md5");
    md5.update(string);
    ret.paySign = md5.digest('hex').toUpperCase();
  3. 签名必须要在排序的字符串中添加商户key,并且排序的字符串不能转化成小写。。
  ```

