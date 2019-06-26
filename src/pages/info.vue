<template>
    <div id="info">
      <div v-if="isSuccess">
        <div class="portrait">
            <img :src="userInfo.picUrl">
            <i class="mintui mintui-field-success"></i>
        </div>
        <p class='congratulate'>Hi, {{userInfo.nickname}}, 您已成功加入</p>
        <h3>{{userInfo.corpName}}</h3>
        <p class='bottom-remind'>如需更多服务，请前往{{userInfo.corpName}}企业管理系统查看</p>
      </div>
      <div v-else class="fail">
        <div class="portrait">
            <img src="@/assets/imgs/warn.png">
        </div>
        <h4 v-if="code === 3548">此二维码已绑定其他微信用户</h4>
        <h4 v-if="code === 3547">此二维码或链接已失效</h4>
        <h5 class="contact_admin">如需要加入你所在的企业, 请联系你的企业管理员</h5>
      </div>

    </div>
</template>
<script>
    export default {
        name: '',
        data() {
            return {
              statusCode: null
            }
        },
        props: ['isSuccess', 'userInfo', 'code']
    }
</script>
<style lang="stylus">
    @import "~@/assets/css/index"
    #info
      flex:1
      padt(38px)
      height:100%
      center()
      >div
        relative()
        height:100%
        .portrait
          width: 60px
          height: 60px
          margin: 0 auto
          relative()
          img
            width: 100%
            height: 100%
          i
            absolute()
            bottom -8px
            right:-8px
            color(#3fb838)
            radius(50%)
            bgColor()
        .congratulate
          mb(15px)
          mt(40px)
        h3
          margin:20px 0
        h4
          mt(38px)
        .contact_admin
          mt(11px)
        .more
          absolute()
          left: 0
          right:0
          center()
          bottom:40px
          fn(10px)
          color(#999)
      .fail
        padt(24px)
      .bottom-remind
        position fixed
        bottom 40px
        left 0
        width 100%
        text-align center
        fn(10px)
        height: 24px;
        font-family: MicrosoftYaHei;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #979899;
</style>

