<script lang="ts">
  import { tweened } from "svelte/motion"
  import { linear as easing } from "svelte/easing"
  import { playSound } from "@svelte/modules/sound"
  export let value: number
  export let goal = Infinity // optional
  export let warn = -1 // If the value falls below this number, give ominous warning
  export let step = 10

  const DURATION = 1000

  let emphasis = ""
  let tweening = false
  let direction = 0

  const goingUp = tweened(Number(value), { duration: DURATION, easing })

  let previousValue = $goingUp

  $: {
    if ($goingUp !== Number(value) && !tweening) {
      previousValue = $goingUp
      $goingUp = Number(value)
      tweening = true

      direction = $goingUp - previousValue

      // const s = playSound("tcm", "inputBugs", true)
      let interval = setInterval(() => {
        if (direction < 0) {
          playSound("tcm", "bugsUp", false, false, 0.8)
        } else {
          playSound("tcm", "bugsUp")
        }
      }, 70)

      setTimeout(() => {
        if (previousValue > $goingUp) {
          emphasis = "emphasis-failure"
        } else {
          emphasis = "emphasis-success"
        }

        if (direction < 0) {
          playSound("tcm", "bugs")
        } else {
          playSound("tcm", "bugs")
        }

        clearInterval(interval)

        setTimeout(() => {
          emphasis = ""
          // console.log(emphasis)
          tweening = false
          direction = 0
        }, 3000)
      }, DURATION)
    }
  }
</script>

<span
  class={emphasis}
  class:flash-slow-thrice={$goingUp === warn ||
    ($goingUp % step === 0 && $goingUp < warn)}
  class:flash-fast-thrice={$goingUp >= goal}
>
  {#if direction < 0}↓{:else if direction > 0}↑{/if}{Math.round($goingUp)}
</span>
