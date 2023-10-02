<script lang="ts">
  import { setContext } from "svelte"
  import { EntityType } from "../../modules/state/enums"
  import { playerCanAffordMachine } from "../../modules/state"
  import { build } from "../../modules/action"

  export let buildableMachine: BuildableMachine

  const tile = getContext("tile") as GridTile

  const canAffordMachine = playerCanAffordMachine(buildableMachine.cost)

  import { getContext } from "svelte"
  // setContext("tile", tile)
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<button
  class="action"
  disabled={!$canAffordMachine}
  on:click={() =>
    build(buildableMachine.type, tile.coordinates.x, tile.coordinates.y)}
>
  {buildableMachine.name}
</button>
