<script lang="ts">
  import { OutputType, type Output } from "./types"
  export let output: Output
</script>

<p class="output-content {OutputType[output.type]}">
  <span class="symbol">{output.symbol}</span>
  {@html output.text}
</p>

<style lang="scss">
  .output-content {
    display: block;
    width: 100%;
    padding: 0;
    margin: 0;

    &.ERROR {
      color: var(--color-failure);
    }

    &.NORMAL {
      color: var(--color-alert);
    }

    &.SUCCESS {
      color: var(--color-success);
    }
    &.HELP {
      color: #534bce;
    }

    &.SPECIAL {
      color: #d013d0;
    }

    &.INFO {
      color: #50908e;
    }
  }
</style>
