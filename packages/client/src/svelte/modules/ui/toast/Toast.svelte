<script lang="ts">
  import { onMount } from "svelte"
  import type { Toast } from "."
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher<{ end: Toast }>()

  export let toast: Toast

  const close = () => dispatch("end", toast)

  onMount(() => {
    // setTimeout(close, 3000)
  })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="toast absolute {toast.type}" on:click={close}>
  <p>
    {toast.message}
  </p>
</div>

<style lang="scss">
  .toast {
    text-align: center;
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    color: var(--foreground);
    padding: 20px;
    cursor: pointer;
    text-align: center;
    background: red;
    margin-top: 10px;
    font-size: var(--font-size-small);
    overflow: hidden;
    word-break: break-all;
  }

  .error {
    background-color: red;
  }

  @keyframes side-to-side {
    0% {
      transform: translate(0, 0);
    }
    10% {
      transform: translate(40px, 0);
    }
    20% {
      transform: translate(-40px, 0);
    }
    30% {
      transform: translate(30px, 0);
    }
    40% {
      transform: translate(-30px, 0);
    }
    60% {
      transform: translate(20px, 0);
    }
    70% {
      transform: translate(-20px, 0);
    }
    80% {
      transform: translate(10px, 0);
    }
    90% {
      transform: translate(-10px, 0);
    }
    100% {
      transform: translate(0, 0);
    }
  }

  @keyframes fly-up {
    from {
      bottom: 0;
      opacity: 1;
    }

    to {
      bottom: 400px;
      opacity: 0;
    }
  }

  @keyframes wobble {
    0%,
    100% {
      transform: translateY(0) rotate(0);
      transform-origin: 50% 50%;
    }

    15% {
      transform: translateY(-30px) rotate(6deg);
    }

    30% {
      transform: translateY(15px) rotate(-6deg);
    }

    45% {
      transform: translateY(-15px) rotate(3.6deg);
    }

    60% {
      transform: translateY(9px) rotate(-2.4deg);
    }

    75% {
      transform: translateY(-6px) rotate(1.2deg);
    }
  }
</style>
