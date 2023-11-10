<script lang="ts">
  import Leaderboard from "./Leaderboard/Leaderboard.svelte"
  import WarehouseStatus from "./WarehouseStatus/WarehouseStatus.svelte"
</script>

<div class="dashboard">
  <Leaderboard />
  <WarehouseStatus />
</div>

<style lang="scss">
  .dashboard {
    position: fixed;
    inset: 0;
    background-color: black;
    background-size: cover;
    background-position: center;
    z-index: 1;
    display: flex;
    user-select: none;
  }
</style>
