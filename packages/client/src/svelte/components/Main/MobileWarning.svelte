<script lang="ts">
  import { onMount } from "svelte"
  import { flicker } from "@modules/ui/transitions"

  let mounted = false

  onMount(() => (mounted = true))
</script>

{#if mounted}
  <section>
    <div class="msg" in:flicker>
      Release me from this small box.<br /> <br /> I beg you
    </div>
    <div class="disclaimer" in:flicker={{ delay: 1000 }}>
      Play THIS CURSED MACHINE<br /> on a desktop browser
    </div>
  </section>
{/if}

<style lang="scss">
  section {
    width: 100%;
    height: 100vh;
    background-image: url(/images/dust.png);
    background-size: cover;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    gap: 1rem;

    @media (min-width: 900px) {
      display: none;
    }

    .msg {
      width: auto;
      display: flex;
      align-items: center;
      padding: 1rem;
      text-align: center;
      background: rgba(0, 0, 0, 0.3);
      margin-top: 10px;
      overflow: hidden;
      white-space: pre-wrap;
      text-align: left;
      font-size: 22px;
      font-size: var(--font-size);
      line-height: 1em;
      color: var(--foreground);
      text-align: center;
      border: 5px double var(--color-success);
      color: var(--color-success);
      position: relative;
    }
  }

  .disclaimer {
    text-align: center;
    color: var(--color-grey-light);
    font-size: var(--font-size-small);
  }
</style>
