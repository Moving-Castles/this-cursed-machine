<script lang="ts">
  import { playerBox } from "../../modules/state"
  import { createEventDispatcher } from "svelte"
  import Terminal from "../Terminal/Terminal.svelte"
  // import { boxOutput } from "../../modules/simulator"
  // import { MaterialType } from "../../modules/state/enums"
  // import { materialTypeToLabel } from "../../modules/state/convenience"
  import { COMMAND } from "../Terminal/types"

  const dispatch = createEventDispatcher()

  const handleCommand = async (e: any) => {
    console.log(e.detail.command.id)
    if (e.detail.command.id === COMMAND.BLINK) {
      dispatch("transfer")
    }
  }
</script>

<div class="completed-level">
  <div class="level-title">◊ COMPLETED order #{$playerBox.level}</div>

  <!-- {#each Object.entries($boxOutput) as [type, amount] (type)}
    <span class={MaterialType[type]}>
      {materialTypeToLabel(type)}: {amount}
    </span><br />
  {/each} -->
  <!-- <div class="level-description">Level description does here</div> -->
  <!-- <div class="level-goals">
    Production quota:
    <br />
   {#each getGoalTypes() as goal, i}
        <div class={goalTypes[i]}>
          {goalTypes[i]} = {goal.amount}
        </div>
      {/each}
  </div> -->
  <div class="terminal-container">
    <Terminal
      on:commandExecuted={handleCommand}
      noOutput
      inputActive
      placeholder="blink"
    />
  </div>

  <!-- <div class="button-container">
    <button class="btn" on:click={handleClick}>Next job</button>
  </div> -->
</div>

<style lang="scss">
  .level-title {
    color: var(--color-special);
  }
  .completed-level {
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;

    button {
      font-size: 48px;
    }
  }

  .terminal-container {
    width: 100%;
  }
</style>
