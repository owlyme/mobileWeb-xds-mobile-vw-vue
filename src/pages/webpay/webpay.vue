<template>
  <div id="web-scan">
    <div class="content-info">
      <div class="payment-info logo">
        <img src="https://xds-10-1-1255528578.cos-website.ap-shanghai.myqcloud.com/file/client/xds/static/logo.png">
      </div>
      <p class="payment-info name">销大师</p>
      <div class="payment-info packageName">
        <p class="borderb1px">{{paymentInfo.packageName}}</p>
      </div>
      <p class="payment-info real-payment" v-if="paymentInfo.orderPayPrice">
        <span>￥</span><strong>{{paymentInfo.orderPayPrice | moneyFormat}}</strong>
      </p>
    </div>
    <div class="content" v-if="scanType === 3">
      <mt-checklist
        align="right"
        v-model="value"
        :options="options">
      </mt-checklist>
    </div>
    <mt-button
      class="payment-sure"
      :class="{'wxpay': (scanType === 2)}"
      type="primary"
      size="small"
      @click="pay">
        确认支付
    </mt-button>
    <div id="payForm" :style="{display:'none'}"></div>
    <MMessage v-if="showMessage2">
      <div slot="body">
        <p style="padding: 25px 16px; text-align: center; font-size: 14px; line-height: 20px;">
          {{statusTxt}}
        </p>
      </div>
      <div slot="footer" @click="understand" >
        <strong style="font-size: 16px">知道了</strong>
      </div>
    </MMessage>
    <MMessage v-if="showMessage1">
      <div slot="header">请确认是否支付完成</div>
      <div slot="body" class="blue" @click="payCheck">
        已支付完成
      </div>
      <div slot="footer" class="red" @click="payCheck" >
        支付遇到问题，重新支付
      </div>
    </MMessage>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'

