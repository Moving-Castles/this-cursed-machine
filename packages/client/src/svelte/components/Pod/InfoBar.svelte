<script lang="ts">
  import { playerEntity } from "../../modules/state"
  import { reward, charge } from "../../modules/action"

  const sendReward = () => {
    reward()
  }

  const sendCharge = () => {
    charge()
  }
</script>

<div class="info-bar">
  <div>
    {#if $playerEntity.name}
      {$playerEntity.name}
    {:else}
      Stump #{$playerEntity.spawnIndex}
    {/if}
  </div>

  <div class="tokens">
    TOKENS: {$playerEntity.tokenBalances}
    <button on:click={sendReward}>Reward</button>
    <button on:click={sendCharge}>Charge</button>
  </div>
</div>

<style lang="scss">
  .info-bar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-inline: 20px;

    .tokens {
      display: flex;
      align-items: center;

      button {
        font-size: 8px;
        padding: 5px;
        border: none;
        margin-left: 5px;
        margin-top: 0;
      }
    }
  }
</style>
