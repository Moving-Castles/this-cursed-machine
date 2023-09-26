<script lang="ts">
  import { onWheel } from "../../modules/ui/events"
  import { playerCore } from "../../modules/state"
  import { hexToString } from "../../modules/utils/misc"
  import { createEventDispatcher } from "svelte"

  export let box: Box

  const dispatch = createEventDispatcher()
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="box-stats" use:onWheel>
  <p>
    *** XXXXXXXXXXXXXXXX ***<br />XXX YOUR SKINNER BOX XXX
    <br />*** XXXXXXXXXXXXXXXX ***<br /><br />

    ID (encoded):<br />
    {hexToString($playerCore.carriedBy)}
    <br />
    <br />
  </p>

  <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
  <p
    role="button"
    class="agreement"
    on:click={() => {
      // terminal send some text
      dispatch("read")
    }}
  >
    ************************<br />*** READ &nbsp;&nbsp;AGREEMENT ***<br
    />************************
    <br />
  </p>
</div>

<style>
  .box-stats {
    width: 100%;
    height: 100%;
    position: relative;
    display: block;
    margin: 0;
    overflow: scroll;
    text-align: center;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
  }
  .agreement-button {
    position: absolute;
    bottom: 0;
    right: 0;
  }
</style>
