<script lang="ts">
  import type { Toast } from "../../modules/ui/toast"
  import { toasts, toastMessage } from "../../modules/ui/toast"
  import ToastComponent from "./Toast.svelte"
  import { fade } from "svelte/transition"
  import { flip } from "svelte/animate"

  const onEnd = (e: CustomEvent<{ end: Toast }>) => {
    toasts.set($toasts.filter((t: Toast) => t.timestamp !== e.detail.timestamp))
  }

  // setInterval(() => {
  //   toastMessage("Testing")
  // }, 5000)
</script>

<div class="toast-pane">
  {#each $toasts as toast (toast.timestamp)}
    <div animate:flip in:fade out:fade>
      <ToastComponent {toast} on:end={onEnd} />
    </div>
  {/each}
</div>

<style>
  .toast-pane {
    position: absolute;
    z-index: 99;
    bottom: 10px;
    right: 10px;
    display: flex;
    flex-direction: column-reverse;
    pointer-events: none;
    width: 400px;
    text-align: center;
  }
</style>
