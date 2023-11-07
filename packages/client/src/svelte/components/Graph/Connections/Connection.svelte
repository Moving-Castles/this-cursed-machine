<script lang="ts">
  import { ConnectionState } from "../../../modules/state/enums"
  import { graphPulse } from "../../../modules/ui/stores"
  import { tweened } from "svelte/motion"
  import { expoIn } from "svelte/easing"
  import { draw } from "svelte/transition"
  import { get } from "svelte/store"
  export let d: string
  export let stroke: string
  export let state: string
  export let transform: string

  const [STROKE, GAP] = [16, 50]

  let localPulse = tweened(0, { duration: 1000, easing: expoIn })
  let freeze = get(graphPulse)

  $: {
    $localPulse = state === ConnectionState.FLOWING ? $graphPulse * GAP : freeze
  }

  $: if (state !== ConnectionState.FLOWING) freeze = get(graphPulse) * GAP
</script>

<path
  class="path"
  in:draw={{ duration: 300 }}
  out:draw={{ duration: 300 }}
  {d}
  fill="none"
  stroke="var(--STATE_INACTIVE)"
  stroke-width="12"
  {transform}
/>

<path
  class="path"
  {d}
  {stroke}
  {transform}
  fill="none"
  stroke-dasharray="{STROKE}, {GAP}"
  stroke-width={STROKE}
  stroke-dashoffset={$localPulse}
  stroke-linecap="butt"
/>
