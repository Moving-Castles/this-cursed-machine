<script lang="ts">
  import { onMount } from "svelte"
  import { strobe } from "../../../modules/ui/transitions"
  import { playerGoals } from "../../../modules/state"
  import { MaterialType } from "../../../modules/state/enums"
  import { boxOutput } from "../../../modules/simulator"
  import { materialTypeToLabel } from "../../../modules/state/convenience"
  let mounted = false
  const goalTypes = $playerGoals
    .map(goal => {
      return MaterialType[goal?.materialType]
    })
    .filter(g => g !== "NONE")
  $: goalCompletions = Object.fromEntries(
    $playerGoals.map(goal => {
      const percentage =
        Math.round(($boxOutput[goal.materialType] / goal?.amount) * 100) || 0
      const overflow = Math.max(0, $boxOutput[goal.materialType] - goal?.amount)
      return [
        goal.materialType,
        {
          percentage,
          value: $boxOutput[goal.materialType] ?? 0,
          target: goal?.amount,
          overflow,
        },
      ]
    })
  )
  onMount(() => {
    mounted = true
  })
</script>

{#if mounted}
  <div in:strobe={{ duration: 1000, steps: 3 }} class="goals">
    <div class="goals">
      {#each goalTypes as goal}
        <div class="goal" style:color="var(--{goal})">
          <span class="label">
            {materialTypeToLabel(MaterialType[goal])}:
          </span>
          {#key goalCompletions[MaterialType[goal]]?.overflow}<span
              style:color={goalCompletions[MaterialType[goal]]?.overflow > 0
                ? "red"
                : "currentColor"}
              in:strobe>{goalCompletions[MaterialType[goal]].value}</span
            >{/key} / {goalCompletions[MaterialType[goal]].target}
          <!-- <div style:border-color="var(--{goal})" class="bar dotted">
            <div
              class="bar-fill"
              style:background-color="var(--{goal})"
              style:width="{Math.min(
                goalCompletions[MaterialType[goal]].percentage,
                100
              )}%"
            />
          </div> -->
          <!-- This is overflow -->
          <!-- {#if goalCompletions[MaterialType[goal]].overflow > 0}
            {#key goalCompletions[MaterialType[goal]].overflow}
              <span in:strobe={{ steps: 4, duration: 500 }}>
                +{goalCompletions[MaterialType[goal]].overflow}
              </span>
            {/key}
          {/if} -->
        </div>
      {/each}
      {#each Object.entries($boxOutput) as [type, amount] (type)}
        {#if !goalTypes.includes(MaterialType[type])}
          <div class="goal {MaterialType[type]}">
            <div class="label">
              {materialTypeToLabel(type)}:
            </div>
            {#key amount}
              <div style:color="red" in:strobe>
                {amount}
              </div>
            {/key}
          </div>
        {/if}
      {/each}
    </div>
  </div>
{/if}

<style lang="scss">
  .goal {
    display: flex;
    gap: 1ch;
  }

  .label {
    display: inline-block;
    width: 10ch;
  }

  .goals {
    display: flex;
    flex-flow: column nowrap;
  }

  .bar {
    width: 15ch;
    height: 26px;
    border-width: 2px;
    border-style: solid;
    position: relative;
  }

  .bar-fill {
    position: absolute;
    width: 0;
    left: 0;
    height: 100%;
    transition: all 0.4s steps(3);
  }
</style>
