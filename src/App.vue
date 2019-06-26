<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<style>
  body{
    background: #ebf8fd
  }
</style>
<script>
  export default {
    created() {
      document.getElementsByTagName('body')[0].style.height = (window.innerHeight || document.documentElement.clientHeight) + 'px'
    }
  }
</script>
<style lang="stylus">
#app
  height:100%;
  font-family: MicrosoftYaHei;
</style>
