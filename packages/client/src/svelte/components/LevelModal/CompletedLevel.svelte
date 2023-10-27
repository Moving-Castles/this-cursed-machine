<script lang="ts">
  import { MaterialType } from "../../modules/state/enums"
  import { playerGoals, playerBox } from "../../modules/state"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  const handleClick = () => {
    dispatch("transfer")
  }

  // const getGoalTypes = () => {
  //   return $playerGoals.map(goal => {
  //     return MaterialType[goal.materialType] === "NONE"
  //       ? "ENERGY"
  //       : MaterialType[goal.materialType]
  //   })
  // }
</script>

<div class="completed-level">
  <div class="level-title">COMPLETED level Pod #{$playerBox.level}</div>
  <div class="level-description">Level description does here</div>
  <div class="level-goals">
    Production quota:
    <br />
    <!-- {#each getGoalTypes() as goal, i}
        <div class={goalTypes[i]}>
          {goalTypes[i]} = {goal.amount}
        </div>
      {/each} -->
  </div>
  <div class="button-container">
    <button class="btn" on:click={handleClick}>Next job</button>
  </div>
</div>

<style lang="scss">
  .completed-level {
    button {
      font-size: 48px;
    }
  }
</style>
