<script lang="ts">
  import { onMount } from "svelte"
  // import { playSound } from "@modules/sound"

  let character = "|"

  onMount(() => {
    const spinnerInterval = setInterval(() => {
      // playSound("tcm", "TRX_wait_ALT")
      switch (character) {
        case "|":
          character = "/"
          break
        case "/":
          character = "-"
          break
        case "-":
          character = "\\"
          break
        case "\\":
          character = "|"
          break
      }
    }, 100)

    return () => {
      clearInterval(spinnerInterval)
    }
  })
</script>

<div class="spinner">{character}</div>
