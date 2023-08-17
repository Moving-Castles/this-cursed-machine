<script lang="ts">
  import { setContext } from "svelte"
  import MachineDefinition from "./Machines/MachineDefinition.svelte"
  import { BuildableEntityType, EntityType } from "../../modules/state/types"
  import {
    playerCanAffordOrgan,
    playerCanAffordControl,
  } from "../../modules/state"
  import { build } from "../../modules/action"

  // export let tile: GridTile
  // const buildableEntity = getContext("buildableEntity") as BuildableEntity
  export let buildableEntity: buildableEntity
  const tile = getContext("tile") as GridTile
  console.log(buildableEntity, tile)
  const canAffordOrgan = playerCanAffordOrgan(buildableEntity.cost)

  import { getContext } from "svelte"
  // setContext("tile", tile)
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<button
  class="action"
  disabled={!$canAffordOrgan}
  on:click={() =>
    build(buildableEntity.type, tile.coordinates.x, tile.coordinates.y)}
>
  {buildableEntity.name}
</button>
