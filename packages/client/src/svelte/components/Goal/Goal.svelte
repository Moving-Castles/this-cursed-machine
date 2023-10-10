<script lang="ts">
  import { ports } from "../../modules/state"
  import {
    currentGoalIndex,
    progressions,
    achieved,
  } from "../../modules/ui/progression"
  import { connections, playerEntityId } from "../../modules/state"
  import { MachineType } from "../../modules/state/enums"
  import { createEventDispatcher } from "svelte"
  import {
    simulatedMachines,
    simulatedPorts,
    simulatedPlayerEnergy,
  } from "../../modules/simulator"

  const dispatch = createEventDispatcher()

  $: currentProgression = $progressions[0]

  /** Monitor player's performance here */
  $: {
    let playerConnected = false

    // CHeck connections for sourcePort that belongs to the inlet machine
    const myInlet = Object.entries($simulatedMachines).find(
      ([_, machine]) => machine.machineType === MachineType.INLET
    )

    if (myInlet) {
      const connectionWithInletSource = Object.entries($connections).find(
        ([_, conn]) => {
          return $ports[conn.sourcePort]?.carriedBy === myInlet[0]
        }
      )

      if (connectionWithInletSource) {
        const p = $simulatedPorts[connectionWithInletSource[1].targetPort]
        if (p.carriedBy === $playerEntityId) {
          playerConnected = true
        }
      }
    }
    //

    // Achievement 1 unlocked
    if (playerConnected && !$achieved.includes(0)) {
      $achieved = [...$achieved, 0]
    }
  }

  $: {
    if ($simulatedPlayerEnergy > 200 && !$achieved.includes(1)) {
      $achieved = [...$achieved, 1]
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
  <div class="top-left">Goal:</div>
  <div class="goal">
    <!-- {$currentGoalIndex} -->
    {currentProgression[$currentGoalIndex].goal}
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
