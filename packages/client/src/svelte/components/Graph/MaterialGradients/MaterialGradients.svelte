<script lang="ts">
  import { MaterialType } from "../../../modules/state/enums"
</script>

{#each Object.keys(MaterialType).filter(t => typeof parseInt(t) === "number") as type}
  <linearGradient
    id="gradient-{MaterialType[type]}"
    x1="0%"
    y1="0%"
    x2="100%"
    y2="0%"
  >
    <stop offset="0%" stop-color="var(--{MaterialType[type]})" />
    <stop offset="100%" stop-color="var(--STATE_INACTIVE)" />
  </linearGradient>
{/each}
