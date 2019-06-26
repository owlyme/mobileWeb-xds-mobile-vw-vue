<template>
  <div id="web-pay-status">
    <div class="content-info">
      <div class="payment-info logo" v-if="payOrderInfo.orderStatus">
        <Icon
          :name="status[payOrderInfo.orderStatus].icon"
          class="statusIcon"
          :style="{color: status[payOrderInfo.orderStatus].color }" />
      </div>
      <p class="payment-info status" v-if="payOrderInfo.orderStatus">
        {{status[payOrderInfo.orderStatus].txt}}
      </p>
      <p class="payment-info real-payment" v-if="payOrderInfo.orderPayPrice">
        <span>￥</span><strong>{{payOrderInfo.orderPayPrice | moneyFormat}}</strong>
      </p>
    </div>
    <div class="content">
      <div class="borderb1px">
        <mt-header class="header-row">
          <div slot="left">
            订购服务
          </div>
          <div slot="right">
            {{payOrderInfo.packageName}}
          </div>
        </mt-header>
        <mt-header class="header-row">
          <div slot="left">
            订购企业
          </div>
          <div slot="right">
            {{payOrderInfo.corpName}}
          </div>
        </mt-header>
        <mt-header class="header-row">
          <div slot="left">
            创建时间
          </div>
          <div slot="right">
            {{payOrderInfo.createTime | dateFormat}}
          </div>
        </mt-header>
        <mt-header class="header-row">
          <div slot="left">
            订单编号
          </div>
          <div slot="right">
            {{pageUrlQuery.orderId}}
          </div>
        </mt-header>
        <mt-header class="header-row" v-if="payOrderInfo.authTime">
          <div slot="left">
            审核时间
          </div>
          <div slot="right">
            {{payOrderInfo.authTime | dateFormat}}
          </div>
        </mt-header>
        <mt-header class="header-row" v-if="payOrderInfo.authMisc">
          <div slot="left">
            审核备注
          </div>
          <div slot="right">
            {{payOrderInfo.authMisc}}
          </div>
        </mt-header>
        <mt-header class="header-row" v-if="payOrderInfo.orderStatus === 2">
          <div slot="left">
            关闭时间
          </div>
          <div slot="right">
            {{payOrderInfo.updateTime}}
          </div>
        </mt-header>
      </div>
    </div>
    <div class="content" v-for="item in payOrderInfo.payOrderDtoList" :key="item.payOrderNo">
      <div class="borderb1px">
        <mt-header class="header-row" v-if="item.payOrderNo">
          <div slot="left">
            支付单号
          </div>
          <div slot="right">
            {{item.payOrderNo}}
          </div>
        </mt-header>
        <mt-header class="header-row">
          <div slot="left">
            支付方式
          </div>
          <div slot="right">
            {{item.payType | paytype}}
          </div>
        </mt-header>
        <mt-header class="header-row">
          <div slot="left">
            支付流水号
          </div>
          <div slot="right">
            {{item.batchNo || '无'}}
          </div>
        </mt-header>
        <mt-header class="header-row" v-if="item.uploadVoucherTime">
          <div slot="left">
            上传凭证时间
          </div>
          <div slot="right">
            {{item.uploadVoucherTime | dateFormat}}
          </div>
        </mt-header>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'orderStatus',
  data() {
    return {
      pageUrlQuery: {},
      payOrderInfo: {
        orderStatus: 0,
        payOrderDtoList: []
      },
      status: {
        1: { color: "#3fb838", icon: "xuanzhong", txt: '订单完成' }, // 订单完成
        2: { color: "#f56c6c", icon: "guanbi", txt: '订单关闭' }, // 订单关闭
        3: { color: "#ffbc58", icon: "daishenhe", txt: '待审核' }, // 待审核
        4: { color: "#f56c6c", icon: "shenheshibai", txt: '审核失败' }, // 审核失败
        5: { color: "#3fb838", icon: "shenhechenggong", txt: '审核成功' }, // 审核成功
        6: { color: "#ffbc58", icon: "dingdanchuli", txt: '订单处理中' } // 处理中及订单异常
      }
    }
  },
  created() {
    this.getPageUrlQuery()
    this.getOrderParam()
  },
  methods: {
    getPageUrlQuery() {
      this.pageUrlQuery = this.$route.query
    },
    getOrderParam() { // 获取支付集合
      const { orderId } = this.$route.query
      this.$post(this.Path.getPayOrderStatus,
        { orderId }).then((res) => {
          if (res.data.code !== 1) {
            this.$router.replace({ name: 'error' })
          } else {
            this.payOrderInfo = res.data.data
          }
      })
    }
  },
  filters: {
    paytype(val) {
      if (val === 1) {
        return '微信公众号支付'
      } else if (val === 2) {
        return '支付宝支付'
      } else if (val === 3) {
        return '银行汇款'
      }
        return '微信H5支付'
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/css/index';

#web-pay-status {
  height: 100%;
  background: bg-color1;

  .statusIcon {
    font-size: 36px;
    color: #f56c6c;
  }

  .content-info {
    padding: 55px 0;
    background-color: #ffffff;
    box-shadow: 0 #e3e4e5;
    mb(15px);

    .payment-info {
      setMiddle();
    }

    .logo {
      img {
        width: 35px;
        height: 35px;
        mb(15px);
      }
    }

    .status {
      font-size: 15px;
      color: #303133;
      mt(15px);
      mb(20px);
    }

    .real-payment {
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
    background: #ffffff;
    padding: 0 15px;

    & > div {
      padding: 10px 0;
    }

    &:last-of-type {
      & > div {
        border: none
        // border-bottom: none;
      }
    }

    .header-row {
      height: 32px;
      padding: 0;
      color: #606366;
      background: #fff;

      .mint-header-title {
        flex: 0;
        color: #979899;
      }

      .mint-header-button.is-right {
        flex: 1;
        line-height: 1.5;
        color: #303133;
      }

      .mint-header-button>div {
        word-break: break-all;
        word-wrap: break-word;
        white-space: normal;
      }

      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
