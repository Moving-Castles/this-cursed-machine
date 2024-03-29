<script lang="ts">
  import { onMount } from "svelte"
  import type { AssistantMessage } from "."
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher<{ end: AssistantMessage }>()

  export let msg: AssistantMessage

  const close = () => dispatch("end", msg)

  onMount(() => {
    if (msg.disappear) {
      setTimeout(close, 3000)
    }
  })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="msg absolute">
  <img src="/images/bugsy.gif" alt="bugsy" />
  <p>
    {msg.message}
  </p>
</div>

<style lang="scss">
  .msg {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    color: var(--background);
    padding: 10px;
    padding-top: 0;
    text-align: center;
    background: var(--foreground);
    margin-top: 10px;
    font-size: var(--font-size);
    overflow: hidden;
    // border: 1px solid white;
    white-space: pre-wrap;
    text-align: left;
    font-family: var(--font-family-handwriting);
    font-size: 22px;
    line-height: 1em;
    font-weight: bold;
    border-radius: 5px;
    background: rgba(255, 255, 95, 0.9);
    text-align: center;
    // box-shadow: rgba(255, 255, 95, 0.9) 0px 0px 10px 0px;

    img {
      width: 80px;
      margin: 0 auto;
      margin: 10px;
      margin-left: auto;
      margin-right: auto;
    }
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
