<script lang="ts">
  import { name } from "../../modules/action"
  import { playerCore } from "../../modules/state"

  let newName = ""

  const submitName = () => {
    if (!newName) return
    name(newName)
  }
</script>

{#if !$playerCore.name}
  <div class="name-form">
    <input type="text" bind:value={newName} />
    <button on:click={submitName}>Submit</button>
  </div>
{:else}
  Hello {$playerCore.name}
{/if}
