<script lang="ts">
  import Fist from "./Fist.svelte"

  export let point: SVGPoint
  export let fill = "var(--color-grey-light)"
  export let rotation = 0
</script>

<g
  class="head"
  style:transform="translate({point.x}px, {point.y}px) rotate({rotation +
    90}deg) translate(-50%, -100%)"
>
  <Fist {fill} />
</g>

<style>
  .head {
    transform-box: fill-box;
  }
</style>