const statusTxtList = {
  1: "该订单已完成", // 完成
  2: "该订单已关闭", // 关闭
  3: "您已通过 银行汇款 的方式完成订购流程，我们将尽快审核您的付款信息。", // 待审核
  4: "您已通过 银行汇款 的方式完成订购流程，我们将尽快审核您的付款信息。", // 审核失败
  5: "您已通过 银行汇款 的方式完成订购流程，我们将尽快审核您的付款信息。", // 审核成功
  6: "该订单正在处理中...", // 订单异常
  7: "该订单尚未完成支付，如需帮助，请联系我们，咨询电话：400-8556888" // 订单未支付
}
export default {
  name: "pay",
  data() {
    return {
      showMessage1: false,
      showMessage2: false,
      scanType: null,
      payType: null,
      pageUrlQuery: {},
      paymentInfo: {},
      value: ["wxPay"],
      options: [
        {
          label: "微信支付",
          value: "wxPay"
        },
        {
          label: "支付宝",
          value: "aliPay"
        }
      ],
      statusTxt: '',
      statusCode: 1,
      payArgs: {},
      openId: ''
    }
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        if (newVal.length === 2) {
          this.value = [newVal.pop()]
        } else if (newVal.length === 0) {
          if (oldVal[0] === "wxPay") {
            this.value = ["wxPay"]
          } else if (oldVal[0] === "aliPay") {
            this.value = ["aliPay"]
          }
        }
      },
      deep: true
    }
  },
  created() {
    this.getPageUrlQuery()
    this.getPayInfo()
    this.platform()
    this.getSdkConfig()
    this.getOpenId()
    this.isShowMessage()
  },
  mounted() {
    wx.ready(() => {
      console.log('配置信息验证完毕')
      wx.checkJsApi({
        jsApiList: ['chooseImage', 'chooseWXPay'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
        success: (res) => {
          console.log('校验权限', res)
        }
      })
    })
  },
  methods: {
    getPageUrlQuery() {
      this.pageUrlQuery = this.$route.query
    },
    platform() {
      const platform = this.scanPlatform()
      if (platform === 'ali') {
        this.scanType = 1
      } else if (platform === 'wx') {
        this.scanType = 2
      } else {
        this.scanType = 3
      }
    },
    getPayType() {
      if (this.scanType === 3) {
        this.payType = this.value[0] === "wxPay" ? 3 : 1
      } else {
        this.payType = this.scanType
      }
    },
    getPayInfo() {
      const args = {
        userId: this.pageUrlQuery.userId,
        orderId: this.pageUrlQuery.orderId
      }
      this.$post(this.Path.getOrderPayInfo, args).then((res) => {
        if (res.data.code !== 1) {
          this.$router.replace({ name: 'error' })
        }
        this.paymentInfo = res.data.data
      })
    },
    pay() {
      // 6.1.2.2确认付款获取支付参数接口
      this.getPayType()
      const args = {
        orderId: this.pageUrlQuery.orderId,
        type: this.payType,
        userId: this.paymentInfo.userId
      }
      if (this.payType !== 1) {
        args.spbillCreateIp = window.returnCitySN.cip
      }
      if (this.openId) {
        args.openid = this.openId
      }
      this.payArgs = args
      this.Indicator(1)
      setTimeout(() => {
        this.$post(this.Path.updatePayOrderReturnParam, args).then((res) => {
          this.Indicator()
          if (res.data.code === 1) {
            // node转发java数据
            if ([1, 2, 3, 4, 5, 6].indexOf(res.data.data.orderStatus) > -1) {
              this.statusTxt = statusTxtList[res.data.data.orderStatus]
              this.showMessage2 = true
            } else if (this.payType === 1) {
              // 支付宝
              document.querySelector('#payForm').innerHTML = res.data.data.aliPayForm
              document.forms[0].submit()
            } else if (this.payType === 2) {
              // 公众号支付
              if (res.data.data.return_code === 'FAIL' || res.data.data.result_code === 'FAIL') {
                this.Toast(res.data.data.return_msg)
              } else {
                this.onWxPay(res.data.data, res.data.pageQuery)
              }
            } else if (this.payType === 3) {
              // 微信H5
              if (res.data.data.mweb_url) {
                const url = encodeURIComponent(location.origin + location.pathname + '?' + res.data.pageQuery)
                const payurl = `${res.data.data.mweb_url}&redirect_url=${url}`
                location.href = payurl
              } else {
                this.Toast(res.data.data.return_msg)
              }
            }
          } else {
            this.Toast(res.data.message)
          }
        })
      }, 400)
    },
    understand() {
      this.showMessage2 = false
      if (this.statusCode !== 7) {
        this.$router.push({ name: "orderStatus", query: { orderId: this.pageUrlQuery.orderId } })
      }
    },
    getSdkConfig() {
      if (this.scanType === 2) {
            let config = {}
            config.url = location.href
            // 请求api返回sdk配置参数
            this.$post(this.Path.wechatConfig, config).then((res) => {
                config = res.data.data // appId, timestamp,nonceStr,signature
                config.debug = false
                config.jsApiList = [
                    'chooseWXPay',
                    'chooseImage'
                ]
                wx.config(config)
                // wx.ready(() => {
                //   console.log("页面加载完顶用相关接口")
                // })
            })
      }
    },
    getOpenId() {
      // 微信获取openId
      if (this.scanType === 2) {
        if (!sessionStorage.getItem('openId')) {
          if (this.pageUrlQuery.code) {
            // 获取openId
            this.$post(this.Path.enter, {
              code: this.pageUrlQuery.code
            }).then((res) => {
              sessionStorage.setItem('openId', res.data.data.openId)
              this.openId = res.data.data.openId
            })
          } else {
            // 授权
            const appId = process.env.APPID
            const url = encodeURIComponent(location.href)
            location.replace(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${url}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`)
          }
        } else {
          this.openId = sessionStorage.getItem('openId')
        }
      }
    },
    onWxPay(wxconfig, pageQuery) {
      // 微信支付, params传递timestamp, nonceStr, package,signType,paySign
      const { timeStamp, nonceStr, signType, paySign } = wxconfig
      wx.chooseWXPay({
        timestamp: timeStamp,
        nonceStr,
        package: wxconfig.package,
        signType,
        paySign,
        success: () => {
        // 支付成功后的回调函数,传递orderId,userId,type,payNo
          this.$router.replace('/paysuccess?' + pageQuery)
        }
      })
    },
    isShowMessage() {
      // h5支付过后的重定向
      if (this.scanType === 3 && this.pageUrlQuery.outTradeNo) {
        this.showMessage1 = true
      }
    },
    payCheck() {
      this.getPayType()
      const args = {
        outTradeNo: this.pageUrlQuery.outTradeNo,
        type: Number(this.pageUrlQuery.type)
      }
      const queryStr = location.href.split('?')[1]
      this.Indicator(1)
      this.$post(this.Path.updatePayOrderByPayType, args).then((res) => {
          this.Indicator()
          this.showMessage1 = false
          if (res.data.code === 1) {
            // 根据支付状态和工单状态
            if (res.data.data.payStatus) {
              // 支付完成
              this.$router.replace('/paysuccess?' + queryStr)
            } else if (res.data.data.orderStatus) {
              this.statusTxt = statusTxtList[res.data.data.orderStatus]
              this.showMessage2 = true
            } else {
                // 未支付及无状态
                this.statusTxt = statusTxtList[7]
                this.statusCode = 7
                this.showMessage2 = true
            }
          } else {
            this.Toast(res.data.message)
          }
        })
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/css/index';

#web-scan {
  height: 100%;
  background: bg-color1;

  .payment-sure {
    display: block;
    width: 92%;
    height: 44px;
    margin: 0 auto;
    background: bg-color3;
    font-size: 16px;

    &.wxpay {
      background: bg-color4;
    }
  }

  .content-info {
    padding: 40px 0;
    background-color: #ffffff;
    box-shadow: 0 #e3e4e5;
    mb(15px);

    .payment-info {
      setMiddle();
    }

    .logo {
      img {
        width: 39px;
        height: 39px;
        mb(10px);
      }
    }

    .name {
      font-size: 15px;
      color: #303133;
      mb(20px);
    }

    .version {
      font-size: 12px;
      color: #979899;
      mb(55px);
    }
    .packageName {
      color: #979899;
      font-size: 13px;
      p {
        width: 276px;
        padding-bottom: 20px;
        text-align: center;
      }
    }
    .real-payment {
      margin-top: 35px;
      height: 30px;

      span {
        display: inline-block;
        padding-top: 12px;
        font-size: 18px;
        vertical-align: bottom;
      }

      strong {
        font-size: 36px;
      }
    }
  }

  .content {
    mb(30px);
    background: #ffffff;

    .mint-cell {
      position: relative;
      padding-left: 20px;
      color: #222;
      background: #fff;
      border-top: 0 solid transparent;
      border-bottom: 1px solid transparent;
      border-image: svg(border param(--color border-color1)) 2 2 stretch;

      &:before {
        position: absolute;
        display: block;
        content: '' !important;
        top: 11px;
        height: 20px;
        width: 18px;
        vertical-align: middle;
        overflow: hidden;
        background: url('https://pay.weixin.qq.com/wiki/doc/api/img/logo.png?v=20161227') no-repeat; // pay.weixin.qq.com/wiki/doc/api/img/logo.png?v=20161227) no-repeat
        background-size: cover;
      }

      &:last-child {
        border-bottom: none;

        &:before {
          width: 18px;
          height: 18px;
          background: url('https://i.alipayobjects.com/common/favicon/favicon.ico') no-repeat; // i.alipayobjects.com/common/favicon/favicon.ico) no-repeat
          background-size: cover;
        }
      }

      .mint-cell-wrapper {
        background-image: none;
      }
    }
  }

  .mint-checkbox-input:checked+.mint-checkbox-core {
    background-color: bg-color4;
    border-color: bg-color4;
  }
}
</style>
