<script lang="ts">
  export let visible: boolean;
</script>

{#if visible}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="backSide" on:click={() => (visible = false)}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="dialog" on:click={() => (visible = false)}>
      <slot />
    </div>
  </div>
{/if}

<style>
  .backSide {
    position: fixed;
    inset: 0;
    z-index: 999999;
  }

  .dialog {
    font-size: 32px;
  }
</style>
