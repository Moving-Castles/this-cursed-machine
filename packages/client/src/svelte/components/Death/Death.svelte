<script lang="ts">
  import { restart } from "../../modules/action"
</script>

<div class="dead">
  <h1 class="xl-text text-outline centered">DEAD</h1>
  <button on:click={restart} class="btn">Respawn</button>
</div>

<style lang="scss">
  .dead {
    position: fixed;
    inset: 0;
    z-index: 999;
    background: black;
  }

  .btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
