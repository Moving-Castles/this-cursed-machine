<script lang="ts">
  import { playerCore } from "../../modules/state"
  import { createEventDispatcher } from "svelte"
  import Terminal from "../Terminal/Terminal.svelte"
  import { COMMAND } from "../Terminal/types"

  const dispatch = createEventDispatcher()

  const handleCommand = async (e: any) => {
    if (e.detail.command.id === COMMAND.BLINK) {
      dispatch("transfer")
    }
  }
</script>

<div class="completed-level">
  <div class="text-content">
    <div class="level-title">◊ COMPLETED order #{$playerCore.level}</div>

    <div class="terminal-container">
      <Terminal
        on:commandExecuted={handleCommand}
        noOutput
        inputActive
        placeholder="blink"
      />
    </div>
  </div>

  <div class="level-gradient level-background" />

  {#if $playerCore.level > 3}
    <img
      src="/images/rewards/1-.png"
      class="level-background"
      alt="level reward"
    />
  {:else}
    <img
      src="/images/rewards/{$playerCore.level}-.png"
      class="level-background"
      alt="level reward"
    />
  {/if}

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
  }

  .level-gradient {
    z-index: -1 !important;
    background: linear-gradient(
      to bottom,
      black 0%,
      black 120px,
      rgba(0, 0, 0, 0.2) 140px,
      rgba(0, 0, 0, 0.2) calc(100% - 140px),
      black calc(100% - 120px),
      black 100%
    );
  }
  .level-background {
    width: 100%;
    height: 100%;
    object-fit: contain;
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: -2;
  }

  .text-content {
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    // mix-blend-mode: screen;
  }

  .terminal-container {
    width: 100%;
  }
</style>
