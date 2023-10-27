<script lang="ts">
  import { OutputType, type Output } from "./types"
  export let output: Output
</script>

<p class="output-content {OutputType[output.type]}">
  <span class="symbol">{output.symbol}</span>
  <span class="content">{@html output.text}</span>
</p>

<style lang="scss">
  .output-content {
    display: block;
    width: 100%;
    padding: 0;
    margin: 0;
    position: relative;

    .content {
      padding-left: 2ch;
      display: inline-block;
    }

    .symbol {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
    }

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

    &.SPECIALINV {
      color: #000;
      background: #d013d0;
    }

    &.INFO {
      color: #50908e;
    }
  }
</style>
