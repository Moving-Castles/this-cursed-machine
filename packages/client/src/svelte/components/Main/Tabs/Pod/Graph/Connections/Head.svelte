<script lang="ts">
  // import Fist from "./Fist.svelte"
  // import Screw from "./Screw.svelte"
  // import TCMSide from "./TCMSide.svelte"
  import Snake from "./Snake.svelte"

  // Use SVG,
  // Make sure the direction of the element is facing up.
  // You can now make any arrow head you want.

  export let point: SVGPoint
  export let fill = "var(--color-grey-light)"
  export let rotation = 0
  export let scale = 1
</script>

<g
  class="head"
  style:transform="translate({point.x}px, {point.y}px) scale({scale}) rotate({rotation +
    90}deg) translate(-50%, -100%)"
>
  <!-- <TCMSide {fill} /> -->
  <Snake {fill} />
  <!-- <Screw {fill} /> -->
  <!-- <Fist {fill} /> -->
</g>

<style>
  .head {
    transform-box: fill-box;
  }
</style>
