<template>
    <div id="home">
      <!-- <mt-header title="邀请加入" class='app_header'></mt-header> -->
      <div class="content_p">
        <div class="cont_wrap" v-if="isWeBroswer">
          <router-view></router-view>
        </div>
        <div class="cont_wrap warn_info" v-else>
          <h2>请在微信中打开</h2>
        </div>
      </div>
    </div>
</template>
<script>
const production = process.env.NODE_ENV === 'production'
export default {
    name: 'home',
    data() {
        return {
          isWeBroswer: false
        }
    },
    created() {
      this.isWeBroswer = this.isWeixn()
    },
    components: {},
    methods: {
      isWeixn() {
        return (this.scanPlatform() === 'wx' || !production)
      }
    }
}
</script>
<style lang="stylus">
  @import "~@/assets/css/index"
  #home
    height: 100%
    display:flex
    flex-direction column
    .app_header
      color(#333)
      fn(18px)
      font-weight:bold
      bgColor(transparent)
    .content_p
      flex: 1
      padding 10px
      padb(13px)
      flex_()
      .cont_wrap
        display:flex
        width:100%
        radius(5px)
        bgColor()
        padding:47px 33px 0 33px
        boxShadow(0 0 5px 0 #cee4fb)
      .warn_info
        setMiddle()
</style>

