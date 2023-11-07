<script lang="ts">
  import { ConnectionState } from "../../../modules/state/enums"
  import { graphPulse } from "../../../modules/ui/stores"
  import { spring } from "svelte/motion"
  import { draw } from "svelte/transition"
  import { get } from "svelte/store"
  export let d: string
  export let stroke: string
  export let state: string
  export let transform: string

  const [STROKE, GAP] = [20, 50]

  let localPulse = spring(0, { stiffness: 0.1, damping: 0.2 })
  let freeze = 0

  $: {
    $localPulse = state === ConnectionState.FLOWING ? $graphPulse * GAP : freeze
  }

  $: if (state !== ConnectionState.FLOWING) freeze = get(graphPulse) * GAP
</script>

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
