<script lang="ts">
  import type { AssistantMessage } from "."
  import { assistantMessages } from "."
  import AssistantMessageComponent from "./AssistantMessage.svelte"
  import { fly } from "svelte/transition"
  import { flip } from "svelte/animate"

  const onEnd = (e: CustomEvent<AssistantMessage>) => {
    assistantMessages.set(
      $assistantMessages.filter(
        (t: AssistantMessage) => t.timestamp !== e.detail.timestamp
      )
    )
  }
</script>

<div class="toast-pane">
  {#each $assistantMessages as msg (msg.timestamp + $assistantMessages.length)}
    <div animate:flip in:fly={{ y: 20, delay: 150 }}>
      <AssistantMessageComponent {msg} on:end={onEnd} />
    </div>
  {/each}
</div>

<style>
  .toast-pane {
    position: absolute;
    z-index: var(--z-1);
    bottom: 75px;
    right: 20px;
    display: flex;
    flex-direction: column-reverse;
    width: 480px;
    text-align: center;
  }
</style>
