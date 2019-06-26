<template>
  <div id="web-pay-success">
    <div class="content-info" v-if="status">
      <div class="payment-info logo">
        <Icon :name="paySuccess.icon" color="#1aad19" size="35px" />
      </div>
      <p class="payment-info status">{{paySuccess.statusTxt}}</p>
      <p class="payment-info real-payment">
        <span>￥</span><strong>{{paySuccess.orderPayPrice | moneyFormat}}</strong>
      </p>
    </div>
    <div class="content" v-if="status">
      <mt-header class="header-row borderb1px">
        <div slot="left">
          订购服务
        </div>
        <div slot="right">
          {{paySuccess.packageName}}
        </div>
      </mt-header>
      <mt-header class="header-row">
        <div slot="left">
          支付方式
        </div>
        <div slot="right">
          {{paySuccess.payOrderInfoDtos[0].payType  | paytype}}
        </div>
      </mt-header>
    </div>
    <div class="content-info" v-if="!status">
      <div class="payment-info logo">
        <Icon name="guanbi" color="#f56c6c" size="35px" />
      </div>
      <p class="payment-info status">{{paySuccess.statusTxt}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'paysuccess',
  data() {
    return {
      status: true,
      paySuccess: {
        icon: 'xuanzhong',
        statusTxt: "支付成功",
        payOrderInfoDtos: []
      }
    }
  },
  created() {
    const urlQueryArgs = this.$route.query
    const params = {
        outTradeNo: urlQueryArgs.outTradeNo || urlQueryArgs.out_trade_no,
        type: Number(urlQueryArgs.type)
    }
    this.getPayStatus(params)
  },
  methods: {
    getPayStatus(args) {
      this.$post(this.Path.updatePayOrderByPayType, args).then((data) => {
        if (data.data.code === 1) {
          this.paySuccess = { ...this.paySuccess, ...data.data.data }
        } else {
          this.$router.replace({ name: 'error' })
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

#web-pay-success {
  height: 100%;
  background: bg-color1;

  .content-info {
    padding: 55px 0;
    background-color: #ffffff;
    box-shadow: 0 #e3e4e5;
    mb(15px);

    .payment-info {
      setMiddle();
    }

    .logo {
      i {
        font-size: 35px;
        mb(15px);
      }
    }

    .status {
      font-size: 15px;
      color: #303133;
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

    .header-row {
      height: 44px;
      padding: 0 20px;
      color: #606366;
      background: #fff;

      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
