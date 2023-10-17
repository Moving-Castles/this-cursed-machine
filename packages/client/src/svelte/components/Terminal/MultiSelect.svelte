<script lang="ts">
  export let options: [][] = []
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  let index = 0
  let stage = 0
  let choice: Record<string, any>
  let choices: Record<string, any>[] = []
  let stageOptions: Record<string, any>[] = []

  $: {
    stageOptions = [...options[stage]]
    // Add back if the stage is advanced
    if (stage > 0)
      stageOptions = [...stageOptions, { id: "back", text: "BACK" }]
  }

  $: choice = stageOptions[index]

  // enter / return = 13
  // left = 37
  // up = 38
  // right = 39
  // down = 40
  const onKeyDown = ({ keyCode }) => {
    if (keyCode === 27) dispatch("cancel")

    // Up / down
    if (keyCode === 38) {
      index = Math.max(index - 1, 0)

      if (stage === options.length - 1) {
        dispatch("change", [...choices, choice.id])
      }
    }
    if (keyCode === 40) {
      index = Math.min(index + 1, stageOptions.length - 1)

      if (stage === options.length - 1) {
        dispatch("change", [...choices, choice.id])
      }
    }

    // Confirm
    if (keyCode === 13) {
      if (choice.id === "back") {
        stage--
        index = 0
        return
      } else {
        choices = [...choices, choice]

        dispatch("advance", choice)
        if (stage === options.length - 1) {
          dispatch("confirm", choices)
          stage = 0
          // Store user progress
        }

        if (stage !== options.length - 1) stage++
        index = 0
      }
    }
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="inline-select">
  {#each stageOptions as option (option.id)}
    <p class:active={option.id === choice.id} class="option output-content">
      {option.text}
    </p>
  {/each}
</div>

<style lang="scss">
  .option {
    color: #ccc;
    margin-left: 2ch;
    height: 1.2rem;
    line-height: 1.5rem;
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
