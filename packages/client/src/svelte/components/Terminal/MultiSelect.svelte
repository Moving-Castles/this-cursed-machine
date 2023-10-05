<script lang="ts">
  export let options: [][] = []
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  let index = 0
  let stage = 0
  let choices: number[] = []
  let stageOptions: string[] = []
  let value = ""

  $: {
    stageOptions = [...options[stage]]
    console.log(stageOptions, stage)
    if (stage > 0) stageOptions = [...stageOptions, "BACK"]
  }
  $: {
    value = stageOptions[index]
  }

  // enter / return = 13
  // left = 37
  // up = 38
  // right = 39
  // down = 40
  const onKeyDown = ({ keyCode }) => {
    const args = value.match(/\d+/)
    const choice = args ? Number(args[0]) : value

    if (keyCode === 27) dispatch("cancel")

    if (keyCode === 38) {
      index = Math.max(index - 1, 0)

      if (stage === options.length - 1) {
        dispatch("change", [...choices, choice]) // Only commit the numerical ID
      }
    }
    if (keyCode === 40) {
      index = Math.min(index + 1, stageOptions.length - 1)

      if (stage === options.length - 1) {
        dispatch("change", [...choices, choice]) // Only commit the numerical ID
      }
    }

    if (keyCode === 13) {
      if (isNaN(choice)) {
        console.log(choice)
        stage--
        index = 0
        return
      } else {
        choices = [...choices, choice] // Only commit the numerical ID

        dispatch("advance", value)
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
  {#each stageOptions as option (option)}
    <p class:active={option === value} class="option output-content">
      {option}
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
