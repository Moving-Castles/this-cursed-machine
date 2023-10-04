<script lang="ts">
  import { playerBox } from "../../modules/state"
  import {
    currentGoalIndex,
    progressions,
    achieved,
  } from "../../modules/ui/progression"
  import { MachineType } from "../../modules/state/enums"
  import { createEventDispatcher } from "svelte"
  import {
    simulatedPlayerCore,
    simulatedConnections,
    simulatedPorts,
    simulatedMachines,
  } from "../../modules/simulator"

  const dispatch = createEventDispatcher()

  // $: currentGoal = $progressions[$playerBox.level][$currentGoalIndex]
  $: currentGoal = $progressions[0][0]

  // Here we monitor player performance
  $: {
    // If the player has connected to the inlet
    const connectionsAsTypesArray = Object.values($simulatedConnections).map(
      connection => [
        MachineType[
          $simulatedMachines[$simulatedPorts[connection.sourcePort].carriedBy]
            .machineType
        ],
        MachineType[
          $simulatedMachines[$simulatedPorts[connection.targetPort].carriedBy]
            .machineType
        ],
      ]
    )

    if (
      connectionsAsTypesArray.some(con => con.includes("CORE")) &&
      connectionsAsTypesArray.some(con => con.includes("INLET")) &&
      !$achieved.includes(0)
    ) {
      $achieved = [...$achieved, 0]
      dispatch("reward", $progressions[$playerBox.level][0].reward)
    }
  }

  const onClick = () => {
    if (Math.random() < 0.05) {
      dispatch("hint")
    }
  }

  $: $currentGoalIndex = $achieved.length
</script>

<div class="goal-container" on:click={onClick}>
  <div class="top-left">Do this:</div>
  <div class="goal">
    {currentGoal.goal}
  </div>
</div>

<style>
  .top-left {
    position: absolute;
    top: 0;
    left: 0;
    padding: 1rem;
    color: #ccc;
  }
  .goal-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    text-align: center;
  }
</style>
