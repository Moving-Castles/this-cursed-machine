<script lang="ts">
  import { chargeClaw, move } from "../../../modules/action"
  import { playerCore, cores, calculatedEnergy, playerEntityId, gameConfig } from "../../../modules/state"

  export let entity: EntityStoreEntry

  let targetEntity: string
  let targetX: number
  let targetY: number

  $: coresNotMe = Object.entries($cores).filter(([address, _]) => address !== $playerEntityId)

  function sendChargeClaw() {
    chargeClaw(entity.address)
  }

  function sendTestMove() {
    move(entity.address, targetEntity, targetX, targetY)
  }
</script>


{#if $playerCore.resourceConnection === entity.address}
  {#if $calculatedEnergy[$playerEntityId] >= 20}
    <button
      on:click={sendChargeClaw}
      >Charge (+20 Energy)</button
    >
  {/if}
{/if}


{#if $playerCore.controlConnection === entity.address}
  <div class="action">
    <select name="entity" bind:value={targetEntity} id="entity">
      <option value="">--Please choose an option--</option>
      {#each coresNotMe as [id, core]}
        <option value={id}>{core.name}</option>
      {/each}
    </select>
    <!-- INPUT: X -->
    <input
      type="number"
      bind:value={targetX}
      min="0"
      max={$gameConfig.gameConfig?.worldWidth - 1}
      placeholder="X"
    />
    <!-- INPUT: Y -->
    <input
      type="number"
      bind:value={targetY}
      min="0"
      max={$gameConfig.gameConfig?.worldHeight - 1}
      placeholder="Y"
    />
    <!-- SUBMIT -->
    <button disabled={$calculatedEnergy[$playerEntityId] < 20 || coresNotMe.length === 0} on:click={sendTestMove}>Move</button>
  </div>
{/if}
