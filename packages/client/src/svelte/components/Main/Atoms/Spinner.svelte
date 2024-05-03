<script lang="ts">
  import { onMount } from "svelte"

  let character = "|"

  onMount(() => {
    const spinnerInterval = setInterval(() => {
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
