<script lang="ts">
  export let width: number
  export let height: number
</script>

<svg viewBox="0 0 {width * 100} {width * 100}">
  <linearGradient
    id="e"
    x1="40"
    y1="195"
    x2="40"
    y2="225"
    gradientUnits="userSpaceOnUse"
  >
    <stop stop-color="steelblue" offset="0" />
    <stop stop-color="red" offset="1" />
  </linearGradient>

  <slot />
</svg>

<style lang="scss">
  svg {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 99999;
  }
</style>
