<script lang="ts">
  import type { ExtendedPlayer } from "../types"
  export let index: number
  export let player: ExtendedPlayer
  export let self: boolean = false
</script>

<div class="leaderboard-item" class:self>
  <div class="index">#{index + 1}</div>
  <div class="name">{player.name}</div>
  <div class="time">{player.totalCompletionTime}</div>
  <div class="score">{player.score}</div>
</div>

<style lang="scss">
  .line {
    padding-left: 5px;
  }

  .leaderboard-item {
    display: flex;
    padding-bottom: 1em;

    .index {
      width: 8ch;
    }

    .name {
      width: 50%;
      color: var(--color-alert);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding-right: 2ch;
    }

    .time {
      width: 25%;
    }

    .splayer {
      width: 25%;
      color: var(--color-success);
    }
  }
</style>
