<script lang="ts">
  import { MaterialType } from "../../modules/state/enums"
  import { playerGoals, playerBox } from "../../modules/state"
  import { goalsSatisfied } from "../../modules/simulator"
  import { transfer } from "../../modules/action"
  import { showGoals } from "../../modules/ui/stores"

  $: goalTypes = $playerGoals.map(goal => {
    return MaterialType[goal?.materialType] === "NONE"
      ? "ENERGY"
      : MaterialType[goal?.materialType]
  })
</script>

<!-- Start of new box -->
{#key $playerGoals}
  {#if $showGoals}
    <div class="goalBox">
      Pod #{$playerBox.level}<br />
      <br />
      Don't damage company property
      <br />
      <br />
      Production quota:
      <br />
      {#each $playerGoals as goal, i}
        <div class={goalTypes[i]}>
          {goalTypes[i]} = {goal.amount}
        </div>
      {/each}
      <br />
      <br />
      <br />
      <button class="btn" on:click={() => ($showGoals = false)}
        >I am ready
      </button>
    </div>
  {/if}
{/key}

<!-- End of current box -->
{#if $goalsSatisfied}
  <div class="rewardBox">
    Pod #{$playerBox.level} completed<br />
    <br />
    Performance: acceptable
    <br />
    <br />
    Production: n/a
    <br />
    <br />
    <button
      class="btn"
      on:click={() => {
        $showGoals = true
        transfer()
      }}
    >
      Transfer
    </button>
  </div>
{/if}

<style lang="scss">
  .rewardBox,
  .goalBox {
    position: fixed;
    z-index: 50000;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: auto;
    min-height: 400px;
    padding: 2rem;
    background: var(--terminal-background);
    border: var(--terminal-border);
  }

  .btn {
    display: block;
    margin: 0 auto;
  }
</style>
