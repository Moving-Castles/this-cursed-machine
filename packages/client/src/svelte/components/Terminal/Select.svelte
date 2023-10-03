<script lang="ts">
  export let options: string[] = []
  import { onMount, createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  let index = 0
  let value = ""

  $: {
    value = options[index]
    dispatch("change", value)
  }

  // enter / return = 13
  // escape = 27
  // left = 37
  // up = 38
  // right = 39
  // down = 40
  const onKeyDown = ({ keyCode }) => {
    if (keyCode === 38) {
      index = Math.max(index - 1, 0)
    }
    if (keyCode === 40) {
      index = Math.min(index + 1, options.length - 1)
    }

    if (keyCode === 13) {
      dispatch("confirm", value)
    }

    if (keyCode === 27) dispatch("cancel")
  }

  onMount(() => {
    dispatch("change", value)
  })
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="inline-select">
  {#each options as option (option)}
    <div class:active={option === value} class="option">
      {option}
    </div>
  {/each}
</div>

<style lang="scss">
  .inline-select {
  }

  .option {
    color: #ccc;
    margin-left: 2ch;
    height: 1.5rem;
  }

  .active {
    text-decoration: underline;
    text-decoration-thickness: 2px;
    color: #fff;
    margin-left: 0;

    &::before {
      content: "> ";
    }
  }
</style>
