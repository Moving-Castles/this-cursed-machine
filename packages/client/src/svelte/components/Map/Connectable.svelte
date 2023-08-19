<script lang="ts">
  import { onDragStart, onDragOver } from "../../modules/ui/events"
  import {
    inputsForEntity,
    outputsForEntity,
    hoverDestination,
    pathfindingExceptions,
  } from "../../modules/state"
  import { sameCoordinate } from "../../modules/utils/space"
  import { getContext } from "svelte"
  import Port from "./Port.svelte"

  export let available = false
  export let active = false
  export let entity: EntityStoreEntry

  const inputs = inputsForEntity(entity.address)
  const outputs = outputsForEntity(entity.address)
  const tile = getContext("tile")

  let padding = "8px"

  const onMouseEnter = () => {
    available = true
    console.log("on mouse enter")
    pathfindingExceptions.set([...$pathfindingExceptions, tile.coordinates])
    hoverDestination.set(tile.coordinates)
  }

  const onMouseLeave = () => {
    available = false
    pathfindingExceptions.set([
      ...$pathfindingExceptions.filter(
        coord => !sameCoordinate(coord, tile.coordinates)
      ),
    ])
  }
</script>

<div
  class="connectable rotate-{entity.entity?.rotation}"
  style="--padding: {padding}"
  on:dragstart={e => onDragStart(e, entity.address)}
  on:dragover={() => onDragOver(entity.entity.position)}
  on:mouseenter={onMouseEnter}
  on:mouseleave={onMouseLeave}
>
  <div class="ports-left">
    {#each Object.entries($inputs) as [address, i] (i)}
      <Port {address} port={i} />
    {/each}
  </div>

  <div class="ports-right">
    {#each Object.entries($outputs) as [address, o] (o)}
      <Port {address} port={o} />
    {/each}
  </div>
  <slot />
</div>

<style lang="scss">
  .connectable {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .ports-left {
    position: absolute;
    left: 0;
    height: 100%;
    width: 10px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: end;
    gap: 4px;
    z-index: 999;
  }
  .ports-right {
    position: absolute;
    right: 0;
    height: 100%;
    width: 10px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: start;
    gap: 4px;
    z-index: 999;
  }

  @mixin portInActiveTransform($deg) {
    transform: translate(-50%, -50%) rotate($deg);
  }

  @mixin portAvailableTransform($deg) {
    transform: translate(-50%, -50%) rotate($deg)
      translate(0, calc(var(--tilesize) / 2))
      translateY(calc(var(--padding) * -1));
  }

  /* States:          */
  /* Inactive:        */
  /*                  */
  /* Available        */
  /*                  */
  /* Active           */
  /*                  */
  .port.bottom {
    @include portInActiveTransform(0deg);

    &.available {
      @include portAvailableTransform(0deg);
    }
  }
  .port.left {
    @include portInActiveTransform(90deg);

    &.available {
      @include portAvailableTransform(90deg);
    }
  }
  .port.top {
    @include portInActiveTransform(180deg);

    &.available {
      @include portAvailableTransform(180deg);
    }
  }
  .port.right {
    @include portInActiveTransform(270deg);

    &.available {
      @include portAvailableTransform(270deg);
    }
  }
</style>
