<script lang="ts">
  import { MaterialType } from "../../modules/state/enums"
  import { playerGoal } from "../../modules/state"
  import { goalSatisfied } from "../../modules/simulator"
  import { transfer } from "../../modules/action"

  let show = true

  $: goalType =
    MaterialType[$playerGoal?.materialType] === "NONE"
      ? "ENERGY"
      : MaterialType[$playerGoal?.materialType]
</script>

<!-- Start of new box -->
{#key $playerGoal}
  {#if show}
    <div class="goalBox">
      Pod #{$playerGoal.level}<br />
      <br />
      Don't damage company property
      <br />
      <br />
      Production quota:
      <br />
      <div class={goalType}>
        {goalType} = {$playerGoal.amount}
      </div>
      <br />
      <button class="btn" on:click={() => (show = false)}> I am ready </button>
    </div>
  {/if}
{/key}

<!-- End of current box -->
{#if $goalSatisfied}
  <div class="rewardBox">
    Pod #{$playerGoal.level} completed<br />
    <br />
    Performance: acceptable
    <br />
    <br />
    Production: n/a
    <br />
    <button
      class="btn"
      on:click={() => {
        show = true
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
    width: 400px;
    height: auto;
    padding: 1rem;
    background: var(--terminal-background);
    border: var(--terminal-border);
  }

  .btn {
    display: block;
    margin: 0 auto;
  }
</style>
