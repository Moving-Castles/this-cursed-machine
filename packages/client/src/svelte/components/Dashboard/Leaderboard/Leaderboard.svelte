<script lang="ts">
  import type { ExtendedPlayer } from "../types"
  import { completedplayers } from ".."
  import LeaderboardItem from "./LeaderboardItem.svelte"
  import LeaderboardHeader from "./LeaderboardHeader.svelte"
  import { PROGRESSION_PAR_TIME } from "../../../modules/state"

  const calculateLeaderBoard = (players: Players): ExtendedPlayer[] => {
    let orderedList: ExtendedPlayer[] = []

    Object.values(players).forEach(player => {
      const extendedPlayer: ExtendedPlayer = {
        ...player,
        score: 0,
        totalCompletionTime: 0,
      }

      // Calculate the total completion time
      let totalCompletionTime = extendedPlayer.completionTimes.reduce(
        (acc, curr) => acc + Number(curr),
        0,
      )

      extendedPlayer.totalCompletionTime = totalCompletionTime

      // Calculate the percentage over PROGRESSION_PAR_TIME
      let percentageOverPar = 0
      if (totalCompletionTime > PROGRESSION_PAR_TIME) {
        percentageOverPar =
          ((totalCompletionTime - PROGRESSION_PAR_TIME) /
            PROGRESSION_PAR_TIME) *
          100
      }

      // Calculate the splayer
      extendedPlayer.score = Math.floor(Math.max(100 - percentageOverPar, 0))

      // Add the extendedplayer to orderedList
      orderedList.push(extendedPlayer)
    })

    // Sort the list in ascending order based on totalCompletionTime
    orderedList.sort((a, b) => a.totalCompletionTime - b.totalCompletionTime)

    return orderedList
  }

  let leaderBoard: ExtendedPlayer[] = calculateLeaderBoard($completedplayers)
  $: leaderBoard = calculateLeaderBoard($completedplayers)
</script>

<div class="leaderboard">
  <div class="header">
    <div>
      <div class="line">
        <span>******************</span>
      </div>
      <div>
        <span>STUMP OF THE MONTH</span>
      </div>
      <div class="line">
        <span>******************</span>
      </div>
    </div>
  </div>

  <div class="warning">
    <div>
      <div>
        <span>Expected completion time: {PROGRESSION_PAR_TIME}</span>
      </div>
    </div>
  </div>

  <div class="listing">
    <LeaderboardHeader />
    {#each leaderBoard as player, index}
      <LeaderboardItem {index} {player} />
    {/each}
  </div>
</div>

<style lang="scss">
  .leaderboard {
    width: 50%;
    height: 100vh;
    border-right: 5px double var(--color-border);
    overflow-y: scroll;

    .header {
      padding-top: 20px;
      padding-bottom: 1em;
      padding-left: 20px;
      div {
        span {
          display: inline-block;
          background: var(--color-info);
          color: black;
        }
      }
    }

    .warning {
      padding-bottom: 1em;
      padding-left: 20px;
      div {
        span {
          display: inline-block;
          background: var(--color-failure);
          color: black;
        }
      }
    }

    .listing {
      padding-top: 1em;
      padding-left: 20px;
      height: 100vh;
      overflow: hidden;
      border-top: 5px double var(--color-border);
    }
  }
</style>
