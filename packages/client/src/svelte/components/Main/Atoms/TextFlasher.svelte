<script lang="ts">
  import { onMount } from "svelte"
  export let characters: string[] = []
  export let speed = 100
  let index = 0

  if (characters.length === 0) console.warn("needs chars")

  let character = characters[index]

  onMount(() => {
    const interval = setInterval(() => {
      character = characters[index]
      index = (index + 1) % characters.length
    }, speed)

    return () => {
      clearInterval(interval)
    }
  })
</script>

<span class="text-flasher">{character}</span>

<style>
  .text-flasher {
    font-size: 2rem;
    color: var(--color-grey-mid);
    opacity: 0.8;
  }
</style>
