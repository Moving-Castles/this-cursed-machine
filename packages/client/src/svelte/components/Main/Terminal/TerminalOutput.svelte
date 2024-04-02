<script lang="ts">
  import type { Output } from "@components/Main/Terminal/types"
  import { TERMINAL_OUTPUT_TYPE } from "@components/Main/Terminal/enums"
  export let output: Output
</script>

<p class="output-content {TERMINAL_OUTPUT_TYPE[output.type]}">
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
      // margin-bottom: 1px;
    }

    .symbol {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
    }

    &.COMMAND {
      color: var(--background);
      .content {
        background: var(--foreground);
      }
    }

    &.ERROR {
      color: var(--color-failure);
    }

    &.NORMAL {
      color: var(--foreground);
    }

    &.SUCCESS {
      color: var(--color-success);
    }

    &.INFO {
      color: var(--color-info);
    }

    &.ALERT {
      color: var(--color-alert);
    }
  }
</style>
