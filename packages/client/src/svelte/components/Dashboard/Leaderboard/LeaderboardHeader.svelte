<div class="leaderboard-header">
  <div class="index"><span>#</span></div>
  <div class="name"><span>NAME</span></div>
  <div class="time"><span>TIME</span></div>
  <div class="score"><span>SCORE</span></div>
</div>

<style lang="scss">
  .leaderboard-header {
    display: flex;
    padding-bottom: 1em;

    .index {
      width: 8ch;
    }

    .name {
      width: 50%;
    }

    .time {
      width: 25%;
    }

    .score {
      width: 25%;
    }

    div {
      span {
        background: var(--color-help);
        color: black;
      }
    }
  }
</style>
