<script>
  import { forceX, forceY, forceCollide, forceRadial } from "d3-force"

  import Force from "./Force.svelte"

  export let radius = 100
  export let numberOfDots = 10

  let w = 0
  let h = 0

  let element
  let useForceCollide = true
  let useForceRadial = true

  $: centerPosition = [w / 2, h / 2]
  $: activeForceX = forceX().x(centerPosition[0])
  $: activeForceY = forceY().y(centerPosition[1])
  $: activeForceCollide = forceCollide().radius(radius).iterations(30)
  $: activeForceRadial = forceRadial()
    .radius(radius)
    .x(centerPosition[0])
    .y(centerPosition[1])
  $: forces = [
    ["x", activeForceX],
    ["y", activeForceY],
    useForceCollide && ["collide", activeForceCollide],
    useForceRadial && ["radial", activeForceRadial],
  ].filter(d => d)

  $: dots = new Array(numberOfDots).fill(0).map(_ => ({}))

  const onClick = e => {
    if (!element) return
    const bounds = element.getBoundingClientRect()
    const x = e.clientX - bounds.left
    const y = e.clientY - bounds.top
    centerPosition = [x, y]
  }
</script>

<div class="controls">
  <label>
    <input type="checkbox" bind:checked={useForceCollide} />
    Collide?
  </label>
  <label>
    <input type="checkbox" bind:checked={useForceRadial} />
    Radial?
  </label>
  <label>
    <input type="range" bind:value={radius} min={1} max={1000} />
    Radius
  </label>
  <label>
    <input type="range" bind:value={numberOfDots} min={1} max={100} />
    Amount of dots
  </label>
</div>
<div class="note">Click around to update</div>

<svelte:window bind:innerWidth={w} bind:innerHeight={h} />

<div on:click={onClick} bind:this={element}>
  <Force {forces} {dots} />
</div>

<style>
  .controls {
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    font-style: italic;
    color: var(--text-light);
    z-index: 200;
  }
  label + label {
    margin-left: 1em;
  }
  .note {
    position: absolute;
    top: 0;
    font-style: italic;
    color: var(--text-light);
  }
</style>
