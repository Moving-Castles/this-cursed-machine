<script lang="ts">
  import type { AssistantMessage } from "."
  import { assistantMessages } from "."
  import { tutorialProgress } from "@modules/ui/assistant"
  import AssistantMessageComponent from "./AssistantMessage.svelte"
  import { fly } from "svelte/transition"
  import { flip } from "svelte/animate"

  const delays = {
    1: 2000,
    2: 1000,
    3: 1000,
    8: 2000,
  }

  const onEnd = (e: CustomEvent<AssistantMessage>) => {
    assistantMessages.set(
      $assistantMessages.filter(
        (t: AssistantMessage) => t.timestamp !== e.detail.timestamp
      )
    )
  }

  $: delay = delays?.[$tutorialProgress] || 500
</script>

<div class="toast-pane">
  {#each $assistantMessages as msg (msg.timestamp + $assistantMessages.length)}
    <div animate:flip in:fly={{ y: 20, delay }}>
      <AssistantMessageComponent {msg} on:end={onEnd} {delay} />
    </div>
  {/each}
</div>

<style>
  .toast-pane {
    position: absolute;
    z-index: var(--z-9);
    bottom: 75px;
    right: 20px;
    display: flex;
    flex-direction: column-reverse;
    width: 480px;
    text-align: center;
  }
</style>
