<script lang="ts">
  import { MATERIAL_TYPE } from "../../../../modules/state/base/enums"
</script>

{#each Object.keys(MATERIAL_TYPE).filter(t => typeof parseInt(t) === "number") as type}
  <linearGradient
    id="gradient-{MATERIAL_TYPE[type]}"
    x1="0%"
    y1="0%"
    x2="100%"
    y2="0%"
  >
    <stop offset="0%" stop-color="var(--{MATERIAL_TYPE[type]})" />
    <stop offset="100%" stop-color="var(--STATE_INACTIVE)" />
  </linearGradient>
{/each}
