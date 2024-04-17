<script lang="ts">
  import { tweened } from "svelte/motion"
  import { expoOut as easing } from "svelte/easing"
  export let value: number
  export let goal = Infinity // optional
  export let warn = -1 // If the value falls below this number, give ominous warning
  export let step = 10

  const DURATION = 5000

  const goingUp = tweened(Number(value), { duration: DURATION, easing })

  let previousValue = $goingUp

  $: {
    previousValue = $goingUp
    $goingUp = Number(value)
  }
</script>

<span
  class:flash-slow-thrice={$goingUp === warn ||
    ($goingUp % step === 0 && $goingUp < warn)}
  class:flash-fast-thrice={$goingUp >= goal}
>
  {Math.round($goingUp)}
</span>
