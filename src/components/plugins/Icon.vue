<template>
  <i class="icon iconfont" :class="[`icon-${name}`]" :style="style" v-on="$listeners">
    <slot />
  </i>
</template>

<script>
export default {
  name: 'icon',
  props: {
    name: String,
    color: String,
    size: String
  },
  computed: {
    style() {
      return {
        color: this.color,
        fontSize: this.size
      }
    }
  }
}
</script>
