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

  const goingUp = tweened(Number(value), { duration: DURATION, easing })

  let previousValue = $goingUp

  $: {
    if ($goingUp !== Number(value) && !tweening) {
      previousValue = $goingUp
      $goingUp = Number(value)
      tweening = true

      setTimeout(() => {
        if (previousValue > $goingUp) {
          emphasis = "emphasis-failure"
          playSound("tcm", "bugs")
        } else {
          emphasis = "emphasis-success"
          playSound("tcm", "bugs")
        }

        console.log(emphasis)

        setTimeout(() => {
          emphasis = ""
          // console.log(emphasis)
          tweening = false
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
  {Math.round($goingUp)}
</span>
