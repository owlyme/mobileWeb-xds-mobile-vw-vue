<template>
  <div id="message-box">
    <div class="content">
      <div class="header" v-if="$slots.header"><slot name="header"></slot></div>
      <div class="body" v-if="$slots.body"><slot name="body"></slot></div>
      <div class="footer" v-if="$slots.footer"><slot name="footer"></slot></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mmessage',
  data() {
    return {
      
    }
  },
  methods: {
    
  }
}
</script>

<style lang="stylus">
@import "~@/assets/css/index"
  #message-box
    position fixed
    setMiddle()
    top 0
    left 0
    width 100%
    height: 100%
    background rgba(50, 50, 50, 0.6)
    .content
      width: 270px
      background-color: #ffffff
      border-radius: 12px
      .header
        height 80px
        font-size: 16px;
        font-weight 700
        borb(1px solid border-color1)
        setMiddle()
      .body
        font-size: 16px;
        min-height 44px
        borb(1px solid border-color1)
        setMiddle()
      .footer
        min-height 44px
        font-size: 16px;
        setMiddle()
</style>
